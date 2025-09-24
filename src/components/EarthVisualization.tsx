import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
  showDataLayers?: boolean;
}

function Earth({ showDataLayers = false }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <Sphere
        ref={meshRef}
        args={[2, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <meshStandardMaterial
          color="#1e40af"
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Data Layer Visualizations */}
      {showDataLayers && (
        <>
          {/* Climate Data Points */}
          {Array.from({ length: 20 }).map((_, i) => {
            const phi = Math.acos(-1 + (2 * i) / 20);
            const theta = Math.sqrt(20 * Math.PI) * phi;
            const x = 2.2 * Math.cos(theta) * Math.sin(phi);
            const y = 2.2 * Math.sin(theta) * Math.sin(phi);
            const z = 2.2 * Math.cos(phi);

            return (
              <Sphere key={i} args={[0.02]} position={[x, y, z]}>
                <meshBasicMaterial color="#10b981" />
              </Sphere>
            );
          })}
        </>
      )}

      {/* Floating Labels */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
      >
        Earth Resilience
      </Text>
    </group>
  );
}

const EarthVisualization: React.FC<{
  className?: string;
  showDataLayers?: boolean;
  interactive?: boolean;
}> = ({ className = "", showDataLayers = false, interactive = true }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        <Earth showDataLayers={showDataLayers} />
        {interactive && <OrbitControls enableZoom={true} enablePan={false} />}
      </Canvas>
    </div>
  );
};

export default EarthVisualization;