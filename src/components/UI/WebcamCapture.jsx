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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "12px", justifyContent: "center" }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          width: "100%",
          maxWidth: "260px",
          height: "240px",
          borderRadius: "16px",
          border: isDragOver ? "3px solid #6366f1" : isDark ? "2px dashed rgba(255,255,255,0.2)" : "2px dashed #cbd5e1",
          backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease"
        }}
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
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <img src={photo} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

            {/* Success Checkmark Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(20, 184, 166, 0.2)", backdropFilter: "blur(2px)" }}
            >
              <div style={{ width: "64px", height: "64px", backgroundColor: "#14b8a6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 25px rgba(20, 184, 166, 0.5)" }}>
                <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold" }}>✓</span>
              </div>
            </motion.div>
          </div>
        ) : cameraActive ? (
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <video
              ref={(node) => {
                videoRef.current = node;
                if (node && streamRef.current) {
                  node.srcObject = streamRef.current;
                  node.play().catch(() => {});
                }
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
              playsInline
              muted
              autoPlay
            />

            {/* Face Alignment Overlay */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "80%", height: "80%", border: "2px solid rgba(99, 102, 241, 0.6)", borderRadius: "40%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "10px", padding: "2px 10px", borderRadius: "9999px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>
                  Align Face
                </div>
              </div>
            </div>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", alignItems: "center" }}>
        {photo ? (
          <button
            type="button"
            onClick={clearPhoto}
            className={`rounded-full text-xs font-bold transition-all whitespace-nowrap ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 20px", width: "100%", maxWidth: "240px" }}
          >
            🔄 Retake Photo
          </button>
        ) : cameraActive ? (
          <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
            <button
              type="button"
              onClick={capturePhoto}
              className="rounded-full text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg transition-all whitespace-nowrap"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 18px", flex: 1 }}
            >
              <span>📸</span> <span>Capture</span>
            </button>
            <label
              className={`rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap shadow-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 18px", flex: 1 }}
            >
              <span>📁</span> <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" style={{ display: "none" }} />
            </label>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "240px" }}>
            {hasCamera && (
              <button
                type="button"
                onClick={startCamera}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  width: "100%",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
                }}
              >
                📹 Enable Camera
              </button>
            )}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 20px",
                width: "100%",
                backgroundColor: isDark ? "#334155" : "#0f172a",
                color: "#ffffff",
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(15,23,42,0.2)"
              }}
            >
              📁 Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
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
