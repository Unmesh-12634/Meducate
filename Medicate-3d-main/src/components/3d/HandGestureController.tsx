import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { motion, AnimatePresence } from 'motion/react';

export interface GestureControls {
  rotationX: number;
  rotationY: number;
  zoom: number;
  mode: 'normal' | 'dissection' | 'pathology';
  activeTool: 'Scalpel' | 'Forceps' | 'Scissors' | 'Retractor' | 'Cautery' | 'None';
  pointer?: {
    x: number;
    y: number;
    isPinching: boolean;       // Forceps
    isPointing: boolean;       // General UI / Trace
    isPencilGrip: boolean;     // Scalpel
    isSnipping: boolean;       // Scissors
    isClawGrip: boolean;       // Retractor
    isTriggerGrip: boolean;    // Cautery
  } | null;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandGestureControllerProps {
  enabled: boolean;
  onGestureChange: (controls: GestureControls) => void;
  /** Emits smoothed 2D landmark positions (normalized 0-1) for the hand overlay canvas */
  onHandLandmarks?: (landmarks: NormalizedLandmark[][] | null) => void;
}



// ── Smoothing constant: 0=no smoothing, 1=never moves ─────────────────────
const LERP_ALPHA = 0.35;
const DEAD_ZONE = 0.003; // ignore deltas smaller than this

function lerpLandmarks(
  prev: NormalizedLandmark[],
  next: NormalizedLandmark[],
): NormalizedLandmark[] {
  return next.map((lm, i) => ({
    x: prev[i].x + (lm.x - prev[i].x) * LERP_ALPHA,
    y: prev[i].y + (lm.y - prev[i].y) * LERP_ALPHA,
    z: prev[i].z + (lm.z - prev[i].z) * LERP_ALPHA,
  }));
}

// ── Main Component ─────────────────────────────────────────────────────────
export function HandGestureController({
  enabled,
  onGestureChange,
  onHandLandmarks,
}: HandGestureControllerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [gestureMode, setGestureMode] = useState<'normal' | 'dissection' | 'pathology'>('normal');
  const [currentGesture, setCurrentGesture] = useState<string>('Show your hand');
  const [error, setError] = useState<string | null>(null);

  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const zoomRef = useRef<number>(1);
  const pointerRef = useRef<{
    x: number;
    y: number;
    isPinching: boolean;
    isPointing: boolean;
    isPencilGrip: boolean;
    isSnipping: boolean;
    isClawGrip: boolean;
    isTriggerGrip: boolean;
  } | null>(null);
  const lastHandPosRef = useRef<{ x: number; y: number } | null>(null);
  const initializingRef = useRef(false);
  const gestureModeRef = useRef<'normal' | 'dissection' | 'pathology'>('normal');
  const activeToolRef = useRef<'Scalpel' | 'Forceps' | 'Scissors' | 'Retractor' | 'Cautery' | 'None'>('None');

  // Per-hand smoothed landmark buffers
  const smoothedLandmarksRef = useRef<NormalizedLandmark[][] | null>(null);

  // Keep gestureMode ref in sync for use inside onResults closure
  useEffect(() => {
    gestureModeRef.current = gestureMode;
  }, [gestureMode]);

  useEffect(() => {
    if (!enabled) {
      if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
      if (handsRef.current) { handsRef.current.close(); handsRef.current = null; }
      setIsInitialized(false);
      setCurrentGesture('Show your hand');
      lastHandPosRef.current = null;
      initializingRef.current = false;
      smoothedLandmarksRef.current = null;
      setError(null);
      onHandLandmarks?.(null);
      // Reset transform states so if enabled again, it starts fresh
      rotationRef.current = { x: 0, y: 0 };
      zoomRef.current = 1;
      gestureModeRef.current = 'normal';
      setGestureMode('normal');
      return;
    }

    if (initializingRef.current || handsRef.current) return;

    let mounted = true;
    initializingRef.current = true;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65,
    });

    hands.onResults(onResults);
    handsRef.current = hands;

    if (videoRef.current && mounted) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsRef.current && mounted) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      camera.start()
        .then(() => { if (mounted) { setIsInitialized(true); initializingRef.current = false; setError(null); } })
        .catch(() => { if (mounted) { setIsInitialized(false); initializingRef.current = false; setError('Camera access denied or not available'); } });

