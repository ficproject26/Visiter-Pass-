"use client";
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera, Torus, Sphere, Icosahedron, Box, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Mouse interaction component
function CameraRig({ isDark }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Smooth camera parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current.y * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({ isDark }) {
  // Material properties based on theme
  const materialProps = useMemo(() => {
    if (isDark) {
      // Sleek, glassy dark mode
      return {
        transmission: 0.95,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.05,
        ior: 1.5,
        thickness: 2,
        specularIntensity: 1,
        color: '#ffffff',
        envMapIntensity: 1,
      };
    } else {
      // Soft, frosted/matte light mode
      return {
        transmission: 0.2,
        opacity: 0.9,
        metalness: 0.1,
        roughness: 0.4,
        ior: 1.2,
        thickness: 5,
        color: '#ffffff',
        envMapIntensity: 0.8,
      };
    }
  }, [isDark]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
      <CameraRig isDark={isDark} />
      
      {/* Dynamic Lighting */}
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      {isDark ? (
        <>
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#818CF8" />
          <pointLight position={[-10, -10, -10]} intensity={2} color="#D4891A" />
          <spotLight position={[0, 5, 0]} intensity={1} color="#8B5CF6" penumbra={1} />
        </>
      ) : (
        <>
          <directionalLight position={[10, 10, 10]} intensity={1} color="#fff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C084FC" />
          <pointLight position={[10, -10, 5]} intensity={0.8} color="#f59e0b" />
        </>
      )}

      {/* Floating Geometry */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        {/* Center Orb */}
        <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
          <meshPhysicalMaterial {...materialProps} />
        </Sphere>
        
        {/* Outer Ring */}
        <Torus args={[3.5, 0.4, 32, 100]} position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <meshPhysicalMaterial {...materialProps} />
        </Torus>

        {/* Small floating cube */}
        <Float speed={3} rotationIntensity={2} floatIntensity={2}>
          <Box args={[1.5, 1.5, 1.5]} position={[-5, 3, -2]} rotation={[Math.PI / 4, Math.PI / 4, 0]} radius={0.2}>
            <meshPhysicalMaterial {...materialProps} />
          </Box>
        </Float>

        {/* Floating Icosahedron */}
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5}>
          <Icosahedron args={[1.5, 0]} position={[5, -3, 2]}>
            <meshPhysicalMaterial {...materialProps} />
          </Icosahedron>
        </Float>

        {/* Distant small orbs */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <Sphere args={[0.8, 32, 32]} position={[-4, -4, -5]}>
            <meshPhysicalMaterial {...materialProps} color={isDark ? "#818CF8" : "#C084FC"} />
          </Sphere>
          <Sphere args={[1.2, 32, 32]} position={[6, 4, -8]}>
            <meshPhysicalMaterial {...materialProps} color={isDark ? "#D4891A" : "#f59e0b"} />
          </Sphere>
        </Float>
      </Float>

      {/* Soft Contact Shadows below the scene */}
      <ContactShadows position={[0, -6, 0]} opacity={isDark ? 0.3 : 0.1} scale={20} blur={2} far={10} />
      
      {/* Environment map for realistic reflections */}
      <Environment preset={isDark ? "night" : "city"} />
    </>
  );
}

export default function InteractiveBackground() {
  const { isDark } = useTheme();
  const bgColor = isDark ? '#0B1020' : '#F7F5F0';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: bgColor,
      transition: 'background 0.5s ease',
      pointerEvents: 'none', // Allow clicking through to the website
    }}>
      {/* Render Canvas only if we're in the browser to avoid SSR issues */}
      {typeof window !== 'undefined' && (
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Scene isDark={isDark} />
        </Canvas>
      )}

      {/* Overlay noise texture for that premium film-grain look */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E")',
        mixBlendMode: 'overlay',
        opacity: isDark ? 0.3 : 0.4,
        pointerEvents: 'none'
      }} />
    </div>
  );
}
