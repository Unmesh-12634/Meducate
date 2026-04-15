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
  /** Callback to expose undo function to parent */
  onUndoRef?: React.MutableRefObject<(() => void) | null>;
  /** Callback to expose restoreAll function to parent */
  onRestoreAllRef?: React.MutableRefObject<(() => void) | null>;
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
    path: '/newbrain.glb',
    scale: new THREE.Vector3(25, 25, 25),
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, -Math.PI / 2, 0)
  },
  full_body: {
    path: '/models/lungs.glb',
    scale: new THREE.Vector3(50, 50, 50),
    position: new THREE.Vector3(10, 10, 10),
    rotation: new THREE.Euler(0, 0, 0)
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
  onUndoRef,
  onRestoreAllRef,
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

  // Dissection history for Undo / Restore All
  type DissectionAction = {
    object: THREE.Mesh;
    prevVisible: boolean;
    prevScale: THREE.Vector3;
    prevPosition: THREE.Vector3;
    prevColor: number | null;
  };
  const dissectionHistoryRef = useRef<DissectionAction[]>([]);



  // ── OR Theater Environment ──────────────────────────────────────────────────
  useOREnvironment(sceneRef, orTheater);

  // State Refs (to avoid stale closures in event handlers)
  const stateRef = useRef({ mode, selectedTool, gestureEnabled, gestureControls, selectedOrgan, onSelectObject });

  useEffect(() => {
    stateRef.current = { mode, selectedTool, gestureEnabled, gestureControls, selectedOrgan, onSelectObject };
  }, [mode, selectedTool, gestureEnabled, gestureControls, selectedOrgan, onSelectObject]);

  // ── Expose Undo / Restore All to parent ────────────────────────────────────
  useEffect(() => {
    if (onUndoRef) {
      onUndoRef.current = () => {
        const history = dissectionHistoryRef.current;
        if (history.length === 0) return;
        const last = history.pop()!;
        const obj = last.object;
        obj.visible = last.prevVisible;
        obj.scale.copy(last.prevScale);
        obj.position.copy(last.prevPosition);
        if (last.prevColor !== null && obj.material) {
          (obj.material as THREE.MeshStandardMaterial).color.setHex(last.prevColor);
        }
      };
    }
    if (onRestoreAllRef) {
      onRestoreAllRef.current = () => {
        const history = dissectionHistoryRef.current;
        // Restore all in reverse order
        while (history.length > 0) {
          const action = history.pop()!;
          const obj = action.object;
          obj.visible = action.prevVisible;
          obj.scale.copy(action.prevScale);
          obj.position.copy(action.prevPosition);
          if (action.prevColor !== null && obj.material) {
            (obj.material as THREE.MeshStandardMaterial).color.setHex(action.prevColor);
          }
        }
        // Also restore originalPositions for anything that was moved
        if (gestureGroupRef.current) {
          gestureGroupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && originalPositionsRef.current.has(child.uuid)) {
              child.position.copy(originalPositionsRef.current.get(child.uuid)!);
            }
          });
        }
      };
    }
  }, [onUndoRef, onRestoreAllRef]);

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
      ctx.save();

      // Shadow for depth
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 10;

      const skinColor = '#F2C299'; // Base skin tone
      const shadowSkinColor = '#D2A177'; // Darker for depth

      // 1. Draw Palm as a filled polygon
      ctx.beginPath();
      const palmIndices = [0, 1, 5, 9, 13, 17];
      palmIndices.forEach((idx, i) => {
        const x = (1 - landmarks[idx].x) * W;
        const y = landmarks[idx].y * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Palm gradient for 3D effect
      ctx.fillStyle = skinColor;
      ctx.fill();

      // Outline palm slightly for depth
      ctx.strokeStyle = shadowSkinColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      // 2. Draw thick lines for fingers
      ctx.strokeStyle = skinColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Drawing connections with variable thickness
      HAND_CONNECTIONS.forEach(([a, b]) => {
        // Skip palm connection lines as we already filled the palm
        const isPalmConnection = palmIndices.includes(a) && palmIndices.includes(b);
        if (isPalmConnection) return;

        const la = landmarks[a];
        const lb = landmarks[b];

        ctx.beginPath();
        ctx.moveTo((1 - la.x) * W, la.y * H);
        ctx.lineTo((1 - lb.x) * W, lb.y * H);

        // Thicker near palm, thinner at tips
        let thickness = 28;
        if (a > 16 || b > 16) thickness = 18; // pinky
        if (a > 12 && a <= 16) thickness = 20; // ring
        if (a > 8 && a <= 12) thickness = 22; // middle
        if (a > 4 && a <= 8) thickness = 22; // index
        if (a <= 4) thickness = 26; // thumb
        if (b % 4 === 0) thickness -= 4; // Tips are slightly narrower

        ctx.lineWidth = thickness;
        ctx.stroke();

        // Add a slight dark inner stroke to simulate joint wrinkles/depth
        ctx.lineWidth = thickness * 0.8;
        ctx.strokeStyle = '#FADBB8'; // highlight
        ctx.stroke();
        ctx.lineWidth = thickness * 0.6;
        ctx.strokeStyle = skinColor;
        ctx.stroke();
      });

      // 3. Draw rounded joints (knuckles & tips)
      ctx.shadowColor = 'transparent'; // Remove shadow for flat joints over fingers
      ctx.fillStyle = shadowSkinColor;
      landmarks.forEach((lm, i) => {
        // Draw fingernails on tips
        if (i === 4 || i === 8 || i === 12 || i === 16 || i === 20) {
          ctx.fillStyle = '#FFEBE0'; // Nail color
          ctx.beginPath();
          const r = i === 4 ? 9 : 7; // Thumb nail is bigger
          ctx.arc((1 - lm.x) * W, lm.y * H, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (i !== 0) { // joints
          ctx.fillStyle = shadowSkinColor;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc((1 - lm.x) * W, lm.y * H, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
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

    // TOOLS GROUP (Follows pointer)
    const toolsGroup = new THREE.Group();
    scene.add(toolsGroup);
    toolsGroup.visible = false;
    const toolMeshes: Record<string, THREE.Object3D> = {};

    const createRealTool = (type: string) => {
      const toolGroup = new THREE.Group();
      const metallicMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.9, roughness: 0.15 });

      if (type === 'Scalpel') {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 2), metallicMat);
        handle.position.z = -0.5;
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.6, 4), metallicMat);
        blade.rotation.x = -Math.PI / 2;
        blade.scale.z = 0.2; // flatten it
        blade.position.z = 0.8;
        toolGroup.add(handle, blade);
      } else if (type === 'Forceps') {
        const prongGeo = new THREE.BoxGeometry(0.08, 0.05, 2.5);
        const p1 = new THREE.Mesh(prongGeo, metallicMat);
        p1.position.x = 0.1;
        p1.rotation.y = 0.05;
        const p2 = new THREE.Mesh(prongGeo, metallicMat);
        p2.position.x = -0.1;
        p2.rotation.y = -0.05;
        toolGroup.add(p1, p2);
      } else if (type === 'Scissors') {
        const h1 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 16, 50), metallicMat);
        h1.position.set(0.2, 0, -1);
        const h2 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 16, 50), metallicMat);
        h2.position.set(-0.2, 0, -1);
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 2), metallicMat);
        b1.position.set(0.05, 0, 0.2);
        b1.rotation.y = -0.05;
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 2), metallicMat);
        b2.position.set(-0.05, 0, 0.2);
        b2.rotation.y = 0.05;
        const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1), new THREE.MeshStandardMaterial({ color: 0x555555 }));
        pivot.position.set(0, 0, -0.2);
        toolGroup.add(h1, h2, b1, b2, pivot);
      } else if (type === 'Retractor') {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 2), metallicMat);
        handle.position.z = -0.5;
        const hook = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.08, 16, 50, Math.PI), metallicMat);
        hook.position.set(0, 0, 0.6);
        hook.rotation.x = Math.PI / 2;
        const bend = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.08), metallicMat);
        bend.position.set(0, -0.1, 0.85);
        toolGroup.add(handle, hook, bend);
      } else if (type === 'Cautery') {
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.5), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.1, roughness: 0.8 }));
        handle.rotation.x = Math.PI / 2;
        handle.position.z = -0.5;
        const tipGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
        tipGeo.rotateX(Math.PI / 2);
        const tip = new THREE.Mesh(tipGeo, metallicMat);
        tip.position.z = 1.0;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
        head.position.set(0, 0, 1.4);
        toolGroup.add(handle, tip, head);
      }

      // Default orientation pointing slightly down-forward
      toolGroup.rotation.x = Math.PI / 6;
      toolsGroup.add(toolGroup);
      return toolGroup;
    };

    toolMeshes['Scalpel'] = createRealTool('Scalpel');
    toolMeshes['Forceps'] = createRealTool('Forceps');
    toolMeshes['Scissors'] = createRealTool('Scissors');
    toolMeshes['Retractor'] = createRealTool('Retractor');
    toolMeshes['Cautery'] = createRealTool('Cautery');


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

      // Record state before change for undo
      dissectionHistoryRef.current.push({
        object,
        prevVisible: true,
        prevScale: object.scale.clone(),
        prevPosition: object.position.clone(),
        prevColor: (object.material as THREE.MeshStandardMaterial)?.color?.getHex() ?? null,
      });

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
      // Record state before change for undo
      dissectionHistoryRef.current.push({
        object,
        prevVisible: object.visible,
        prevScale: object.scale.clone(),
        prevPosition: object.position.clone(),
        prevColor: (object.material as THREE.MeshStandardMaterial)?.color?.getHex() ?? null,
      });

      const dir = object.position.clone().normalize();
      if (dir.lengthSq() === 0) dir.set(0, 0, -1);

      const targetPos = object.position.clone().add(dir.multiplyScalar(5));
      const startPos = object.position.clone();
      const startTime = Date.now();
      const duration = 300;

      const animateRetract = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        object.position.lerpVectors(startPos, targetPos, ease);
        if (progress < 1) requestAnimationFrame(animateRetract);
      };
      animateRetract();
    };

    // MOUSE POINTER FOR DISSECTION ACTIONS
    const mousePosRef = { current: new THREE.Vector2(0, 0) };
    const isMouseActionRef = { current: false };

    // MOUSE / TOUCH ROTATION — works in every mode, interrupts auto-rotation
    const isDraggingRef = { current: false };
    const userInterruptedRef = { current: false };
    const inertiaRef = { x: 0, y: 0 };
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let prevPos = { x: 0, y: 0 };
    let lastDelta = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      // Always update mouse pos relative to canvas, used for tool pointer
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePosRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }

      // Only accept left mouse button or single touch
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      // Prevent UI clicks from triggering 3D actions
      if ((e.target as Element).tagName.toUpperCase() !== 'CANVAS') return;

      const { mode, gestureEnabled } = stateRef.current;
      // Use tool via mouse click if in dissection mode & gestures disabled
      if (mode === 'dissection' && !gestureEnabled) {
        isMouseActionRef.current = true;
        return; // Don't trigger scene rotation while using tools
      }

      isDraggingRef.current = true;
      userInterruptedRef.current = true;
      inertiaRef.x = 0;
      inertiaRef.y = 0;
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
      prevPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isMouseActionRef.current = false;
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      // Give inertia from last delta
      inertiaRef.x = lastDelta.x * 0.008;
      inertiaRef.y = lastDelta.y * 0.008;
      // Resume auto-rotate after 2 seconds of no interaction
      resumeTimer = setTimeout(() => {
        userInterruptedRef.current = false;
        inertiaRef.x = 0;
        inertiaRef.y = 0;
      }, 2000);
    };

    const onPointerMove = (e: PointerEvent) => {
      // Always update mouse pos relative to canvas, used for tool pointer
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mousePosRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }

      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevPos.x;
      const deltaY = e.clientY - prevPos.y;
      lastDelta = { x: deltaX, y: deltaY };
      if (gestureGroupRef.current) {
        gestureGroupRef.current.rotation.y += deltaX * 0.008;
        gestureGroupRef.current.rotation.x += deltaY * 0.008;
        // Clamp vertical rotation to avoid flipping
        gestureGroupRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, gestureGroupRef.current.rotation.x));
      }
      prevPos = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    let lastGestureX = 0;
    let lastGestureY = 0;
    let wasGestureEnabled = false;

    // ANIMATION LOOP
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const { gestureEnabled, gestureControls, mode, selectedOrgan, selectedTool } = stateRef.current;

      // 1. Auto Rotate (Normal Mode only, not while user is controlling)
      const isUserControlling = isDraggingRef.current || userInterruptedRef.current;

      if (!gestureEnabled && !isUserControlling && mode === 'normal' && gestureGroupRef.current) {
        gestureGroupRef.current.rotation.y -= 0.005;
      }

      // Apply inertia coast after releasing drag
      if (!isDraggingRef.current && userInterruptedRef.current && gestureGroupRef.current) {
        if (Math.abs(inertiaRef.x) > 0.0001 || Math.abs(inertiaRef.y) > 0.0001) {
          gestureGroupRef.current.rotation.y += inertiaRef.x;
          gestureGroupRef.current.rotation.x += inertiaRef.y;
          gestureGroupRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, gestureGroupRef.current.rotation.x));
          inertiaRef.x *= 0.92;  // friction
          inertiaRef.y *= 0.92;
        }
      }

      // 2. Gesture Control (High Priority)
      if (gestureEnabled && gestureControls && gestureGroupRef.current) {
        if (!wasGestureEnabled) {
          lastGestureX = gestureControls.rotationX;
          lastGestureY = gestureControls.rotationY;
        }

        const deltaX = gestureControls.rotationX - lastGestureX;
        const deltaY = gestureControls.rotationY - lastGestureY;

        lastGestureX = gestureControls.rotationX;
        lastGestureY = gestureControls.rotationY;

        // Apply only the delta, allowing mouse rotation to co-exist
        gestureGroupRef.current.rotation.x += deltaX;
        gestureGroupRef.current.rotation.y += deltaY;

        const s = gestureControls.zoom;
        gestureGroupRef.current.scale.set(s, s, s);

        // --- HAND / MOUSE POINTER RAYCASTING ---
        // Raycast logic can be triggered by Gesture OR regular Mouse pointer in dissection mode
        const useMousePointer = (!gestureEnabled && mode === 'dissection');
        const hasPointer = (gestureEnabled && gestureControls && gestureControls.pointer) || useMousePointer;

        if (hasPointer && cameraRef.current && gestureGroupRef.current) {

          let pX = 0, pY = 0;
          let actionActive = false;
          let wasActionActive = false;

          if (gestureEnabled && gestureControls && gestureControls.pointer) {
            const p = gestureControls.pointer;
            pX = p.x;
            pY = p.y;
            if (mode === 'normal') {
              actionActive = p.isPinching;
            } else {
              // Each tool has its own specific gesture mapping
              const t = stateRef.current.selectedTool;
              if (t === 'Forceps') actionActive = p.isPinching;
              else if (t === 'Scalpel') actionActive = p.isPencilGrip;
              else if (t === 'Scissors') actionActive = p.isSnipping;
              else if (t === 'Retractor') actionActive = p.isClawGrip;
              else if (t === 'Cautery') actionActive = p.isTriggerGrip;
              else actionActive = p.isPointing || p.isPinching;
            }
            wasActionActive = isPinchingRef.current;
            isPinchingRef.current = actionActive;
          } else if (useMousePointer) {
            pX = mousePosRef.current.x;
            pY = mousePosRef.current.y;
            actionActive = isMouseActionRef.current;
            wasActionActive = isPinchingRef.current;
            isPinchingRef.current = actionActive;
          }

          raycasterRef.current.setFromCamera(new THREE.Vector2(pX, pY), cameraRef.current);

          // Dragging Logic (Forceps)
          if (mode === 'dissection' && selectedTool === 'Forceps') {
            if (actionActive && draggedObjectRef.current) {
              // We are currently holding an object, move it
              raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, dragOffsetRef.current);
              draggedObjectRef.current.position.copy(dragOffsetRef.current);

              // Highlight to show it's grabbed
              if (draggedObjectRef.current.material) {
                (draggedObjectRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xffff00);
              }
            } else if (!actionActive && draggedObjectRef.current) {
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
              if (actionActive || (gestureEnabled && gestureControls?.pointer?.isPointing)) {
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
                if (mode === 'normal' && actionActive && !wasActionActive) {
                  object.userData.isSelected = true;
                  const name = object.name.replace(/_/g, ' ');
                  if (stateRef.current.onSelectObject) stateRef.current.onSelectObject(name, captureScreenshot());
                } else if (mode === 'dissection') {
                  const name = object.name.replace(/_/g, ' ');

                  if (selectedTool === 'Forceps' && actionActive && !wasActionActive) {
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
                  } else if (selectedTool === 'Scalpel' && actionActive) {
                    // Scalpel action triggers continuously
                    object.userData.isSelected = true;
                    performCut(object, hit.point);
                  } else if (selectedTool === 'Scissors' && actionActive && !wasActionActive) {
                    object.userData.isSelected = true;
                    object.scale.multiplyScalar(0.7); // Simulate cutting tissue away
                  } else if (selectedTool === 'Retractor' && actionActive && !wasActionActive) {
                    object.userData.isSelected = true;
                    performRetract(object);
                  } else if (selectedTool === 'Cautery' && actionActive) {
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
      if (mode === 'normal' && selectedOrgan === 'heart' && gestureGroupRef.current && !isDraggingRef.current && !gestureEnabled) {
        const time = Date.now() * 0.0015; // Slower, rhythmic speed
        // Beat logic: Base + Pulse. sin^8 makes it sharp "Lub-Dub".
        const beat = 1 + Math.pow(Math.sin(time * 3), 8) * 0.04;
        gestureGroupRef.current.scale.set(beat, beat, beat);
      }
      // 4. Reset Scale (if not beating or controlling)
      else if (gestureGroupRef.current && !gestureEnabled) {
        gestureGroupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }

      // 5. Update 3D Tools visual representation
      if (mode === 'dissection' && selectedTool && selectedTool !== 'None') {
        Object.keys(toolMeshes).forEach(key => {
          toolMeshes[key].visible = (key === selectedTool);
        });

        // Update position to pointer if gesture is enabled or mouse is used
        const useMousePointer = (!gestureEnabled && mode === 'dissection');
        const hasPointer = (gestureEnabled && gestureControls && gestureControls.pointer) || useMousePointer;

        if (hasPointer && cameraRef.current) {
          toolsGroup.visible = true;

          let pX = 0, pY = 0;
          let actionActive = false;
          if (gestureEnabled && gestureControls?.pointer) {
            const p = gestureControls.pointer;
            pX = p.x; pY = p.y;
            // Match the actionActive logic
            const t = selectedTool;
            if (t === 'Forceps') actionActive = p.isPinching;
            else if (t === 'Scalpel') actionActive = p.isPencilGrip;
            else if (t === 'Scissors') actionActive = p.isSnipping;
            else if (t === 'Retractor') actionActive = p.isClawGrip;
            else if (t === 'Cautery') actionActive = p.isTriggerGrip;
            else actionActive = p.isPointing || p.isPinching;
          } else {
            pX = mousePosRef.current.x;
            pY = mousePosRef.current.y;
            actionActive = isMouseActionRef.current;
          }

          raycasterRef.current.setFromCamera(new THREE.Vector2(pX, pY), cameraRef.current);
          const toolPos = cameraRef.current.position.clone().add(raycasterRef.current.ray.direction.clone().multiplyScalar(20));
          toolsGroup.position.copy(toolPos);
          // Orient tool local +Z backwards along the ray direction (into the scene)
          toolsGroup.lookAt(toolPos.clone().add(raycasterRef.current.ray.direction));

          // Slight poke forward if active
          if (actionActive) {
            toolsGroup.position.add(raycasterRef.current.ray.direction.clone().multiplyScalar(1));
          }
        } else {
          // Hide if no pointer available
          toolsGroup.visible = false;
        }
      } else {
        toolsGroup.visible = false;
      }

      renderer.render(scene, camera);
      wasGestureEnabled = gestureEnabled;
    };
    animate();

    // CLEANUP
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
      if (resumeTimer) clearTimeout(resumeTimer);
      cancelAnimationFrame(animationFrameId.current!);
      if (rendererRef.current) {
        rendererRef.current.dispose();
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
