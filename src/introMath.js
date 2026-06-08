export const INTRO_HOLD_MS = 350;
export const FOOTER_HEIGHT = 56;
export const INTRO_DURATION_MS = 8500;
export const ROPE_PATH_LENGTH = 920;
export const REST_VIEW_Y = -70;
export const CAMERA_START_Y = -240;
export const NAME_TEXT = "Hi, I'm Varna Das.";

/** Intro physics timeline — aligned to arrival_animation_spec §7 */
export const GARMENT_PHASE_START = 0.60;
export const GARMENT_STAGGER_SPAN = 0.30;
export const GARMENT_DROP_DURATION = 0.16;
export const GARMENT_LAND_FRACTION = 0.70;
export const GUST_START = 0.90;
export const GUST_END = 0.98;
export const ROPE_REBOUND_DURATION = 0.085;
export const GARMENT_BOUNCE_AMP = 10;
/** Rotate around cloth center so fall reads vertical, not an arc from the pins */
export const GARMENT_ROT_PIVOT_Y = 42;

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

export const windowProgress = (p, start, end) =>
  end <= start ? (p >= end ? 1 : 0) : clamp((p - start) / (end - start), 0, 1);

export const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ── 1. Clothes fall ──────────────────────────────────────────────

export function garmentStart(i, count = 5) {
  return GARMENT_PHASE_START + (i / count) * GARMENT_STAGGER_SPAN;
}

export function garmentLocal(p, i, count = 5) {
  const start = garmentStart(i, count);
  return windowProgress(p, start, start + GARMENT_DROP_DURATION);
}

export function garmentLandTime(i, count = 5) {
  return garmentStart(i, count) + GARMENT_DROP_DURATION * GARMENT_LAND_FRACTION;
}

/** Drop from above with gravity + small bounce at landing */
export function dropFallOffset(
  local,
  dropHeight = 300,
  landFraction = GARMENT_LAND_FRACTION,
  bounceAmp = GARMENT_BOUNCE_AMP,
) {
  if (local <= 0) return -dropHeight;
  if (local >= 1) return 0;
  if (local <= landFraction) {
    const u = local / landFraction;
    return -dropHeight * (1 - u * u);
  }
  const u = (local - landFraction) / (1 - landFraction);
  return Math.sin(u * Math.PI) * bounceAmp * (1 - u);
}

/** Drop from above with gravity + small bounce at rope */
export function garmentFallOffset(local) {
  return dropFallOffset(local, 300, GARMENT_LAND_FRACTION, GARMENT_BOUNCE_AMP);
}

/** Alternating tumble while falling */
export function garmentRotation(local, index) {
  if (local >= 1) return 0;
  const base = index % 2 === 0 ? 10 : -9;
  return base * (1 - local);
}

/** Middle garment (index 2): extra pendulum overshoot on landing */
export function middlePieceExtraRot(local, index) {
  if (index !== 2 || local <= GARMENT_LAND_FRACTION) return 0;
  const u = (local - GARMENT_LAND_FRACTION) / (1 - GARMENT_LAND_FRACTION);
  return Math.sin(u * 2.5 * Math.PI) * 16 * (1 - u);
}

export function middlePieceSwingY(local, index) {
  if (index !== 2 || local <= GARMENT_LAND_FRACTION) return 0;
  const u = (local - GARMENT_LAND_FRACTION) / (1 - GARMENT_LAND_FRACTION);
  return Math.sin(u * 2.8 * Math.PI) * 14 * (1 - u);
}

/** Brief gust billow after all garments are hung */
export function gustRotation(p, i, local) {
  const gustP = windowProgress(p, GUST_START, GUST_END);
  if (gustP <= 0 || local < 1) return 0;
  return Math.sin(gustP * Math.PI) * (4 + (i % 3) * 1.5);
}

export function gustBillowY(p, i, local) {
  const gustP = windowProgress(p, GUST_START, GUST_END);
  if (gustP <= 0 || local < 1) return 0;
  return Math.sin(gustP * Math.PI + i * 0.4) * (3 + (i % 2) * 2);
}

