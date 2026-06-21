"use client";
import React from 'react';
import Atropos from 'atropos/react';
import 'atropos/css';

export default function ZeroGravityCard({ children, className = "", style = {}, activeOffset = 40, shadowScale = 1.05 }) {
  return (
    <Atropos
      activeOffset={activeOffset}
      shadowScale={shadowScale}
      shadow={false}
      className={className}
      style={{
        ...style,
        width: '100%',
        height: '100%'
      }}
    >
      {/* We add data-atropos-offset to some children optionally if they want more depth */}
      {children}
    </Atropos>
  );
}
