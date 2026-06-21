"use client";
import React from "react";
import ReactQRCode from "react-qr-code";

export default function QRCode({ value = "", size = 120, fill = "#1e1b4b" }) {
  return (
    <div style={{ background: "white", padding: 4, borderRadius: 6, display: "inline-flex" }}>
      <ReactQRCode 
        value={value || "VOS:EMPTY"} 
        size={size} 
        fgColor={fill} 
        bgColor="transparent"
      />
    </div>
  );
}
