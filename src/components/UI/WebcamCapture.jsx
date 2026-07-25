"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function WebcamCapture({ onCapture, initialPhoto = null }) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { isDark } = useTheme();

  const startCamera = useCallback(async () => {
    setPermissionError(null);
    if (typeof window !== "undefined" && !window.isSecureContext && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      setPermissionError("Camera access requires HTTPS or localhost on mobile. Please use 'Upload Photo' below.");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionError("Camera API is restricted on HTTP connections. Please upload a photo instead.");
      return;
    }
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: false
        });
      } catch (firstErr) {
        // Fallback for webcams that don't support facingMode or ideal dimensions
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.warn("Error accessing camera:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError("Camera access denied. Please allow camera permission in your browser site settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setPermissionError("No camera found on this device. Please upload a file instead.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setPermissionError("Camera is currently in use by another application.");
      } else if (err.name === "SecurityError") {
        setPermissionError("Camera is blocked over unencrypted HTTP IP. Please upload a photo below.");
      } else {
        setPermissionError("Could not enable camera (" + (err.message || "Unknown error") + "). Please upload a file instead.");
      }
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true);
    }
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      setTimeout(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth || 400;
        canvas.height = video.videoHeight || 400;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhoto(dataUrl);
        onCapture(dataUrl);
        stopCamera();
        setIsCapturing(false);
      }, 300); // 300ms capture flash animation
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        onCapture(reader.result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const clearPhoto = () => {
    setPhoto(null);
    onCapture(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden transition-all duration-300 group
          ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-slate-300'}
          ${isDragOver ? 'border-indigo-500 border-4 scale-105 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'border-2 border-dashed'}
        `}
      >
        <AnimatePresence>
          {isCapturing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50 mix-blend-overlay"
            />
          )}
        </AnimatePresence>

        {photo ? (
          <div className="relative w-full h-full">
            <img src={photo} alt="Captured" className="w-full h-full object-cover" />

            {/* Success Checkmark Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 flex items-center justify-center bg-teal-500/20 backdrop-blur-[2px]"
            >
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50">
                <span className="text-white text-3xl font-bold">✓</span>
              </div>
            </motion.div>
          </div>
        ) : cameraActive ? (
          <div className="relative w-full h-full">
            <video
              ref={(node) => {
                videoRef.current = node;
                if (node && streamRef.current) {
                  node.srcObject = streamRef.current;
                  node.play().catch(() => {});
                }
              }}
              className="w-full h-full object-cover -scale-x-100"
              playsInline
              muted
              autoPlay
            />

            {/* Face Alignment Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[85%] h-[85%] border-2 border-indigo-500/50 rounded-[40%] flex items-center justify-center relative mt-4">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-lg">
                  Align Face
                </div>
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
              </div>
            </div>

            {/* Scanning Line */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_10px_#6366f1] z-10 opacity-50"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className={`text-4xl mb-4 ${isDragOver ? 'animate-bounce' : ''}`}>📁</div>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isDragOver ? 'Drop image here' : 'Camera inactive or unavailable.'}
            </p>
            {!isDragOver && (
              <p className="text-xs opacity-50 mt-2">Drag & drop a file to upload</p>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-wrap gap-3 justify-center w-full">
        {photo ? (
          <button
            type="button"
            onClick={clearPhoto}
            className={`rounded-full text-sm font-bold transition-all whitespace-nowrap ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 32px" }}
          >
            🔄 Retake Photo
          </button>
        ) : cameraActive ? (
          <>
            <button
              type="button"
              onClick={capturePhoto}
              className="rounded-full text-sm font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 48px" }}
            >
              <span>📸</span> <span>Capture</span>
            </button>
            <label
              className={`rounded-full text-sm font-bold cursor-pointer transition-all whitespace-nowrap shadow-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 48px" }}
            >
              <span>📁</span> <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </>
        ) : (
          <>
            {hasCamera && (
              <button
                type="button"
                onClick={startCamera}
                className="rounded-full text-sm font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-all whitespace-nowrap"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 32px" }}
              >
                📹 Enable Camera
              </button>
            )}
            <label
              className={`rounded-full text-sm font-bold cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 48px" }}
            >
              📁 Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </>
        )}
      </div>

      {permissionError && (
        <div className="flex flex-col items-center gap-3 mt-3 w-full max-w-[340px] px-2">
          <div className="text-rose-500 text-xs font-semibold bg-rose-500/15 border border-rose-500/20 px-4 py-2 rounded-xl text-center leading-relaxed w-full shadow-sm">
            {permissionError}
          </div>
          {permissionError.includes("browser site settings") && (
            <div className={`p-5 rounded-2xl border text-xs text-left w-full shadow-lg transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
              <div className="font-bold flex items-center gap-2 text-amber-500 mb-3 text-xs">
                <span className="text-base">🔒</span>
                <span>How to allow camera access:</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-[10px] mt-0.5">1</span>
                  <span>Click the 🔒 lock or site settings icon in your browser URL bar.</span>
                </div>
                <div className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-[10px] mt-0.5">2</span>
                  <span>Change <strong>Camera</strong> permission to <strong>Allow</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-[10px] mt-0.5">3</span>
                  <span>Click <strong>Enable Camera</strong> button again.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
