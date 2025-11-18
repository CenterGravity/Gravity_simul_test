import * as THREE from "three";

export default function CurvaturePlane(bodies) {
  const geometry = new THREE.PlaneGeometry(10, 10, 10, 10); // 너비, 높이, 세그먼트 수 설정
  geometry.rotateX(-Math.PI / 2); // 평면을 수평으로 회전
  const material = new THREE.MeshPhongMaterial({
    // 재질 설정
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true,
  });

  const surface = new THREE.Mesh(geometry, material); // 메쉬 생성

  surface.updateCurvature = (bodies) => {
    // 곡률 업데이트 함수
    const pos = surface.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const z = pos[i + 2];
      let y = 1;

      bodies.forEach((body) => {
        const dx = x - body.pos.x;
        const dz = z - body.pos.z;
        const r = Math.sqrt(dx * dx + dz * dz) + 0.2;
        y += -body.mass / r;
      });

      pos[i + 1] = y * 0.05 -1;
    }

    surface.geometry.attributes.position.needsUpdate = true;
    surface.geometry.computeVertexNormals();
  };

  return surface;
}