      cameraRef.current = camera;
    }

    return () => {
      mounted = false;
      initializingRef.current = false;
      try { cameraRef.current?.stop(); } catch (_) { /* ignore */ }
      cameraRef.current = null;
      try { handsRef.current?.close(); } catch (_) { /* ignore */ }
      handsRef.current = null;
      setIsInitialized(false);
    };
  }, [enabled]);

  function onResults(results: Results) {
    if (!canvasRef.current || !enabled) return;

    const canvasCtx = canvasRef.current.getContext('2d', {
      willReadFrequently: false,
      desynchronized: true,
    });
    if (!canvasCtx) return;

    try {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.image) {
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // ── Smooth all detected hands ────────────────────────────────────
        const rawHands = results.multiHandLandmarks as NormalizedLandmark[][];

        // Initialise smoothed buffer on first detection or hand count change
        if (
          !smoothedLandmarksRef.current ||
          smoothedLandmarksRef.current.length !== rawHands.length
        ) {
          smoothedLandmarksRef.current = rawHands.map(lms => lms.map(l => ({ ...l })));
        } else {
          smoothedLandmarksRef.current = rawHands.map((lms, hi) =>
            lerpLandmarks(smoothedLandmarksRef.current![hi], lms)
          );
        }

        const smoothedHands = smoothedLandmarksRef.current;

        // Draw smoothed skeletons on corner canvas
        smoothedHands.forEach(landmarks => {
          // Draw connectors manually using smoothed data
          canvasCtx.strokeStyle = '#00A896';
          canvasCtx.lineWidth = 3;
          canvasCtx.lineCap = 'round';
          HAND_CONNECTIONS.forEach(([a, b]) => {
            const la = landmarks[a];
            const lb = landmarks[b];
            canvasCtx.beginPath();
            canvasCtx.moveTo(la.x * canvasRef.current!.width, la.y * canvasRef.current!.height);
            canvasCtx.lineTo(lb.x * canvasRef.current!.width, lb.y * canvasRef.current!.height);
            canvasCtx.stroke();
          });
          // Landmark dots
          landmarks.forEach(lm => {
            canvasCtx.beginPath();
            canvasCtx.arc(
              lm.x * canvasRef.current!.width,
              lm.y * canvasRef.current!.height,
              4, 0, Math.PI * 2,
            );
            canvasCtx.fillStyle = '#00FFE0';
            canvasCtx.fill();
          });
        });

        // Emit smoothed landmarks to parent for the main-viewport overlay
        onHandLandmarks?.(smoothedHands);

        // ── Assign hands ───────────────────────────────────────────────
        let camHand: NormalizedLandmark[] | null = null;
        let toolHand: NormalizedLandmark[] | null = null;

        if (smoothedHands.length === 1) {
          camHand = smoothedHands[0];
        } else if (smoothedHands.length === 2) {
          for (let idx = 0; idx < results.multiHandedness.length; idx++) {
            const h = results.multiHandedness[idx] as any;
            if (h.label === 'Right') camHand = smoothedHands[idx] as NormalizedLandmark[];
            else toolHand = smoothedHands[idx] as NormalizedLandmark[];
          }
        }

        // ── Tool (Right) hand (Action / Pointer) ────────────────────────
        if (toolHand) {
          const gesture = detectGesture(toolHand);
          const indexTip = toolHand[8];
          const x = -((indexTip.x * 2) - 1);
          const y = -((indexTip.y * 2) - 1);

          // Authentic Grip Detection
          const wrist = toolHand[0];
          const dist = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y);

          const thumbTip = toolHand[4];
          const middleTip = toolHand[12];
          const ringTip = toolHand[16];
          const pinkyTip = toolHand[20];

          const isPinching = dist(thumbTip, indexTip) < 0.06;
          const isPencilGrip = dist(thumbTip, indexTip) < 0.08 && dist(thumbTip, middleTip) < 0.08 && dist(ringTip, wrist) < dist(toolHand[13], wrist) && dist(pinkyTip, wrist) < dist(toolHand[17], wrist);
          const isSnipping = dist(thumbTip, wrist) < dist(toolHand[2], wrist) && dist(indexTip, wrist) > dist(toolHand[5], wrist) + 0.05 && dist(middleTip, wrist) > dist(toolHand[9], wrist) + 0.05 && dist(indexTip, middleTip) > 0.05; // Index and middle extended but apart
          const isClawGrip = dist(indexTip, wrist) > dist(toolHand[5], wrist) && dist(indexTip, wrist) < dist(toolHand[5], wrist) + 0.1; // Fingers half curled
          const isTriggerGrip = dist(indexTip, wrist) > dist(toolHand[5], wrist) + 0.05 && dist(middleTip, wrist) < dist(toolHand[9], wrist); // Only index extended

          pointerRef.current = {
            x, y,
            isPinching,
            isPointing: gesture.name.includes('Pointing'),
            isPencilGrip,
            isSnipping,
            isClawGrip,
            isTriggerGrip
          };
        } else {
          pointerRef.current = null;
        }

        // ── Camera (Left) hand (mode / tool selection / rotate / zoom) ────────────────
        if (camHand) {
          const gesture = detectGesture(camHand);
          setCurrentGesture(
            smoothedHands.length === 2
              ? `Dual: ${gesture.name.split(' - ')[0]}`
              : gesture.name,
          );

          if (gesture.mode !== gestureModeRef.current) {
            setGestureMode(gesture.mode);
            gestureModeRef.current = gesture.mode;
          }

          // Tool Selection in Dissection Mode using Left Hand Fingers
          if (gesture.mode === 'dissection') {
            const wrist = camHand[0];
            const dist = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y);
            const extendedCount = [8, 12, 16, 20].filter(i =>
              dist(camHand[i], wrist) > dist(camHand[i - 3], wrist) + 0.05
            ).length;

            if (extendedCount === 1) activeToolRef.current = 'Scalpel';
            else if (extendedCount === 2) activeToolRef.current = 'Forceps';
            else if (extendedCount === 3) activeToolRef.current = 'Scissors';
            else if (extendedCount === 4 && dist(camHand[4], wrist) > dist(camHand[2], wrist) + 0.05) activeToolRef.current = 'Retractor';
            else if (extendedCount === 0) activeToolRef.current = 'Cautery'; // Fist = Cautery in dissection mode context? Actually let's just keep fist for "Normal mode" according to previous logic.
            // Adjust: 4 fingers (no thumb) = Cautery, 5 fingers (with thumb) = Retractor
            if (extendedCount === 4 && dist(camHand[4], wrist) <= dist(camHand[2], wrist) + 0.05) activeToolRef.current = 'Cautery';
          } else {
            activeToolRef.current = 'None';
          }

          const palmCenter = camHand[9];

          if (lastHandPosRef.current) {
            const deltaX = palmCenter.x - lastHandPosRef.current.x;
            const deltaY = palmCenter.y - lastHandPosRef.current.y;

            if (
              (gesture.name.includes('Rotate') || gesture.name.includes('Pointing')) &&
              (Math.abs(deltaX) > DEAD_ZONE || Math.abs(deltaY) > DEAD_ZONE)
            ) {
              // Apply rotation with velocity damping
              rotationRef.current.y -= deltaX * 3.5;
              rotationRef.current.x -= deltaY * 3.5;
            }
          }
          lastHandPosRef.current = { x: palmCenter.x, y: palmCenter.y };

          // Zoom via pinch
          if (gesture.name.includes('Pinch')) {
            const thumbTip = camHand[4];
            const indexTip = camHand[8];
            const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
            const targetZoom = Math.max(0.3, Math.min(2.5, 1 / (distance * 15)));
            // Smooth zoom with lerp
            zoomRef.current = zoomRef.current * 0.85 + targetZoom * 0.15;
          } else {
            // Gently return to 1× when not pinching
            zoomRef.current = zoomRef.current * 0.97 + 1.0 * 0.03;
          }
        }

        onGestureChange({
          rotationX: rotationRef.current.x,
          rotationY: rotationRef.current.y,
          zoom: zoomRef.current,
          mode: gestureModeRef.current,
          activeTool: activeToolRef.current,
          pointer: pointerRef.current,
        });
      } else {
        setCurrentGesture('Show your hand');
        lastHandPosRef.current = null;
        pointerRef.current = null;
        smoothedLandmarksRef.current = null;
        onHandLandmarks?.(null);
      }

      canvasCtx.restore();
    } catch (err) {
      console.error('Error processing hand gesture:', err);
    }
  }

  function detectGesture(landmarks: NormalizedLandmark[]): {
    name: string;
    mode: 'normal' | 'dissection' | 'pathology';
  } {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const thumbKnuckle = landmarks[2];
    const indexKnuckle = landmarks[5];
    const middleKnuckle = landmarks[9];
    const ringKnuckle = landmarks[13];
    const pinkyKnuckle = landmarks[17];

    const dist = (a: NormalizedLandmark, b: NormalizedLandmark) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    const thumbExtended = dist(thumbTip, wrist) > dist(thumbKnuckle, wrist) + 0.05;
    const indexExtended = dist(indexTip, wrist) > dist(indexKnuckle, wrist) + 0.05;
    const middleExtended = dist(middleTip, wrist) > dist(middleKnuckle, wrist) + 0.05;
    const ringExtended = dist(ringTip, wrist) > dist(ringKnuckle, wrist) + 0.05;
    const pinkyExtended = dist(pinkyTip, wrist) > dist(pinkyKnuckle, wrist) + 0.05;

    const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
    const pinchDistance = dist(thumbTip, indexTip);

    if (pinchDistance < 0.06 && !middleExtended && !ringExtended && !pinkyExtended) {
      return { name: '🤏 Pinch - Zoom Active', mode: gestureModeRef.current };
    }
    if (extendedCount === 4 && thumbExtended) {
      return { name: '✋ Open Hand - Dissection Mode', mode: 'dissection' };
    }
    if (extendedCount === 0 && !thumbExtended) {
      return { name: '✊ Fist - Normal Mode', mode: 'normal' };
    }
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
      return { name: '✌️ Peace Sign - Pathology Mode', mode: 'pathology' };
    }
    if (extendedCount >= 3) {
      return { name: '🖐️ Open Palm - Rotate Model', mode: gestureModeRef.current };
    }
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return { name: '👆 Pointing - Rotate Model', mode: gestureModeRef.current };
    }
    return { name: 'Show a clear gesture', mode: gestureModeRef.current };
  }

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {enabled && (
        <>
          {/* Webcam preview – bottom right corner */}
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-background/95 backdrop-blur-sm border-2 border-[#00A896] rounded-xl overflow-hidden shadow-2xl">
              <div className="relative w-64 h-48">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  style={{ display: 'none' }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={640}
                  height={480}
                />

                {!isInitialized && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <div className="text-white text-sm">Starting camera...</div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center px-4">
                      <div className="text-red-500 text-2xl mb-2">⚠️</div>
                      <div className="text-white text-sm">{error}</div>
                      <div className="text-white/60 text-xs mt-1">Check camera permissions</div>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <div className="text-[#00A896] font-bold text-xs">{currentGesture}</div>
                  <div className="text-white/70 text-xs mt-0.5">Mode: {gestureMode}</div>
                </div>
              </div>
            </div>
          </motion.div>


        </>
      )}
    </AnimatePresence>
  );
}