/** Clothespins: hidden until land, elastic pop */
export function pinScale(p, i, count = 5) {
  const landAt = garmentLandTime(i, count);
  const pop = windowProgress(p, landAt, landAt + 0.045);
  if (pop <= 0) return 0;
  const t = clamp(pop, 0, 1);
  return 1 + 0.32 * Math.sin(t * Math.PI);
}

// ── 2. Rope rebound ──────────────────────────────────────────────

export function ropeSagBonus(p, i, count = 5) {
  const landTime = garmentLandTime(i, count);
  const phase = windowProgress(p, landTime, landTime + ROPE_REBOUND_DURATION);
  if (phase <= 0 || phase >= 1) return 0;
  return Math.sin(phase * 2.5 * Math.PI) * 42 * Math.pow(1 - phase, 1.3);
}

export function totalRopeSag(p, count = 5) {
  let sum = 0;
  for (let i = 0; i < count; i += 1) sum += ropeSagBonus(p, i, count);
  return sum;
}

/** Bézier control point — sag sums on Y, landing pulls X toward weight */
export function ropeBezierControl(p, count, hangXs, ropeDrawn) {
  const baseX = 520;
  const baseY = 196;
  if (!ropeDrawn) return { cx: baseX, cy: baseY };

  const sagY = totalRopeSag(p, count);
  let xPull = 0;
  let xWeight = 0;
  for (let i = 0; i < count; i += 1) {
    const bonus = ropeSagBonus(p, i, count);
    if (bonus > 0.5 && hangXs[i] != null) {
      xPull += (hangXs[i] - baseX) * bonus;
      xWeight += bonus;
    }
  }
  const cx = xWeight > 0 ? baseX + (xPull / xWeight) * 0.38 : baseX;
  return { cx, cy: baseY + sagY };
}

// ── 3. Basket fall (exact spec) ────────────────────────────────────

export const BASKET_PHASE_START = 0.88;
export const BASKET_PHASE_END = 1.0;
export const BASKET_PHASE_SPAN = BASKET_PHASE_END - BASKET_PHASE_START;
export const BASKET_GRAVITY_END = 0.72;
export const BASKET_DROP = -620;
export const BASKET_SETTLE_AMP = 14;
export const BASKET_TILT_MAX = 8;
export const BASKET_CENTER_X = 180;
export const BASKET_CENTER_Y = 528;
export const BASKET_GROUND_Y = 556;

export function basketLocal(p) {
  return windowProgress(p, BASKET_PHASE_START, BASKET_PHASE_END);
}

/** bl = local basket progress 0→1 across the fall span */
export function basketMotion(bl) {
  const rot = (1 - bl) * BASKET_TILT_MAX;
  if (bl <= 0) {
    return { y: BASKET_DROP, rot, visible: false };
  }

  let y;
  if (bl < BASKET_GRAVITY_END) {
    const u = bl / BASKET_GRAVITY_END;
    y = BASKET_DROP * (1 - u * u);
  } else {
    const u = (bl - BASKET_GRAVITY_END) / (1 - BASKET_GRAVITY_END);
    y = Math.sin(u * Math.PI * 1.5) * BASKET_SETTLE_AMP * (1 - u);
  }

  return { y, rot, visible: true };
}

// ── 4. Dust cloud (exact spec) ─────────────────────────────────────

export const BASKET_IMPACT_PROGRESS = BASKET_PHASE_START + BASKET_PHASE_SPAN * BASKET_GRAVITY_END;
export const BASKET_DUST_RAMP = 0.04;
export const BASKET_DUST_COLOR = "#EADBC2";
export const BASKET_DUST_OFFSETS = [-40, -20, 0, 22, 44, 64];

/** 0→1 ramp starting exactly at gravity-phase impact */
export function basketLandProgress(p) {
  return clamp((p - BASKET_IMPACT_PROGRESS) / BASKET_DUST_RAMP, 0, 1);
}

export function basketDustVisible(p) {
  const basketLand = basketLandProgress(p);
  return basketLand > 0.02 && basketLand < 0.99;
}

