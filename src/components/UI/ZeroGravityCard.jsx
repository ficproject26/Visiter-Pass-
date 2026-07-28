"use client";
import React from 'react';

export default function ZeroGravityCard({ children, className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        ...style,
        width: '100%',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {children}
    </div>
  );
}
