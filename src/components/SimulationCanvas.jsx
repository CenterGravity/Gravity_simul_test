// src/components/SimulationCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { calculateGravityForce, updatePositions } from "../hooks/useGravitySimulation";

const mass1 = 30;
const mass2 = 50;

export default function SimulationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // === 기본 설정 ===
    let bodies = [
      {
        mass: mass1,
        pos: { x: -15, y: 0, z: 0 },
        vel: { x: 0, y: 0, z: 0 }
      },
      {
        mass: mass2,
        pos: { x: 15, y: 0, z: 0 },
        vel: { x: 0, y: 0, z: 0 }
      }
    ];
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // 검은 배경

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 50);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // === 조명 ===
    const light = new THREE.PointLight(0xffffff, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040, 3); // 약한 전체 조명
    scene.add(ambient);

    // === 구 2개 생성 ===
    const sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(mass1 / 10, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x00aaff })
    );
    sphere1.position.x = -1.5;

    const sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(mass2 / 10, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xff5533 })
    );
    sphere2.position.x = 1.5;

    scene.add(sphere1);
    scene.add(sphere2);

    // === 애니메이션 ===
    const animate = () => {
      const dt = 0.01;
      bodies = updatePositions(bodies, dt);
      sphere1.position.set(bodies[0].pos.x, bodies[0].pos.y, bodies[0].pos.z);
      sphere2.position.set(bodies[1].pos.x, bodies[1].pos.y, bodies[1].pos.z);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // === 윈도우 리사이즈 대응 ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // === 클린업 ===
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