export function basketDustGroupOpacity(basketLand) {
  return Math.sin(basketLand * Math.PI) * 0.55;
}

/** One of six pale ellipses at the basket base */
export function basketDustPuff(basketLand, di) {
  const dx = BASKET_DUST_OFFSETS[di];
  const rise = basketLand * (10 + di * 3);
  const spread = basketLand * (10 + di * 6) * (dx < 0 ? -1 : 1);
  return {
    cx: BASKET_CENTER_X + dx + spread * 0.5,
    cy: BASKET_GROUND_Y - rise,
    rx: 10 + basketLand * 16,
    ry: 6 + basketLand * 9,
    opacity: (1 - basketLand) * 0.7,
  };
}

// ── 5. Perched bird arrival — launches at basket impact ────────────

export const BIRD_ARRIVAL_START = BASKET_IMPACT_PROGRESS;
export const BIRD_FLY_TO_LEFT_MS = 1800;
/** Begin mid-swoop so the bird is visible the instant the basket lands */
export const BIRD_INTRO_ANIMATION_DELAY_MS = -450;
export const BIRD_INTRO_FLIGHT_WALL_MS = BIRD_FLY_TO_LEFT_MS + BIRD_INTRO_ANIMATION_DELAY_MS;
export const BIRD_PERCH_X = 70;
export const BIRD_PERCH_Y = 122;

export function basketHasImpacted(p) {
  return p >= BASKET_IMPACT_PROGRESS;
}

// ── Hero / camera (unchanged) ────────────────────────────────────

export function nameCharProgress(p, index, total) {
  const span = 0.22;
  const startBase = 0;
  const charSpan = (span / total) * 1.55;
  const step = charSpan * 0.55;
  const charStart = startBase + index * step;
  return windowProgress(p, charStart, charStart + charSpan);
}

export function nameCharOffset(local) {
  if (local <= 0) return 60;
  if (local >= 1) return 0;
  if (local <= 0.7) {
    const u = local / 0.7;
    return 60 * (1 - u) * (1 - u);
  }
  const u = (local - 0.7) / 0.3;
  return -Math.sin(u * Math.PI) * 7 * (1 - u);
}

export function computeIntroValues(p, count = 5) {
  const cameraT = easeInOut(windowProgress(p, 0, 0.58));
  const atmosphere = windowProgress(p, 0.48, 0.62) * Math.min(1, cameraT / 0.35);
  const ground = windowProgress(p, 0.32, 0.50) * Math.min(1, cameraT / 0.4);
  const ropeOpacity = windowProgress(p, 0.38, 0.56) * Math.min(1, cameraT / 0.45);
  const ropeDraw = windowProgress(p, 0.38, 0.58);
  const heroOpacity = windowProgress(p, 0, 0.08);
  const descOpacity = windowProgress(p, 0.90, 0.98) * 0.82;
  const toggleOpacity = easeInOut(windowProgress(p, 0.96, 1.0));
  const footerOpacity = easeInOut(windowProgress(p, 0.92, 1.0));
  const basket = basketLocal(p);
  const basketLand = basketLandProgress(p);
  const dustVisible = basketDustVisible(p);
  const dustGroupOpacity = basketDustVisible(p) ? basketDustGroupOpacity(basketLand) : 0;

  return {
    atmosphere,
    cameraT,
    ground,
    ropeOpacity,
    ropeDraw,
    heroOpacity,
    descOpacity,
    toggleOpacity,
    footerOpacity,
    basket,
    basketLand,
    dustVisible,
    dustGroupOpacity,
    sunRiseY: (1 - atmosphere) * 120,
  };
}

/** Standard hang position for piece index on the rope */
export function garmentHangPosition(i, count = 5) {
  const segmentCount = count + 1;
  const spacing = 800 / segmentCount;
  const x = 70 + (i + 1) * spacing;
  const t = (x - 70) / 900;
  const hangOffsets = [5, 4, 0, 9, 2];
  const y = 133 + 44 * (1 - Math.pow(2 * t - 1, 2)) + (hangOffsets[i % hangOffsets.length]);
  return { x, y };
}
