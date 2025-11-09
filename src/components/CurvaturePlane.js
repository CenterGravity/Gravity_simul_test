import * as THREE from "three";

export default function CurvaturePlane(bodies) {
  const geometry = new THREE.PlaneGeometry(10, 10, 100, 100);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshPhongMaterial({
    color: 0x3366ff,
    side: THREE.DoubleSide,
    wireframe: true,
  });

  const surface = new THREE.Mesh(geometry, material);
  
  
  surface.updateCurvature = (bodies) => {
    const pos = surface.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const z = pos[i + 2];
      let y = 1;

      bodies.forEach((body) => {
        const dx = x - body.pos.x;
        const dz = z - body.pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz) + 0.3;
        y += -body.mass / dist;
      });

      pos[i + 1] = y * 0.1;
    }

    surface.geometry.attributes.position.needsUpdate = true;
    surface.geometry.computeVertexNormals();
  };

  return surface;
}
