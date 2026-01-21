
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';

const ParticleFlow = () => {
  const points = useRef<THREE.Points>(null!);
  const count = 20000; // 高密度な粒子
  const location = useLocation();

  // 各ページ用のターゲット形状（座標データ）を事前に生成
  const shapes = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const topics = new Float32Array(count * 3);
    const news = new Float32Array(count * 3);
    const contact = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // 1. Sphere (TOP / Home) - より完璧で密度のある球体
      // 表面だけでなく、少しだけ内部にも散らすことで立体感を出す
      const r_base = 3.5; 
      const r_s = r_base * (0.95 + Math.random() * 0.1); // 厚みを持たせる
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      sphere[i3] = r_s * Math.sin(phi) * Math.cos(theta);
      sphere[i3 + 1] = r_s * Math.sin(phi) * Math.sin(theta);
      sphere[i3 + 2] = r_s * Math.cos(phi);

      // 2. Topics (Organic Irregular) - 有機的な歪み
      const phi_t = Math.random() * Math.PI * 2;
      const theta_t = Math.random() * Math.PI;
      const distortion = 
        Math.sin(phi_t * 5.0) * Math.cos(theta_t * 4.0) * 2.0 + 
        Math.sin(phi_t * 0.8) * 1.5 + 
        (Math.random() - 0.5) * 1.0;
      const r_t = 2.8 + distortion;
      topics[i3] = r_t * Math.sin(theta_t) * Math.cos(phi_t);
      topics[i3 + 1] = r_t * Math.sin(theta_t) * Math.sin(phi_t);
      topics[i3 + 2] = r_t * Math.cos(theta_t);

      // 3. News (Horizontal Flow) - 波打つ流れ
      news[i3] = (Math.random() - 0.5) * 14;
      news[i3 + 1] = Math.sin(news[i3] * 0.6) * 1.5 + (Math.random() - 0.5) * 3;
      news[i3 + 2] = (Math.random() - 0.5) * 4;

      // 4. Contact (Post Box Shape / 郵便ポスト)
      const rand = Math.random();
      if (rand < 0.6) {
        // 円柱の胴体
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.5;
        const height = (Math.random() - 0.5) * 6 - 1;
        contact[i3] = Math.cos(angle) * radius;
        contact[i3 + 1] = height;
        contact[i3 + 2] = Math.sin(angle) * radius;
      } else if (rand < 0.9) {
        // 上部のドーム
        const u_d = Math.random();
        const v_d = Math.random() * 0.5;
        const theta_d = 2 * Math.PI * u_d;
        const phi_d = Math.acos(2 * v_d - 1);
        const r_d = 1.5;
        contact[i3] = r_d * Math.sin(phi_d) * Math.cos(theta_d);
        contact[i3 + 1] = r_d * Math.cos(phi_d) + 2;
        contact[i3 + 2] = r_d * Math.sin(phi_d) * Math.sin(theta_d);
      } else {
        // 投函口
        const slotWidth = (Math.random() - 0.5) * 2;
        const slotHeight = (Math.random() - 0.5) * 0.4 + 0.5;
        contact[i3] = slotWidth;
        contact[i3 + 1] = slotHeight;
        contact[i3 + 2] = 1.6;
      }
    }
    return { sphere, topics, news, contact };
  }, []);

  // パス判定をより厳密に行う
  const getTargetBuffer = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return shapes.sphere;
    if (path.startsWith('/topics')) return shapes.topics;
    if (path.startsWith('/news')) return shapes.news;
    if (path.startsWith('/contact')) return shapes.contact;
    return shapes.sphere;
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const targetBuffer = getTargetBuffer();
    const posAttr = points.current.geometry.attributes.position.array as Float32Array;
    
    const transitionSpeed = 0.04;
    const constantNoiseSpeed = 0.4;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // 形状モーフィング
      posAttr[i3] = THREE.MathUtils.lerp(posAttr[i3], targetBuffer[i3], transitionSpeed);
      posAttr[i3 + 1] = THREE.MathUtils.lerp(posAttr[i3 + 1], targetBuffer[i3 + 1], transitionSpeed);
      posAttr[i3 + 2] = THREE.MathUtils.lerp(posAttr[i3 + 2], targetBuffer[i3 + 2], transitionSpeed);
      
      // 一定速度の微細な揺らぎ
      const noise = Math.sin(time * constantNoiseSpeed + i * 0.001) * 0.015;
      posAttr[i3] += noise;
      posAttr[i3 + 1] += noise;
      posAttr[i3 + 2] += noise;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // 全体の回転（一定速度）
    points.current.rotation.y = time * 0.015;
    
    // TOP以外では少し角度をつけて立体感を強調
    if (location.pathname !== '/' && location.pathname !== '') {
        points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, 0.2, 0.02);
    } else {
        points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, 0, 0.05);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(shapes.sphere)} // 初期は球体
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038} // より繊細な点に調整
        color="#00a3ff"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const BackgroundScene: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#020617]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 6, 22]} />
        <ParticleFlow />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
