import React, { useState, useEffect, useRef } from 'react';
import { Camera, Repeat, RefreshCw, CheckCircle2, AlertCircle, ChevronLeft, ArrowRight, Loader2, Upload } from 'lucide-react';

interface LiveCameraProps {
  label: string;
  sublabel: string;
  guideType: 'card' | 'face';
  initialFacingMode?: 'user' | 'environment';
  photo: string | null;
  onPhotoCaptured: (dataUrl: string) => void;
  onRetake: () => void;
  onConfirm: () => void;
  onBack: () => void;
  confirmLabel?: string;
}

export default function LiveCamera({
  label,
  sublabel,
  guideType,
  initialFacingMode = 'environment',
  photo,
  onPhotoCaptured,
  onRetake,
  onConfirm,
  onBack,
  confirmLabel = 'Confirm & Next'
}: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(initialFacingMode);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);

  // Stop camera helper
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (typeof window !== 'undefined' && (window as any).__activeCameraStream) {
      try {
        (window as any).__activeCameraStream.getTracks().forEach((t: any) => t.stop());
      } catch (e) {}
      (window as any).__activeCameraStream = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  // Start camera helper
  const startCamera = async (mode: 'user' | 'environment') => {
    stopStream();
    setCameraError(null);
    setIsStarting(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (idealErr) {
        // Fallback for desktop webcams or browsers that reject ideal constraints
        console.warn('Ideal camera constraints fallback:', idealErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      if (typeof window !== 'undefined') {
        (window as any).__activeCameraStream = stream;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsStreaming(true);
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings to continue.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please connect a camera or verify hardware settings.');
      } else {
        setCameraError(err.message || 'Unable to access camera.');
      }
    } finally {
      setIsStarting(false);
    }
  };

  // Lifecycle: start camera only when photo is null
  useEffect(() => {
    if (!photo) {
      startCamera(facingMode);
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [photo, facingMode]);

  // Flip camera toggle
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Snap photo
  const handleSnap = () => {
    if (!videoRef.current || !isStreaming) return;
    setIsSnapping(true);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      // Cap max dimension for fast transmission (<100KB)
      const maxDim = 1200;
      let targetW = width;
      let targetH = height;
      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // If front camera (selfie or flipped), mirror the preview so it feels natural
      if (facingMode === 'user') {
        ctx.translate(targetW, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, targetW, targetH);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      stopStream();
      onPhotoCaptured(dataUrl);
    } catch (err) {
      console.error('Error snapping photo:', err);
    } finally {
      setIsSnapping(false);
    }
  };

  // Fallback for devices with broken webcam
  const handleEmergencyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = event.target?.result as string;
        if (raw) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 1200;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              onPhotoCaptured(canvas.toDataURL('image/jpeg', 0.85));
            } else {
              onPhotoCaptured(raw);
            }
          };
          img.src = raw;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-lg font-bold text-brand-dark mb-1">{label}</h3>
        <p className="text-xs text-gray-500">{sublabel}</p>
      </div>

      {/* Main Viewport */}
      <div className="relative aspect-[4/3] w-full bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-inner flex items-center justify-center">
        {photo ? (
          // Captured Preview
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img src={photo} alt="Captured photo" className="w-full h-full object-contain" />
            
            {/* Status overlay badge */}
            <div className="absolute top-3 left-3 bg-emerald-600/95 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <CheckCircle2 size={15} />
              <span>Live Photo Captured</span>
            </div>

            {/* Retake icon in top right */}
            <button
              onClick={onRetake}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-bold backdrop-blur-sm cursor-pointer"
              title="Retake photo"
            >
              <RefreshCw size={14} />
              <span>Retake</span>
            </button>
          </div>
        ) : (
          // Live Video Feed
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Starting Spinner */}
            {isStarting && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-2 z-20">
                <Loader2 size={32} className="animate-spin text-brand-purple" />
                <p className="text-xs font-bold">Activating camera feed...</p>
              </div>
            )}

            {/* Error Message */}
            {cameraError && (
              <div className="absolute inset-0 bg-gray-900/95 p-6 flex flex-col items-center justify-center text-center text-white z-20 space-y-3">
                <AlertCircle size={36} className="text-rose-400" />
                <p className="text-xs font-bold text-rose-200 max-w-xs">{cameraError}</p>
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} /> Try Camera Again
                  </button>
                  <label className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                    <Upload size={14} /> Upload as Fallback
                    <input type="file" accept="image/*" onChange={handleEmergencyUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* Overlay Frame Guides (Only when streaming and no error) */}
            {isStreaming && !cameraError && (
              <>
                {guideType === 'card' ? (
                  // Document card guideline
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="w-full max-w-[320px] aspect-[1.58/1] border-2 border-white/60 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
                      {/* 4 Corner Markers */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-purple rounded-tl"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-purple rounded-tr"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-purple rounded-bl"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-purple rounded-br"></div>

                      <div className="absolute inset-x-0 bottom-2 text-center">
                        <span className="text-[11px] font-bold text-white/90 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                          Align document inside card frame
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Face oval guideline
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="w-[180px] h-[240px] border-2 border-dashed border-white/70 rounded-[50%] relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-center justify-center">
                      <div className="text-center px-4">
                        <span className="text-[11px] font-bold text-white/90 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                          Center face inside oval
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Controls: Flip camera */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={handleFlipCamera}
                    type="button"
                    className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm transition-colors border border-white/10 shadow cursor-pointer"
                    title="Flip camera (Front / Back)"
                  >
                    <Repeat size={14} />
                    <span>Flip ({facingMode === 'user' ? 'Front' : 'Back'})</span>
                  </button>
                </div>

                {/* Shutter Flash Animation */}
                {isSnapping && <div className="absolute inset-0 bg-white animate-ping opacity-75 z-30" />}
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      {photo ? (
        // Snapped state: Retake or Confirm
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onRetake}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Retake Photo</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md shadow-brand-purple/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>{confirmLabel}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        // Live camera state: Shutter button & Back
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={!isStreaming || isStarting || !!cameraError || isSnapping}
            onClick={handleSnap}
            className="flex-1 px-6 py-3.5 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-brand-purple/25 disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer group active:scale-98"
          >
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:scale-110 transition-transform" />
            </div>
            <span>Snap Photo</span>
          </button>
        </div>
      )}
    </div>
  );
}
