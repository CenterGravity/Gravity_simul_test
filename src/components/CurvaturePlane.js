import * as THREE from "three";

export default function CurvaturePlane(bodies) {
  const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,

    wireframe: true,
  });

  const surface = new THREE.Mesh(geometry, material);
  surface.position.y = -1;

  // 시그모이드 falloff
  const smoothFalloff = (r, center = 1.0, k = 5.0) => {
    return 1 - 1 / (1 + Math.exp(-k * (r - center)));
  };

  surface.updateCurvature = (bodies) => {
    const pos = surface.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const z = pos[i + 2];

      let gravitySum = 0;

      bodies.forEach((body) => {
        const dx = x - body.pos.x;
        const dz = z - body.pos.z;
        const r = Math.sqrt(dx * dx + dz * dz);

        // Softening + 시그모이드로 감쇠
        const softened = 1 / (r + 0.5); // 폭주 방지
        const falloff = smoothFalloff(r, 1.5, 5); // 중심에서 완화

        const gravity = Math.sqrt(body.mass) * softened * falloff;

        gravitySum += gravity;
      });

      pos[i + 1] = -gravitySum * 0.3;
    }

    surface.geometry.attributes.position.needsUpdate = true;
    surface.geometry.computeVertexNormals();
  };

  return surface;
}
