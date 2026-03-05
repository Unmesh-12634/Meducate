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
  pointer?: { x: number; y: number; isPinching: boolean; isPointing: boolean } | null;
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

// ── Gesture tutorial data ──────────────────────────────────────────────────
const TUTORIAL_GESTURES = [
  {
    name: 'Open Palm → Rotate',
    emoji: '🖐️',
    description: 'Spread all fingers and move your hand to rotate the model',
    color: '#00A896',
    // finger extended states [thumb, index, middle, ring, pinky]
    fingers: [true, true, true, true, true],
  },
  {
    name: 'Pinch → Zoom',
    emoji: '🤏',
    description: 'Touch thumb and index finger together to zoom in/out',
    color: '#FFD166',
    fingers: [false, false, false, false, false], // pinch special
  },
  {
    name: 'Peace Sign → Pathology',
    emoji: '✌️',
    description: 'Raise index and middle fingers for Pathology mode',
    color: '#EF476F',
    fingers: [false, true, true, false, false],
  },
  {
    name: 'Fist → Normal Mode',
    emoji: '✊',
    description: 'Close your fist to return to Normal viewing mode',
    color: '#06D6A0',
    fingers: [false, false, false, false, false],
  },
];

// Draws an animated illustrative hand based on finger states
function TutorialHandSVG({
  fingers,
  color,
  isPinch,
  tick,
}: {
  fingers: boolean[];
  color: string;
  isPinch?: boolean;
  tick: number;
}) {
  const pulse = 1 + Math.sin(tick * 0.08) * 0.03;
  const pinchOffset = isPinch ? 22 : 0;

  // Landmark positions for a stylised flat hand (palm up, fingers pointing up)
  const palmCx = 60;
  const palmCy = 110;

  // [base_x, tip_y_extended, tip_y_curled]
  const fingerDefs = [
    { bx: 28, baseY: 85, extY: 45, curlY: 82 },  // thumb (offset style)
    { bx: 35, baseY: 80, extY: 20, curlY: 72 },  // index
    { bx: 52, baseY: 78, extY: 15, curlY: 70 },  // middle
    { bx: 68, baseY: 80, extY: 20, curlY: 72 },  // ring
    { bx: 84, baseY: 85, extY: 30, curlY: 78 },  // pinky
  ];

  return (
    <svg width="120" height="160" viewBox="0 0 120 160" style={{ transform: `scale(${pulse})`, transformOrigin: 'center', filter: `drop-shadow(0 0 8px ${color}88)` }}>
      {/* Palm */}
      <ellipse cx={palmCx} cy={palmCy} rx={38} ry={32} fill={`${color}22`} stroke={color} strokeWidth="2" />

      {/* Fingers */}
      {fingerDefs.map((f, i) => {
        const isThumb = i === 0;
        const ext = isPinch ? (i < 2) : fingers[i];
        const tipY = ext ? f.extY : f.curlY;

        // Pinch: draw index curled toward thumb
        const adjustedX = isThumb && isPinch ? f.bx + pinchOffset : f.bx;

        const midY = (f.baseY + tipY) / 2;

        return (
          <g key={i}>
            {/* Finger line */}
            <path
              d={`M ${adjustedX} ${f.baseY} Q ${adjustedX + (isThumb ? 4 : 0)} ${midY} ${adjustedX} ${tipY}`}
              stroke={color}
              strokeWidth={ext ? 5 : 4}
              strokeLinecap="round"
              fill="none"
              opacity={ext ? 1 : 0.5}
            />
            {/* Tip dot */}
            <circle cx={adjustedX} cy={tipY} r={isPinch && i < 2 ? 6 : 4} fill={color} opacity={ext ? 1 : 0.4} />
          </g>
        );
      })}

      {/* Wrist */}
      <rect x={palmCx - 18} y={palmCy + 22} width={36} height={18} rx={8} fill={`${color}33`} stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ── Tutorial Modal ──────────────────────────────────────────────────────────
function GestureTutorialModal({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance every 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < TUTORIAL_GESTURES.length - 1) {
        setStep(s => s + 1);
      } else {
        onDismiss();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [step, onDismiss]);

  const current = TUTORIAL_GESTURES[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="relative max-w-md w-full mx-4 rounded-3xl overflow-hidden"
        style={{ border: `2px solid ${current.color}44`, background: 'rgba(10,15,20,0.98)' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 text-center">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: current.color }}>
            Gesture {step + 1} of {TUTORIAL_GESTURES.length}
          </p>
          <h2 className="text-2xl font-bold text-white">{current.emoji} {current.name}</h2>
        </div>

        {/* Animated Hand */}
        <div className="flex items-center justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TutorialHandSVG
                fingers={current.fingers}
                color={current.color}
                isPinch={step === 1}
                tick={tick}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Description */}
        <div className="px-6 pb-4 text-center">
          <p className="text-sm text-white/70">{current.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pb-5">
          {TUTORIAL_GESTURES.map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i === step ? 1.4 : 1, opacity: i === step ? 1 : 0.3 }}
              className="w-2 h-2 rounded-full"
              style={{ background: current.color }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1"
          style={{ background: current.color }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'linear' }}
          key={step}
        />

        {/* Skip button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 text-xs transition-colors"
        >
          Skip ✕
        </button>
      </motion.div>
    </motion.div>
  );
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
  const [showTutorial, setShowTutorial] = useState(false);
  const wasEnabledRef = useRef(false);

  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const zoomRef = useRef<number>(1);
  const pointerRef = useRef<{ x: number; y: number; isPinching: boolean; isPointing: boolean } | null>(null);
  const lastHandPosRef = useRef<{ x: number; y: number } | null>(null);
  const initializingRef = useRef(false);
  const gestureModeRef = useRef<'normal' | 'dissection' | 'pathology'>('normal');

  // Per-hand smoothed landmark buffers
  const smoothedLandmarksRef = useRef<NormalizedLandmark[][] | null>(null);

  // Show tutorial when gesture mode is first enabled
  useEffect(() => {
    if (enabled && !wasEnabledRef.current) {
      setShowTutorial(true);
    }
    wasEnabledRef.current = enabled;
  }, [enabled]);

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

        // ── Tool hand (pointer) ────────────────────────────────────────
        if (toolHand) {
          const gesture = detectGesture(toolHand);
          const indexTip = toolHand[8];
          const x = -((indexTip.x * 2) - 1);
          const y = -((indexTip.y * 2) - 1);
          pointerRef.current = {
            x, y,
            isPinching: gesture.name.includes('Pinch'),
            isPointing: gesture.name.includes('Pointing'),
          };
        } else {
          pointerRef.current = null;
        }

        // ── Camera hand (rotate / zoom) ────────────────────────────────
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
          {/* Tutorial overlay */}
          <AnimatePresence>
            {showTutorial && (
              <GestureTutorialModal onDismiss={() => setShowTutorial(false)} />
            )}
          </AnimatePresence>

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

          {/* Gesture reference guide – top left */}
          <motion.div
            className="fixed top-20 left-4 z-40 w-64"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00A896] rounded-full animate-pulse" />
                  <h3 className="text-xs font-bold text-[#00A896]">Gestures Active</h3>
                </div>
                <button
                  onClick={() => setShowTutorial(true)}
                  className="text-[10px] bg-[#00A896]/10 hover:bg-[#00A896]/20 text-[#00A896] px-2 py-0.5 rounded transition-colors"
                >
                  Tutorial
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { emoji: '🖐️', label: 'Open Palm', sub: 'Rotate model' },
                  { emoji: '🤏', label: 'Pinch', sub: 'Zoom in/out' },
                  { emoji: '✋', label: 'All fingers', sub: 'Dissection mode' },
                  { emoji: '✌️', label: 'Peace sign', sub: 'Pathology mode' },
                  { emoji: '✊', label: 'Fist', sub: 'Normal mode' },
                ].map(g => (
                  <div key={g.label} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-lg w-7 text-center">{g.emoji}</span>
                    <div>
                      <div className="font-semibold text-foreground">{g.label}</div>
                      <div className="text-muted-foreground text-[10px]">{g.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
