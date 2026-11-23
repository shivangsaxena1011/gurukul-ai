import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface KnowledgeOrb3DProps {
  className?: string;
  size?: number;
}

export const KnowledgeOrb3D: React.FC<KnowledgeOrb3DProps> = ({ className = '', size = 320 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive size calculation
    const isMobile = window.innerWidth < 640;
    const computedSize = isMobile ? Math.min(size, window.innerWidth - 64, 270) : size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(computedSize, computedSize);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group to hold all objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Core: Glowing Wireframe Polyhedron (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: 0xd97706,
      emissiveIntensity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // 2. Inner Crystal Sphere
    const innerGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // 3. Orbital Rings (Gimbal)
    const createRing = (radius: number, color: number, rotX: number, rotY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.02, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color, wireframe: false });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.rotation.y = rotY;
      return ringMesh;
    };

    const ring1 = createRing(1.8, 0xfbbf24, Math.PI / 4, 0);
    const ring2 = createRing(2.1, 0x34d399, -Math.PI / 3, Math.PI / 6);
    const ring3 = createRing(2.4, 0x60a5fa, Math.PI / 6, Math.PI / 3);
    group.add(ring1, ring2, ring3);

    // 4. Floating Knowledge Particles
    const particleCount = isMobile ? 120 : 200; // optimized for mobile GPU
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfde68a,
      size: 0.04,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfbbf24, 2, 10);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2, 10);
    blueLight.position.set(-3, -2, 2);
    scene.add(blueLight);

    // Mouse & Touch interactive tilt
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (clientX: number, clientY: number) => {
      const rect = currentMount.getBoundingClientRect();
      pointerX = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!currentMount) return;
      const isMob = window.innerWidth < 640;
      const newSize = isMob ? Math.min(size, window.innerWidth - 64, 270) : size;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize, newSize);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous smooth rotation
        coreMesh.rotation.x += delta * 0.4;
        coreMesh.rotation.y += delta * 0.6;

        ring1.rotation.z += delta * 0.3;
        ring2.rotation.z -= delta * 0.4;
        ring3.rotation.x += delta * 0.2;

        particles.rotation.y += delta * 0.1;

        // Subtle breathing scale
        const scale = 1 + Math.sin(time * 2) * 0.04;
        coreMesh.scale.set(scale, scale, scale);

        // Smooth damping
        targetX += (pointerX * 0.4 - targetX) * 0.05;
        targetY += (pointerY * 0.4 - targetY) * 0.05;
        group.rotation.y = targetX;
        group.rotation.x = -targetY;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center select-none touch-none ${className}`}
      aria-label="Interactive 3D Knowledge Orb"
    />
  );
};
