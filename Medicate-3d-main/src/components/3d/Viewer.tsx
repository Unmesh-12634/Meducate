import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { useOREnvironment } from './OREnvironment';
import type { NormalizedLandmark, GestureControls } from './HandGestureController';

// MediaPipe hand bone connections (21 landmarks)
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20],
  [0, 5], [5, 9], [9, 13], [13, 17], [0, 17],
];

interface ViewerProps {
  mode?: 'normal' | 'dissection' | 'pathology';
  selectedOrgan?: string;
  selectedTool?: string;
  gestureControls?: GestureControls | null;
  gestureEnabled?: boolean;
  voiceEnabled?: boolean;
  lastCommand?: any;
  onSelectObject?: (name: string, screenshot?: string) => void;
  orTheater?: boolean;
  /** Smoothed hand landmarks from HandGestureController for the overlay skeleton */
  handLandmarks?: NormalizedLandmark[][] | null;
}

// Configuration for Models
const MODELS: Record<string, { path: string; scale: THREE.Vector3; position: THREE.Vector3; rotation: THREE.Euler }> = {
  heart: {
    path: '/heart.glb',
    scale: new THREE.Vector3(1000, 1000, 1000),
    position: new THREE.Vector3(0, -5, 0), // Centered better
    rotation: new THREE.Euler(0, 0, 0) // Reset rotation to upright
  },
  brain: {
    path: '/brain.glb',
    scale: new THREE.Vector3(0.1, 0.1, 0.1),
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, -Math.PI / 2, 0)
  },
};

