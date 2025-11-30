export function calculateGravityForce(m1, m2, pos1, pos2) {
  // 중력 계산 함수
  const dx = pos2.x - pos1.x; // 두 물체 사이의 거리 벡터 계산
  const dy = pos2.y - pos1.y; // 두 좌표의 차이가 거리이다
  const dz = pos2.z - pos1.z; // 고로 그 숫자들이 벡터의 성분이 됨.
  const minDist = 0.3; // 최소 거리 설정 (충돌 방지)
  const distance = Math.max(minDist, Math.sqrt(dx * dx + dy * dy + dz * dz)); // 거리의 크기 계산
  const G = 0.3; // 임시 상수, 나중에 조정 가능
  const forceMagnitude = (G * m1 * m2) / (distance * distance);
  const fx = (dx / distance) * forceMagnitude; // 힘 벡터 계산
  const fy = (dy / distance) * forceMagnitude;
  const fz = (dz / distance) * forceMagnitude;
  return { x: fx, y: fy, z: fz }; // 힘 벡터 반환
}

export function updatePositions(bodies, dt) {
  // 위치 업데이트 함수
  const forces = [];
  for (let i = 0; i < bodies.length; i++) {
    let totalForce = { x: 0, y: 0, z: 0 };

    for (let j = 0; j < bodies.length; j++) {
      // 중력 계산 (F = G * (m1*m2) / r^2)
      if (i === j) continue;
      const f = calculateGravityForce(
        bodies[i].mass,
        bodies[j].mass,
        bodies[i].pos,
        bodies[j].pos
      ); // 중력 계산에 필요한 인자 전달
      totalForce.x += f.x;
      totalForce.y += f.y;
      totalForce.z += f.z;
    }

    forces.push(totalForce);
  }
  const prevA = [];
  for (let i = 0; i < bodies.length; i++) {
    // 위치와 속도 업데이트
    const a = {
      // 가속도 계산 3차원 물체이기에 3개의 성분을 객체로 묶어서 처리
      x: forces[i].x / bodies[i].mass, // 가속도는 힘 / 질량
      y: forces[i].y / bodies[i].mass, // 가속도는 힘 / 질량
      z: forces[i].z / bodies[i].mass, // 가속도는 힘 / 질량
    };
    prevA.push(a);
  }
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].pos.x += bodies[i].vel.x * dt + 0.5 * prevA[i].x * dt * dt;
    bodies[i].pos.y += bodies[i].vel.y * dt + 0.5 * prevA[i].y * dt * dt;
    bodies[i].pos.z += bodies[i].vel.z * dt + 0.5 * prevA[i].z * dt * dt;
  }
  const newForces = [];
  for (let i = 0; i < bodies.length; i++) {
    let totalForce = { x: 0, y: 0, z: 0 };
    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue;
      const f = calculateGravityForce(
        bodies[i].mass,
        bodies[j].mass,
        bodies[i].pos,
        bodies[j].pos
      );
      totalForce.x += f.x;
      totalForce.y += f.y;
      totalForce.z += f.z;
    }
    newForces.push(totalForce);
  }
  for (let i = 0; i < bodies.length; i++) {
    const newA = {
      x: newForces[i].x / bodies[i].mass,
      y: newForces[i].y / bodies[i].mass,
      z: newForces[i].z / bodies[i].mass,
    };

    bodies[i].vel.x += 0.5 * (prevA[i].x + newA.x) * dt;
    bodies[i].vel.y += 0.5 * (prevA[i].y + newA.y) * dt;
    bodies[i].vel.z += 0.5 * (prevA[i].z + newA.z) * dt;

    // 감쇠 추가 (에너지 폭발 방지용)
    bodies[i].vel.x *= 0.999;
    bodies[i].vel.y *= 0.999;
    bodies[i].vel.z *= 0.999;
  }

  return bodies;
}
