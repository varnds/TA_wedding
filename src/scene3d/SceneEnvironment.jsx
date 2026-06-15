import React, { Suspense } from "react";
import {
  clotheslineEnds,
  clotheslinePoint,
  lineFraction,
  postLayout,
  SUN_POSITION,
} from "./coords";
import { GarmentMesh } from "./GarmentMesh";
import { Terrain } from "./Terrain";
import { AutumnLeaves, AutumnMotes } from "./Atmosphere";
import { GltfClouds } from "./GltfClouds";
import {
  ClotheslinePost,
  Rope,
  WickerBasket,
  SkySun,
  FlyingBirds,
  OrangeBird,
  SpringFlowers,
  PostLantern,
  WireFenceLine,
  GrassTufts,
} from "./Props";

const LEFT_POST = postLayout(70, 470, 130, 0);
const RIGHT_POST = postLayout(970, 470, 130, 0);
const LINE = clotheslineEnds(LEFT_POST, RIGHT_POST);

export function SceneEnvironment({
  palette,
  seasonKey,
  isNight,
  showSun,
  lanternOn,
  onToggleLantern,
  onChimeStrike,
  onChirp,
  pieces,
  hangPositions,
  windStrength,
  hot,
  selectedId,
  onGarmentPointerOver,
  onGarmentPointerOut,
  onGarmentClick,
}) {
  return (
    <group>
      <Terrain palette={palette} />

      {seasonKey !== "night" && (
        <Suspense fallback={null}>
          <GltfClouds show />
        </Suspense>
      )}

      <SkySun palette={palette} position={SUN_POSITION} show={showSun && !isNight} />
      <FlyingBirds show={!isNight} />
      <OrangeBird show={!isNight} onChirp={onChirp} />
      <SpringFlowers palette={palette} show={seasonKey === "spring"} />
      <AutumnLeaves seasonKey={seasonKey} />
      {seasonKey === "autumn" && <AutumnMotes />}

      <WireFenceLine palette={palette} startX={-13} endX={15} z={-7} posts={16} />
      <GrassTufts palette={palette} count={40} />

      <ClotheslinePost
        layout={LEFT_POST}
        palette={palette}
        withChime
        windStrength={windStrength}
        onChimeStrike={onChimeStrike}
      />
      <ClotheslinePost layout={RIGHT_POST} palette={palette} />
      <PostLantern
        palette={palette}
        position={[RIGHT_POST.x, RIGHT_POST.topY - 0.12, RIGHT_POST.z + 0.04]}
        show={isNight}
        lanternOn={lanternOn}
        onToggle={onToggleLantern}
      />

      <Rope palette={palette} L={LINE.L} R={LINE.R} />
      <WickerBasket palette={palette} />

      {pieces.map((piece, i) => {
        if (!piece) return null;
        const anchor = hangPositions[i];
        if (!anchor) return null;
        const t = lineFraction(anchor.x);
        const pos = clotheslinePoint(t, LINE.L, LINE.R);
        const highlighted = hot === piece.id || selectedId === piece.id;
        return (
          <GarmentMesh
            key={piece.id}
            piece={piece}
            index={i}
            position={pos}
            palette={palette}
            windStrength={windStrength}
            highlighted={highlighted}
            onPointerOver={() => onGarmentPointerOver?.(piece.id)}
            onPointerOut={() => onGarmentPointerOut?.(piece.id)}
            onClick={(e) => {
              e.stopPropagation();
              onGarmentClick?.(piece);
            }}
          />
        );
      })}
    </group>
  );
}
