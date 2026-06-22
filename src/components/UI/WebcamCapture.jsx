"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function WebcamCapture({ onCapture, initialPhoto = null }) {
  const [photo, setPhoto] = useState(initialPhoto);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true);
      // Auto-start camera
      startCamera();
    }
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setPermissionError(null);
    try {
      const constraints = {
        video: { width: 400, height: 400, facingMode: "user" },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Error accessing camera:", err);
      setPermissionError("Camera access denied. Please upload a file instead.");
      setCameraActive(false);
    }
  };

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
            <video ref={videoRef} className="w-full h-full object-cover -scale-x-100" playsInline muted autoPlay />

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
        <p className="text-rose-500 text-xs font-bold mt-2 bg-rose-500/10 px-3 py-1 rounded-full">{permissionError}</p>
      )}
    </div>
  );
}
