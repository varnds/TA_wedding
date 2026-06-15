import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { seededRng } from "./particleUtils";

let _flakeTex = null;
function flakeTexture() {
  if (_flakeTex) return _flakeTex;
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.62, "rgba(255,255,255,1)");
  g.addColorStop(0.82, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  _flakeTex = new THREE.CanvasTexture(cv);
  return _flakeTex;
}

function useSnowLayer(count, RX, RZ, TOP, speedRange) {
  const ref = useRef();
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() * 2 - 1) * RX;
      positions[i * 3 + 1] = Math.random() * TOP;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * RZ;
      speeds[i] = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: g, speeds };
  }, [count, RX, RZ, TOP, speedRange]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = Math.min(dt, 0.05);
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i += 1) {
      const yi = i * 3 + 1;
      arr[yi] -= speeds[i] * d;
      arr[i * 3] += Math.sin((arr[yi] + i) * 0.6) * d * 0.35;
      if (arr[yi] < -2) {
        arr[yi] = TOP;
        arr[i * 3] = (Math.random() * 2 - 1) * RX;
        arr[i * 3 + 2] = (Math.random() * 2 - 1) * RZ;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return { ref, geometry };
}

/** Falling snow — distant field + larger foreground flakes. */
export function Snowfall({ seasonKey, count = 850 }) {
  const main = useSnowLayer(count, 44, 44, 30, [1.6, 4.2]);
  const near = useSnowLayer(120, 18, 14, 22, [0.8, 2.2]);

  if (seasonKey !== "winter") return null;

  const mat = (size, opacity) => (
    <pointsMaterial
      color="#FFFFFF"
      map={flakeTexture()}
      size={size}
      sizeAttenuation
      transparent
      opacity={opacity}
      depthWrite={false}
      toneMapped={false}
      fog={false}
    />
  );

  return (
    <>
      <points ref={main.ref} geometry={main.geometry}>
        {mat(0.36, 1)}
      </points>
      <points ref={near.ref} geometry={near.geometry}>
        {mat(0.55, 0.92)}
      </points>
    </>
  );
}

/** Icy shimmer near the clothesline + wider ambient frost. */
export function FrostSparkles({ seasonKey }) {
  if (seasonKey !== "winter") return null;
  return (
    <>
      <Sparkles
        count={90}
        scale={[12, 5, 6]}
        position={[0, 3.2, 0]}
        size={2.8}
        speed={0.14}
        opacity={0.7}
        color="#D8ECFF"
      />
      <Sparkles
        count={80}
        scale={[44, 13, 30]}
        position={[0, 5, -2]}
        size={2.6}
        speed={0.1}
        opacity={0.55}
        color="#CFE4FF"
      />
      <Sparkles
        count={40}
        scale={[30, 8, 18]}
        position={[0, 3, 1]}
        size={1.8}
        speed={0.18}
        opacity={0.45}
        color="#9CC4FF"
      />
    </>
  );
}

let _leafTex = null;
function leafTexture() {
  if (_leafTex) return _leafTex;
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(s * 0.5, s * 0.05);
  ctx.bezierCurveTo(s * 0.95, s * 0.3, s * 0.95, s * 0.7, s * 0.5, s * 0.95);
  ctx.bezierCurveTo(s * 0.05, s * 0.7, s * 0.05, s * 0.3, s * 0.5, s * 0.05);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(s * 0.5, s * 0.1);
  ctx.lineTo(s * 0.5, s * 0.9);
  ctx.stroke();
  _leafTex = new THREE.CanvasTexture(cv);
  return _leafTex;
}

const AUTUMN_LEAF_COLORS = [
  "#EA580C", "#F97316", "#C2410C", "#FDBA74", "#B45309", "#D97706",
  "#92400E", "#A16207", "#78716C", "#BFA094",
];

/** Falling leaves with gusts, two fall speeds, and brief ground rest. */
export function AutumnLeaves({ seasonKey, count = 120 }) {
  const refs = useRef([]);
  const gust = useRef({ active: false, t: 0, next: 8 + Math.random() * 6 });
  const RX = 42;
  const RZ = 42;
  const TOP = 28;
  const tex = useMemo(() => leafTexture(), []);

  const leaves = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (seededRng(i) * 2 - 1) * RX,
      y: seededRng(i + 7) * TOP,
      z: (seededRng(i + 13) * 2 - 1) * RZ,
      fall: i % 3 === 0 ? 1.4 + seededRng(i + 3) * 1.8 : 0.7 + seededRng(i + 3) * 0.9,
      sway: 0.6 + seededRng(i + 5) * 1.2,
      swayPhase: seededRng(i + 9) * Math.PI * 2,
      spin: (seededRng(i + 11) - 0.5) * 2.4,
      scale: 0.2 + seededRng(i + 17) * 0.2,
      color: AUTUMN_LEAF_COLORS[Math.floor(seededRng(i + 23) * AUTUMN_LEAF_COLORS.length)],
      resting: 0,
    }));
  }, [count]);

  useFrame(({ clock }, dt) => {
    const d = Math.min(dt, 0.05);
    const t = clock.elapsedTime;
    const g = gust.current;
    g.next -= d;
    if (g.next <= 0 && !g.active) {
      g.active = true;
      g.t = 0;
    }
    if (g.active) {
      g.t += d;
      if (g.t > 1.6) {
        g.active = false;
        g.next = 8 + Math.random() * 8;
      }
    }
    const gustPush = g.active ? Math.sin(g.t * Math.PI) * 2.2 : 0;

    for (let i = 0; i < leaves.length; i += 1) {
      const m = refs.current[i];
      const L = leaves[i];
      if (!m) continue;

      if (L.resting > 0) {
        L.resting -= d;
        m.position.set(L.x, L.groundY ?? 0.05, L.z);
        m.rotation.z = L.restAngle ?? 0;
        if (L.resting <= 0) {
          L.y = TOP;
          L.x = (Math.random() * 2 - 1) * RX;
          L.z = (Math.random() * 2 - 1) * RZ;
        }
        continue;
      }

      L.y -= L.fall * d;
      const swayX = Math.sin(t * L.sway + L.swayPhase) * 0.9 + gustPush * d * (i % 2 === 0 ? 1 : -1);
      L.x += gustPush * d * 0.4;

      if (L.y < 0.08) {
        L.groundY = 0.05 + seededRng(i + 99) * 0.06;
        L.restAngle = (seededRng(i + 88) - 0.5) * 1.2;
        L.resting = 2 + seededRng(i + 77) * 2.5;
        L.y = L.groundY;
      }

      m.position.set(L.x + swayX, L.y, L.z);
      m.rotation.x = t * L.spin;
      m.rotation.y = t * L.spin * 0.7 + L.swayPhase;
      m.rotation.z = swayX * 0.6;
    }
  });

  if (seasonKey !== "autumn") return null;

  return (
    <group>
      {leaves.map((L, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[L.x, L.y, L.z]}
          scale={L.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={L.color}
            map={tex}
            alphaMap={tex}
            transparent
            alphaTest={0.4}
            roughness={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Early autumn — faint golden motes still drifting. */
export function AutumnMotes() {
  return (
    <Sparkles
      count={35}
      scale={[36, 9, 22]}
      position={[0, 4, -2]}
      size={1.6}
      speed={0.18}
      opacity={0.35}
      color="#FFD090"
    />
  );
}
