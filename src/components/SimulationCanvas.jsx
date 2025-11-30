// src/components/SimulationCanvas.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { updatePositions } from "../hooks/useGravitySimulation";
import CurvaturePlane from "./CurvaturePlane";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const mass1 = 10;
const mass2 = 1;
export default function SimulationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // === 기본 설정 ===
    let bodies = [
      // 바디바디 후 바디바디 예
      {
        mass: mass1,
        pos: { x: -6, y: 0, z: 0 },
        vel: { x: 0, y: 0, z: 0 },
      },
      {
        mass: mass2,
        pos: { x: 6, y: 0, z: 0 },
        vel: { x: 0, y: 0, z: 1 },
      },
    ];
    const scene = new THREE.Scene(); // 장면 생성
    scene.background = new THREE.Color(0x020202); // 검은 배경

    // === 축 추가 ===
    const axes = new THREE.AxesHelper(1);
    scene.add(axes);

    // === 곡률 평면 생성 ===
    const curvaturePlane = CurvaturePlane(bodies);
    scene.add(curvaturePlane);
    console.log(scene.children);

    const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.7;

    // === 조명 ===
    const light = new THREE.PointLight(0xffffff, 100);
    light.position.set(0, 5, 0);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040, 3); // 약한 전체 조명
    scene.add(ambient);

    // === 구 2개 생성 ===

    const radius1 = mass1 ** (1 / 3) * 5;
    const sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(radius1 / 10, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x00aaff })
    );
    sphere1.position.x = -1.5;

    const radius2 = mass2 ** (1 / 3) * 5;
    const sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(radius2 / 10, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xff5533 })
    );
    sphere2.position.x = 1.5;

    scene.add(sphere1);
    scene.add(sphere2);

    // === 애니메이션 ===
    const animate = () => {
      controls.update();
      const dt = 0.01; // 시간 간격 설정
      bodies = updatePositions(bodies, dt);
      curvaturePlane.updateCurvature(bodies);
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