export function Viewer({
  mode = 'normal',
  selectedOrgan = 'heart',
  selectedTool = 'Scalpel',
  gestureControls = null,
  gestureEnabled = false,
  voiceEnabled = false,
  lastCommand = null,
  onSelectObject,
  orTheater = false,
  handLandmarks = null,
}: ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persistent Refs (Engine)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gestureGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const animationFrameId = useRef<number>();
  const particlesRef = useRef<THREE.Points | null>(null);

  // Store original positions for Exploded View
  const originalPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  // Dragging State for Forceps
  const draggedObjectRef = useRef<THREE.Mesh | null>(null);
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane());
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const isPinchingRef = useRef<boolean>(false);



  // ── OR Theater Environment ──────────────────────────────────────────────────
  useOREnvironment(sceneRef, orTheater);

  // State Refs (to avoid stale closures in event handlers)
  const stateRef = useRef({ mode, selectedTool, gestureEnabled, gestureControls, selectedOrgan, onSelectObject });

  useEffect(() => {
    stateRef.current = { mode, selectedTool, gestureEnabled, gestureControls, selectedOrgan, onSelectObject };
  }, [mode, selectedTool, gestureEnabled, gestureControls, selectedOrgan, onSelectObject]);

  // ── Hand overlay canvas: draw glowing skeleton on main viewport ────────────
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!handLandmarks || handLandmarks.length === 0) return;

    const W = canvas.width;
    const H = canvas.height;

    handLandmarks.forEach(landmarks => {
      // Draw glowing connectors
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00FFE0';
      ctx.strokeStyle = '#00A896';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      HAND_CONNECTIONS.forEach(([a, b]) => {
        const la = landmarks[a];
        const lb = landmarks[b];
        // Mirror X because webcam is flipped
        ctx.beginPath();
        ctx.moveTo((1 - la.x) * W, la.y * H);
        ctx.lineTo((1 - lb.x) * W, lb.y * H);
        ctx.stroke();
      });

      // Draw landmark dots
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00FFE0';
      ctx.fillStyle = '#00FFE0';
      landmarks.forEach((lm, i) => {
        const r = i === 0 ? 7 : (i % 4 === 0 ? 5 : 3.5); // wrist bigger, tips medium
        ctx.beginPath();
        ctx.arc((1 - lm.x) * W, lm.y * H, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });
  }, [handLandmarks]);

  // --- VOICE COMMAND HANDLER ---
  useEffect(() => {
    if (!lastCommand || !gestureGroupRef.current) return;

    if (lastCommand.type === 'ROTATE') {
      const speed = Math.PI / 4; // 45 degrees
      if (lastCommand.direction === 'LEFT') gestureGroupRef.current.rotation.y -= speed;
      if (lastCommand.direction === 'RIGHT') gestureGroupRef.current.rotation.y += speed;
      if (lastCommand.direction === 'UP') gestureGroupRef.current.rotation.x -= speed;
      if (lastCommand.direction === 'DOWN') gestureGroupRef.current.rotation.x += speed;
    }

    if (lastCommand.type === 'ZOOM') {
      const scaleFactor = lastCommand.direction === 'IN' ? 1.2 : 0.8;
      gestureGroupRef.current.scale.multiplyScalar(scaleFactor);
    }

    if (lastCommand.type === 'TOOL' && lastCommand.tool === 'RESET') {
      // Reset rotation and scale
      gestureGroupRef.current.rotation.set(0, 0, 0);
      gestureGroupRef.current.scale.set(1, 1, 1);
    }
  }, [lastCommand]);

  // --- 1. ENGINE INITIALIZATION (Run Once) ---
  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(65, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 2000);
    camera.position.set(0, 10, 60);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const mainLight = new THREE.DirectionalLight(0xfff0dd, 2.0);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0xddeeff, 1.0);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x00A896, 3, 50);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);


    // SCENE GRAPH
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // GESTURE GROUP (Rotated by user)
    const gestureGroup = new THREE.Group();
    rootGroup.add(gestureGroup);
    gestureGroupRef.current = gestureGroup;

    // PARTICLES (For Cut Effect)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200; // More particles
    const posArray = new Float32Array(particleCount * 3);
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.8, // Larger
      color: 0x8a0303, // Dark Red (Blood)
      transparent: true,
      opacity: 0,
      sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;


    // EVENTS - ROBUST RESIZING
    const onResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width === 0 || height === 0) return; // Ignore zero size (hidden/collapsed)

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    // Use ResizeObserver for container-based resizing (fixes layout shift issues)
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });
    resizeObserver.observe(containerRef.current);

    // Initial resize attempt
    onResize();
    window.addEventListener('resize', onResize);

    // ACTIONS
    const performCut = (object: THREE.Mesh, point: THREE.Vector3) => {
      if (!object.visible) return;
      console.log("Cutting:", object.name);

      // Visual: Scale down and Hide
      object.scale.multiplyScalar(0.9);
      setTimeout(() => object.visible = false, 50);

      // Particles
      if (particlesRef.current) {
        particlesRef.current.position.copy(point);
        (particlesRef.current.material as THREE.PointsMaterial).opacity = 1;
        setTimeout(() => {
          if (particlesRef.current) (particlesRef.current.material as THREE.PointsMaterial).opacity = 0;
        }, 300);
      }
    };

    const performRetract = (object: THREE.Mesh) => {
      console.log("Retracting:", object.name);
      // Determine direction away from center (0,0,0) and push it out
      const dir = object.position.clone().normalize();
      if (dir.lengthSq() === 0) dir.set(0, 0, -1); // fallback

      const targetPos = object.position.clone().add(dir.multiplyScalar(5));

      // Simple animation
      const startPos = object.position.clone();
      let startTime = Date.now();
      const duration = 300;

      const animateRetract = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        // easeOutQuad
        const ease = 1 - (1 - progress) * (1 - progress);
        object.position.lerpVectors(startPos, targetPos, ease);

        if (progress < 1) requestAnimationFrame(animateRetract);
      };
      animateRetract();
    };

    // MOUSE MOVE / DRAG (Simple rotation fallback + DRAG TO CUT)
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };

    const onMouseDownGlobal = () => isDragging = true;
    const onMouseUpGlobal = () => isDragging = false;
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPos.x;
      const deltaY = e.clientY - prevPos.y;
      if (gestureGroupRef.current) {
        gestureGroupRef.current.rotation.y += deltaX * 0.01;
        gestureGroupRef.current.rotation.x += deltaY * 0.01;
      }
      prevPos = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('mousedown', onMouseDownGlobal);
    window.addEventListener('mouseup', onMouseUpGlobal);

    // ANIMATION LOOP
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const { gestureEnabled, gestureControls, mode, selectedOrgan } = stateRef.current;

      // 1. Auto Rotate (Normal Mode only, no gestures)
      if (!gestureEnabled && !isDragging && mode === 'normal' && gestureGroupRef.current) {
        gestureGroupRef.current.rotation.y -= 0.005; // Left rotation
        // Smoothly return X and Z to upright (0)
        gestureGroupRef.current.rotation.x = THREE.MathUtils.lerp(gestureGroupRef.current.rotation.x, 0, 0.05);
        gestureGroupRef.current.rotation.z = THREE.MathUtils.lerp(gestureGroupRef.current.rotation.z, 0, 0.05);
      }

      // 2. Gesture Control (High Priority)
      if (gestureEnabled && gestureControls && gestureGroupRef.current) {
        gestureGroupRef.current.rotation.x = gestureControls.rotationX;
        gestureGroupRef.current.rotation.y = gestureControls.rotationY;
        const s = gestureControls.zoom;
        gestureGroupRef.current.scale.set(s, s, s);

        // --- HAND POINTER RAYCASTING ---
        if (gestureControls.pointer && cameraRef.current && gestureGroupRef.current) {
          const p = gestureControls.pointer;
          raycasterRef.current.setFromCamera(new THREE.Vector2(p.x, p.y), cameraRef.current);

          const wasPinching = isPinchingRef.current;
          isPinchingRef.current = p.isPinching;
          const { selectedTool, mode } = stateRef.current;

          // Dragging Logic (Forceps)
          if (mode === 'dissection' && selectedTool === 'Forceps') {
            if (p.isPinching && draggedObjectRef.current) {
              // We are currently holding an object, move it
              raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, dragOffsetRef.current);
              draggedObjectRef.current.position.copy(dragOffsetRef.current);

              // Highlight to show it's grabbed
              if (draggedObjectRef.current.material) {
                (draggedObjectRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xffff00);
              }
            } else if (!p.isPinching && draggedObjectRef.current) {
              // We just let go
              if (draggedObjectRef.current.material && draggedObjectRef.current.userData.originalColor) {
                (draggedObjectRef.current.material as THREE.MeshStandardMaterial).color.setHex(draggedObjectRef.current.userData.originalColor);
              }
              draggedObjectRef.current = null;
            }
          } else {
            // If we switched tools while dragging, drop it
            if (draggedObjectRef.current) {
              if (draggedObjectRef.current.material && draggedObjectRef.current.userData.originalColor) {
                (draggedObjectRef.current.material as THREE.MeshStandardMaterial).color.setHex(draggedObjectRef.current.userData.originalColor);
              }
              draggedObjectRef.current = null;
            }
          }

          // If we are NOT already holding something, see if we are pointing at something
          if (!draggedObjectRef.current) {
            const intersects = raycasterRef.current.intersectObjects(gestureGroupRef.current.children, true);
            const hit = intersects.find((i: THREE.Intersection) => i.object instanceof THREE.Mesh && i.object.visible);

            if (hit) {
              const object = hit.object as THREE.Mesh;

              // Hover effect
              if (p.isPointing || p.isPinching || p.isPencilGrip || p.isSnipping || p.isClawGrip || p.isTriggerGrip) {
                if (object.material && !object.userData.isHovered) {
                  const originalColor = (object.material as THREE.MeshStandardMaterial).color.getHex();
                  object.userData.originalColor = originalColor;
                  object.userData.isHovered = true;
                  (object.material as THREE.MeshStandardMaterial).color.setHex(0x00FFE0);
                  setTimeout(() => {
                    if (object.material) {
                      (object.material as THREE.MeshStandardMaterial).color.setHex(object.userData.originalColor);
                      object.userData.isHovered = false;
                    }
                  }, 150);
                }
              }

              // Tool-Specific Execution Logic

              const captureScreenshot = () => {
                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                  rendererRef.current.render(sceneRef.current, cameraRef.current);
                  return rendererRef.current.domElement.toDataURL('image/png');
                }
                return undefined;
              };

              if (!object.userData.isSelected) {
                if (mode === 'normal' && p.isPinching && !wasPinching) {
                  object.userData.isSelected = true;
                  const name = object.name.replace(/_/g, ' ');
                  if (stateRef.current.onSelectObject) stateRef.current.onSelectObject(name, captureScreenshot());
                } else if (mode === 'dissection') {
                  const name = object.name.replace(/_/g, ' ');

                  if (selectedTool === 'Forceps' && p.isPinching && !wasPinching) {
                    object.userData.isSelected = true;
                    // Start dragging
                    draggedObjectRef.current = object;
                    const objectWorldPos = new THREE.Vector3();
                    object.getWorldPosition(objectWorldPos);
                    const normal = cameraRef.current.getWorldDirection(new THREE.Vector3()).negate();
                    dragPlaneRef.current.setFromNormalAndCoplanarPoint(normal, objectWorldPos);
                    if (object.material && object.userData.originalColor) {
                      (object.material as THREE.MeshStandardMaterial).color.setHex(0xffff00);
                    }
                  } else if (selectedTool === 'Scalpel' && p.isPencilGrip) {
                    // Scalpel action triggers continuously while pencil grip holds over object
                    // We debounce it so it doesn't repeatedly trigger instantly on same object
                    object.userData.isSelected = true;
                    performCut(object, hit.point);
                    if (stateRef.current.onSelectObject) stateRef.current.onSelectObject("Scalpel cut made on " + name, captureScreenshot());
                  } else if (selectedTool === 'Scissors' && p.isSnipping) {
                    object.userData.isSelected = true;
                    object.scale.multiplyScalar(0.7); // Simulate cutting tissue away
                    if (stateRef.current.onSelectObject) stateRef.current.onSelectObject("Scissors snip made on " + name, captureScreenshot());
                  } else if (selectedTool === 'Retractor' && p.isClawGrip) {
                    object.userData.isSelected = true;
                    performRetract(object);
                  } else if (selectedTool === 'Cautery' && p.isTriggerGrip) {
                    object.userData.isSelected = true;
                    // Trigger burn particle effect
                    if (particlesRef.current) {
                      particlesRef.current.position.copy(hit.point);
                      (particlesRef.current.material as THREE.PointsMaterial).color.setHex(0xffaaaa); // bright hot
                      (particlesRef.current.material as THREE.PointsMaterial).opacity = 1;
                      setTimeout(() => {
                        if (particlesRef.current) (particlesRef.current.material as THREE.PointsMaterial).opacity = 0;
                      }, 200);
                    }
                    if (object.material && object.userData.originalColor) {
                      (object.material as THREE.MeshStandardMaterial).color.setHex(0x330000); // burned tissue
                    }
                    if (stateRef.current.onSelectObject) stateRef.current.onSelectObject("Cauterized " + name, captureScreenshot());
                  }
                }

                // Debounce selection
                if (object.userData.isSelected) {
                  setTimeout(() => { object.userData.isSelected = false; }, 800);
                }
              }
            }
          }
        }
      }

      // 3. Heartbeat Animation (Only in Normal Mode, Heart, No Gestures)
      if (mode === 'normal' && selectedOrgan === 'heart' && gestureGroupRef.current && !isDragging && !gestureEnabled) {
        const time = Date.now() * 0.0015; // Slower, rhythmic speed
        // Beat logic: Base + Pulse. sin^8 makes it sharp "Lub-Dub".
        const beat = 1 + Math.pow(Math.sin(time * 3), 8) * 0.04;
        gestureGroupRef.current.scale.set(beat, beat, beat);
      }
      // 4. Reset Scale (if not beating or controlling)
      else if (gestureGroupRef.current && !gestureEnabled) {
        gestureGroupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }

      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUpGlobal);
      if (containerRef.current) containerRef.current.removeEventListener('mousedown', onMouseDownGlobal);

      cancelAnimationFrame(animationFrameId.current!);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        // Force context loss cleanup
        const gl = rendererRef.current.domElement.getContext('webgl');
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array = RUN ONCE


  // --- 2. CONTENT MANAGER (Run on selectedOrgan change) ---
  useEffect(() => {
    if (!sceneRef.current || !gestureGroupRef.current || !cameraRef.current) return;

    const gestureGroup = gestureGroupRef.current;

    // Clear existing content
    while (gestureGroup.children.length > 0) {
      gestureGroup.remove(gestureGroup.children[0]);
    }

    // Clear known positions
    originalPositionsRef.current.clear();

    setIsLoading(true);

    // Camera Reset
    if (selectedOrgan === 'heart') cameraRef.current.position.set(0, 5, 90);
    else if (selectedOrgan === 'full_body') cameraRef.current.position.set(0, 20, 120);
    else cameraRef.current.position.set(0, 10, 60);

    // Load New Content
    if (selectedOrgan === 'full_body') {
      const proceduralBody = createProceduralBody(originalPositionsRef.current); // Pass ref to store positions
      gestureGroup.add(proceduralBody);
      setIsLoading(false);
    } else {
      // Load GLB
      const config = MODELS[selectedOrgan] || MODELS['heart']; // Fallback safely
      const loader = new GLTFLoader();

      loader.load(config.path, (gltf) => {
        const model = gltf.scene;
        model.scale.copy(config.scale);
        model.position.copy(config.position);
        model.rotation.copy(config.rotation);

        // Center it
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Traverse and store original positions for explode
        model.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            originalPositionsRef.current.set(child.uuid, child.position.clone());
            // Ensure we can see inside
            if (child.material) {
              // Handle array of materials
              if (Array.isArray(child.material)) {
                child.material.forEach((mat: THREE.Material) => {
                  mat.side = THREE.DoubleSide;
                  mat.needsUpdate = true;
                });
              } else {
                child.material.side = THREE.DoubleSide;
                child.material.needsUpdate = true;
              }
            }
          }
        });

        gestureGroup.add(model);
        setIsLoading(false);
      }, undefined, (err) => {
        console.error("Failed to load model:", err);
        setIsLoading(false);
      });
    }

  }, [selectedOrgan]);

  // --- 3. MODE MANAGER (Exploded View Logic) ---
  useEffect(() => {
    if (!gestureGroupRef.current) return;

    // Exploded View / Pathology Mode
    if (mode === 'pathology') {
      gestureGroupRef.current.children.forEach((root: THREE.Object3D) => {
        root.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh && originalPositionsRef.current.has(child.uuid)) {
            const original = originalPositionsRef.current.get(child.uuid)!;
            // Explode outward from center
            const dir = original.clone().normalize();
            const target = original.clone().add(dir.multiplyScalar(2)); // Expand by 2 units

            // Animate to target? For now, snap (or use GSAP if installed, but keeping vanilla for stability)
            // Simple lerp animation in loop would be better, but simple set is stable
            child.position.lerp(target, 0.5);
          }
        });
      });
    } else {
      // Reset positions
      gestureGroupRef.current.children.forEach((root: THREE.Object3D) => {
        root.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh && originalPositionsRef.current.has(child.uuid)) {
            child.position.copy(originalPositionsRef.current.get(child.uuid)!);
          }
        });
      });
    }

  }, [mode]);

  // --- Helper: Procedural Body Generator ---
  const createProceduralBody = (positionsMap: Map<string, THREE.Vector3>) => {
    const root = new THREE.Group();

    // Simple helpers for materials
    const boneMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.5 });
    const muscleMat = new THREE.MeshPhysicalMaterial({ color: 0xcc3333, roughness: 0.6 });
    const skinMat = new THREE.MeshPhysicalMaterial({ color: 0xeebb99, roughness: 0.4 });

    const createPart = (w: number, h: number, d: number, y: number, name: string) => {
      const grp = new THREE.Group();
      grp.position.y = y;

      // Store Group position ? No, store MESH positions for individual explosion
      // Actually, easier to explode the Groups for the body parts
      const geo = new THREE.BoxGeometry(w, h, d);
      const skin = new THREE.Mesh(geo, skinMat);
      skin.name = `${name}_skin`;

      const muscle = new THREE.Mesh(geo, muscleMat);
      muscle.scale.multiplyScalar(0.9);
      muscle.name = `${name}_muscle`;

      const bone = new THREE.Mesh(geo, boneMat);
      bone.scale.multiplyScalar(0.7);
      bone.name = `${name}_bone`;

      // Store positions if we want to explode LAYERS (peel onion)
      // or explode BODY PARTS (arms separate from torso)
      // Implementation: Store basic layers
      [skin, muscle, bone].forEach(m => {
        positionsMap.set(m.uuid, m.position.clone()); // Local 0,0,0
      });

      grp.add(bone);
      grp.add(muscle);
      grp.add(skin);
      return grp;
    };

    const torso = createPart(25, 40, 15, 0, 'torso');
    root.add(torso);
    positionsMap.set(torso.uuid, torso.position.clone());

    const head = createPart(14, 18, 14, 30, 'head');
    root.add(head);
    positionsMap.set(head.uuid, head.position.clone());

    return root;
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden cursor-crosshair"
      style={{ background: orTheater ? '#000000' : undefined }}>
      {/* Hand skeleton overlay — drawn over the 3D model */}
      <canvas
        ref={overlayCanvasRef}
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ opacity: handLandmarks && handLandmarks.length > 0 ? 1 : 0, transition: 'opacity 0.3s' }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading 3D Model...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />

      {/* HUD Layers */}
      <motion.div
        className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-sm">
          Mode: <span className="text-[#00A896]">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-border pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="font-semibold text-foreground mb-1">
          {selectedOrgan === 'full_body' ? '👤 Full Anatomy' : (selectedOrgan === 'brain' ? '🧠 Brain' : '🫀 Heart')}
        </p>

        {mode === 'dissection' ? (
          <p className="text-red-400 font-medium">🔪 Interactive Dissection Active</p>
        ) : (
          <p>View & Rotate Mode</p>
        )}

        {voiceEnabled && (
          <div className="mt-1 flex items-center gap-1 text-[#00A896]">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            Listening...
          </div>
        )}
      </motion.div>
    </div>
  );
}
