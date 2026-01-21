
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';

const Crystal = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    mesh.current.rotation.y += 0.01;
    mesh.current.rotation.z += 0.005;
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[2, 0]} />
        <MeshDistortMaterial 
          color="#00a3ff" 
          speed={2} 
          distort={0.4} 
          wireframe 
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[2.05, 0]} />
        <meshBasicMaterial color="#00a3ff" wireframe transparent opacity={0.05} />
      </mesh>
    </Float>
  );
};

const Hologram: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00a3ff" />
        <Crystal />
      </Canvas>
    </div>
  );
};

export default Hologram;
