import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";

const CLOUD_URL = "/cloud.glb";

// Soft, season-independent white so the cloud never picks up the warm/cool
// scene light (the morph animation supplies the form).
const CLOUD_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#FFFFFF",
  emissive: "#EAF0F8",
  emissiveIntensity: 0.45,
  roughness: 1,
  metalness: 0,
});
CLOUD_MATERIAL.fog = false;

const SPAN_X = 70;

const CLOUDS = [
  { x: -34, y: 12.5, z: -26, scale: 7.5, speed: 0.55, phase: 0.0 },
  { x: 6, y: 14.5, z: -38, scale: 10, speed: 0.4, phase: 3.1 },
  { x: 30, y: 10.5, z: -20, scale: 6, speed: 0.7, phase: 1.6 },
  { x: -12, y: 16.5, z: -48, scale: 12, speed: 0.3, phase: 5.0 },
];

function CloudInstance({ x, y, z, scale, speed, phase }) {
  const { scene, animations } = useGLTF(CLOUD_URL);
  const cloned = useMemo(() => {
    const c = skeletonClone(scene);
    c.traverse((o) => {
      if (o.isMesh) {
        o.material = CLOUD_MATERIAL;
        o.castShadow = false;
        o.receiveShadow = false;
        o.frustumCulled = false;
        o.renderOrder = -1;
      }
    });
    return c;
  }, [scene]);

  const group = useRef();
  const { actions } = useAnimations(animations, cloned);

  useEffect(() => {
    const action = Object.values(actions)[0];
    if (!action) return;
    action.reset();
    action.time = phase; // desync the loop between clouds
    action.play();
  }, [actions, phase]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.x += dt * speed;
    if (g.position.x > SPAN_X) g.position.x = -SPAN_X;
  });

  return (
    <group ref={group} position={[x, y, z]} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

export function GltfClouds({ show = true }) {
  if (!show) return null;
  return (
    <group>
      {CLOUDS.map((c, i) => (
        <CloudInstance key={i} {...c} />
      ))}
    </group>
  );
}

useGLTF.preload(CLOUD_URL);
