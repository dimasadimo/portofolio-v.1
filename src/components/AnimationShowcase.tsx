import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { useIntl } from 'react-intl';
import { gsap } from 'gsap';

const Particles = ({ count = 3000 }) => {
  const mesh = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        // Color based on Y position (orange to purple)
        const mix = (positions[i * 3 + 1] + 5) / 10;
        const color = new THREE.Color().lerpColors(
            new THREE.Color('#FE5402'),
            new THREE.Color('#7A1FA2'),
            mix
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.sin(time / 4) * 0.2;
    mesh.current.rotation.y = Math.sin(time / 2) * 0.2;
    
    // Slight movement towards mouse
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, mouse.x * 0.5, 0.1);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, mouse.y * 0.5, 0.1);
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial 
        size={0.03} 
        vertexColors 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
      />
    </points>
  );
};

export const AnimationShowcase: React.FC = () => {
  const intl = useIntl();
  const textRef = useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current, 
        { opacity: 0, y: 100, skewY: 10 },
        {
          opacity: 1, 
          y: 0, 
          skewY: 0,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  return (
    <section id="animation" className="relative h-screen w-full bg-[#0C1B3F] overflow-hidden">
      <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-orange/20 to-purple/20 animate-pulse" />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <Particles />
        </Canvas>
      </Suspense>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
        <h2 
          ref={textRef}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white text-center leading-none tracking-tighter"
        >
          {intl.formatMessage({ id: 'animation.text' })}
        </h2>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-[10px] uppercase tracking-[0.3em]">
        <span>Interactive</span>
        <div className="w-12 h-px bg-white/20" />
        <span>Canvas</span>
      </div>
    </section>
  );
};

export default AnimationShowcase;
