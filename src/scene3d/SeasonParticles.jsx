import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  LANTERN_WORLD,
  makeFireflyTexture,
  makeMoteTexture,
  makeStarTexture,
  seededRng,
  springFlowerSites,
} from "./particleUtils";
import { terrainHeight } from "./coords";
import { SUN_POSITION } from "./coords";

// ─── Night: star dome ───────────────────────────────────────────────────────

export function StarField({ lanternOn, count = 320 }) {
  const ref = useRef();
  const tex = useMemo(() => makeStarTexture(), []);
  const { geometry, twinkle } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const u = seededRng(i + 1);
      const v = seededRng(i + 2);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(1 - v * 0.72);
      const r = 210 + seededRng(i + 3) * 35;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 8;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      phases[i] = seededRng(i + 4) * Math.PI * 2;
      speeds[i] = 0.4 + seededRng(i + 5) * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, twinkle: { phases, speeds } };
  }, [count]);

  const baseOpacity = lanternOn ? 0.55 : 0.92;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.material.opacity =
      baseOpacity + Math.sin(clock.elapsedTime * 0.35) * 0.03;
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={tex}
        color="#F8FBFF"
        size={0.55}
        sizeAttenuation={false}
        transparent
        opacity={baseOpacity}
        depthWrite={false}
        toneMapped={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Night: rare shooting star ──────────────────────────────────────────────

export function ShootingStar() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const streak = useRef({ t: 0, origin: new THREE.Vector3(), dir: new THREE.Vector3() });
  const nextAt = useRef(performance.now() + 12000 + Math.random() * 25000);

  useFrame(() => {
    const now = performance.now();
    const s = streak.current;
    if (!visible) {
      if (now >= nextAt.current) {
        const ox = (Math.random() - 0.5) * 80;
        const oy = 22 + Math.random() * 28;
        const oz = -40 - Math.random() * 30;
        s.origin.set(ox, oy, oz);
        s.dir.set(18 + Math.random() * 12, -8 - Math.random() * 6, 6 + Math.random() * 8);
        s.t = 0;
        setVisible(true);
      }
      return;
    }
    s.t += 0.022;
    if (!ref.current) return;
    ref.current.position.copy(s.origin).addScaledVector(s.dir, s.t);
    ref.current.material.opacity = Math.sin(Math.min(1, s.t) * Math.PI) * 0.95;
    if (s.t >= 1.05) {
      setVisible(false);
      nextAt.current = now + 18000 + Math.random() * 42000;
    }
  });

  return (
    <mesh ref={ref} visible={visible} rotation={[0, 0.4, -0.55]}>
      <planeGeometry args={[2.8, 0.06]} />
      <meshBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0}
        toneMapped={false}
        fog={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Night: ground fireflies (two layers: slow drifters + pulsing bright) ───

export function GroundFirefliesFixed({ lanternOn }) {
  const slowRef = useRef();
  const brightRef = useRef();
  const tex = useMemo(() => makeFireflyTexture(), []);

  const { slowGeo, brightGeo, slowFlies, brightFlies } = useMemo(() => {
    const mk = (n, offset, bright) =>
      Array.from({ length: n }, (_, i) => {
        const x = (seededRng(i + offset) - 0.5) * 52;
        const z = -4 + seededRng(i + offset + 11) * 22;
        const y = terrainHeight(x, z) + 0.35 + seededRng(i + offset + 22) * 1.8;
        return {
          x,
          y,
          z,
          phase: seededRng(i + offset + 33) * Math.PI * 2,
          orbit: 0.25 + seededRng(i + offset + 44) * (bright ? 0.35 : 0.55),
          speed: 0.2 + seededRng(i + offset + 55) * (bright ? 0.9 : 0.55),
          pulse: 1.2 + seededRng(i + offset + 66) * 2.2,
        };
      });

    const slowFlies = mk(92, 0, false);
    const brightFlies = mk(32, 500, true);
    const toGeo = (flies) => {
      const pos = new Float32Array(flies.length * 3);
      flies.forEach((f, i) => {
        pos[i * 3] = f.x;
        pos[i * 3 + 1] = f.y;
        pos[i * 3 + 2] = f.z;
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      return geo;
    };
    return {
      slowFlies,
      brightFlies,
      slowGeo: toGeo(slowFlies),
      brightGeo: toGeo(brightFlies),
    };
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const animate = (geo, flies, sizeBase) => {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < flies.length; i += 1) {
        const f = flies[i];
        let x = f.x + Math.sin(t * f.speed + f.phase) * f.orbit;
        let z = f.z + Math.cos(t * f.speed * 0.85 + f.phase * 1.3) * f.orbit * 0.7;
        let y = f.y + Math.sin(t * f.speed * 1.1 + f.phase) * 0.15;
        if (lanternOn) {
          const dx = LANTERN_WORLD.x - x;
          const dz = LANTERN_WORLD.z - z;
          const dist = Math.hypot(dx, dz);
          if (dist < 10 && dist > 0.01) {
            x += (dx / dist) * d * 0.35;
            z += (dz / dist) * d * 0.35;
          }
        }
        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
      }
      geo.attributes.position.needsUpdate = true;
    };
    animate(slowGeo, slowFlies, 0.24);
    animate(brightGeo, brightFlies, 0.38);
    const pulse = 0.65 + 0.35 * Math.sin(t * 2.1);
    if (brightRef.current) {
      brightRef.current.material.opacity = (lanternOn ? 0.95 : 0.82) * pulse;
      brightRef.current.material.size = 0.42 + pulse * 0.12;
    }
    if (slowRef.current) {
      slowRef.current.material.opacity = lanternOn ? 0.7 : 0.55;
      slowRef.current.material.color.set(lanternOn ? "#FFE090" : "#FFE8A0");
    }
  });

  const matProps = {
    map: tex,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    fog: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  };

  return (
    <>
      <points ref={slowRef} geometry={slowGeo} frustumCulled={false}>
        <pointsMaterial {...matProps} color="#FFE8A0" size={0.26} opacity={0.58} />
      </points>
      <points ref={brightRef} geometry={brightGeo} frustumCulled={false}>
        <pointsMaterial {...matProps} color="#FFF0B0" size={0.44} opacity={0.85} />
      </points>
    </>
  );
}

// ─── Spring: layered pollen ─────────────────────────────────────────────────

export function SpringPollen({ windStrength = 0.5 }) {
  const backRef = useRef();
  const fillRef = useRef();
  const flowerRef = useRef();
  const tex = useMemo(() => makeMoteTexture(), []);
  const flowers = useMemo(() => springFlowerSites(36), []);
  const [sx, , sz] = SUN_POSITION;
  const sunDir = useMemo(() => new THREE.Vector3(sx, 0, sz).normalize(), [sx, sz]);

  const { backGeo, fillGeo, flowerGeo, backData, fillData, flowerData } = useMemo(() => {
    const mk = (n, spread, yBase) => {
      const pos = new Float32Array(n * 3);
      const vel = [];
      for (let i = 0; i < n; i += 1) {
        pos[i * 3] = (seededRng(i + spread) - 0.5) * 44;
        pos[i * 3 + 1] = yBase + seededRng(i + spread + 1) * 8;
        pos[i * 3 + 2] = -6 + seededRng(i + spread + 2) * 24;
        vel.push({
          drift: 0.15 + seededRng(i + spread + 3) * 0.35,
          bob: seededRng(i + spread + 4) * Math.PI * 2,
        });
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      return { geo, pos, vel };
    };
    const back = mk(120, 1000, 3);
    const fill = mk(90, 2000, 1.5);
    const fpos = new Float32Array(flowers.length * 3);
    const fvel = flowers.map((site, i) => {
      fpos[i * 3] = site.x + (seededRng(i + 3000) - 0.5) * 2.5;
      fpos[i * 3 + 1] = site.y + seededRng(i + 3001) * 2.2;
      fpos[i * 3 + 2] = site.z + (seededRng(i + 3002) - 0.5) * 2.5;
      return { bob: seededRng(i + 3003) * Math.PI * 2, drift: 0.08 + seededRng(i + 3004) * 0.2 };
    });
    const fgeo = new THREE.BufferGeometry();
    fgeo.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
    return {
      backGeo: back.geo,
      fillGeo: fill.geo,
      flowerGeo: fgeo,
      backData: back,
      fillData: fill,
      flowerData: { pos: fpos, vel: fvel },
    };
  }, [flowers]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const wind = (0.25 + windStrength * 0.5) * d;
    const animate = (geo, data, sunBias = 0) => {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < data.vel.length; i += 1) {
        const v = data.vel[i];
        arr[i * 3] += wind + Math.sin(t * 0.4 + v.bob) * d * 0.12;
        arr[i * 3 + 1] += Math.sin(t * 0.55 + v.bob) * d * 0.08;
        if (sunBias > 0) {
          arr[i * 3] += sunDir.x * d * sunBias * 0.15;
          arr[i * 3 + 2] += sunDir.z * d * sunBias * 0.1;
        }
        if (arr[i * 3] > 28) arr[i * 3] = -28;
        if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = 0.8;
      }
      geo.attributes.position.needsUpdate = true;
    };
    animate(backGeo, backData, 1);
    animate(fillGeo, fillData, 0.3);
    const farr = flowerGeo.attributes.position.array;
    for (let i = 0; i < flowerData.vel.length; i += 1) {
      const site = flowers[i];
      const v = flowerData.vel[i];
      farr[i * 3] = site.x + Math.sin(t * 0.5 + v.bob) * 1.2 + wind * 2;
      farr[i * 3 + 1] = site.y + 0.5 + Math.sin(t * 0.7 + v.bob) * 0.8;
      farr[i * 3 + 2] = site.z + Math.cos(t * 0.45 + v.bob) * 1.0;
    }
    flowerGeo.attributes.position.needsUpdate = true;
  });

  const mat = (size, opacity, color) => (
    <pointsMaterial
      map={tex}
      color={color}
      size={size}
      sizeAttenuation
      transparent
      opacity={opacity}
      depthWrite={false}
      toneMapped={false}
      fog
      blending={THREE.AdditiveBlending}
    />
  );

  return (
    <>
      <points ref={backRef} geometry={backGeo} frustumCulled={false}>
        {mat(0.32, 0.75, "#FFEAB0")}
      </points>
      <points ref={fillRef} geometry={fillGeo} frustumCulled={false}>
        {mat(0.18, 0.45, "#FFF2C8")}
      </points>
      <points ref={flowerRef} geometry={flowerGeo} frustumCulled={false}>
        {mat(0.24, 0.65, "#FFD878")}
      </points>
    </>
  );
}

// ─── Summer: ground dust ────────────────────────────────────────────────────

export function SummerDust({ windStrength = 0.5 }) {
  const ref = useRef();
  const tex = useMemo(() => makeMoteTexture(), []);

  const { geometry, motes } = useMemo(() => {
    const n = 55;
    const pos = new Float32Array(n * 3);
    const motes = [];
    for (let i = 0; i < n; i += 1) {
      const x = (seededRng(i + 4000) - 0.5) * 40;
      const z = -3 + seededRng(i + 4001) * 16;
      pos[i * 3] = x;
      pos[i * 3 + 1] = terrainHeight(x, z) + 0.2 + seededRng(i + 4002) * 1.2;
      pos[i * 3 + 2] = z;
      motes.push({ phase: seededRng(i + 4003) * Math.PI * 2, drift: 0.05 + seededRng(i + 4004) * 0.12 });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geometry: geo, motes };
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const arr = geometry.attributes.position.array;
    const wind = (0.12 + windStrength * 0.25) * d;
    for (let i = 0; i < motes.length; i += 1) {
      const m = motes[i];
      arr[i * 3] += wind + Math.sin(t * 0.3 + m.phase) * d * 0.06;
      arr[i * 3 + 1] += Math.sin(t * 0.25 + m.phase) * d * 0.04;
      if (arr[i * 3] > 24) arr[i * 3] = -24;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={tex}
        color="#E8D4A8"
        size={0.2}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
        toneMapped={false}
        fog
      />
    </points>
  );
}

/** Subtle heat shimmer above distant hills — effect only, no scenery change. */
export function HeatShimmer() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.material.opacity = 0.035 + Math.sin(t * 1.8) * 0.012;
    ref.current.scale.x = 1 + Math.sin(t * 2.3) * 0.018;
    ref.current.position.y = 2.8 + Math.sin(t * 1.1) * 0.08;
  });

  return (
    <mesh ref={ref} position={[0, 2.8, -22]} rotation={[-Math.PI / 2.2, 0, 0]}>
      <planeGeometry args={[90, 40, 1, 1]} />
      <meshBasicMaterial
        color="#FFE8C0"
        transparent
        opacity={0.04}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}

// ─── Orchestrator ───────────────────────────────────────────────────────────

export function SeasonAtmosphere({
  seasonKey,
  isNight,
  lanternOn,
  windStrength = 0.5,
}) {
  return (
    <>
      {isNight && (
        <>
          <StarField lanternOn={lanternOn} />
          <ShootingStar />
          <GroundFirefliesFixed lanternOn={lanternOn} />
        </>
      )}
      {seasonKey === "spring" && !isNight && <SpringPollen windStrength={windStrength} />}
      {seasonKey === "summer" && !isNight && (
        <>
          <SummerDust windStrength={windStrength} />
          <HeatShimmer />
        </>
      )}
    </>
  );
}
