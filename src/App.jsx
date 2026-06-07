import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Trash2,
  X,
  Droplet,
  Award,
  Leaf,
  Snowflake,
  Flower,
  Moon
} from "lucide-react";

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const DISPLAY = "'Fraunces', serif";
const HEADER = "'Suranna', serif";
const BODY = "'Source Sans 3', sans-serif";

const SEASONS = {
  spring: {
    name: "Spring Awakening",
    icon: Flower,
    sky1: "#EDF9F6",
    sky2: "#E3F5F0",
    sky3: "#CBECE3",
    ink: "#1B2E24",
    accent: "#E11D48",
    cloth: "#F8FCFA",
    clothTint: "#FBF3E4",
    soft: "#4D7C59",
    sun: "#FFFDF6",
    hill1: "#C2DED0",
    hill2: "#A8CDBC",
    hill3: "#8CBBA4",
    description: "Sprouting high-fidelity design prototypes, fresh interaction sprints, and accessible visual systems.",
    tagline: "GARDENING TACTILE INTERFACES & ORGANIC MOTIONS"
  },
  summer: {
    name: "Desert Summer",
    icon: Sun,
    sky1: "#FBE9C8",
    sky2: "#F4D29A",
    sky3: "#EBB87E",
    ink: "#3A2A22",
    accent: "#D65B3E",
    cloth: "#FBF4E6",
    clothTint: "#FFFDF7",
    soft: "#9C8366",
    sun: "#FFF7E4",
    hill1: "#DCAE82",
    hill2: "#C69363",
    hill3: "#A67343",
    description: "High-performance platform scaling, robust technical UX frameworks, and cloud-console developer ecosystems.",
    tagline: "ROBUST INFRASTRUCTURE BAKED IN WARM SUNLIGHT"
  },
  autumn: {
    name: "Golden Autumn",
    icon: Leaf,
    sky1: "#FFEDD5",
    sky2: "#FED7AA",
    sky3: "#F97316",
    ink: "#431407",
    accent: "#EA580C",
    cloth: "#FFF7ED",
    clothTint: "#FFFDF6",
    soft: "#C2410C",
    sun: "#FFedd5",
    hill1: "#FDBA74",
    hill2: "#F97316",
    hill3: "#C2410C",
    description: "Thorough UX research synthesis, rich document architecture, and elegant, harvest-ready design strategies.",
    tagline: "HARVESTING MATURE DATA MODEL INFRASTRUCTURES"
  },
  winter: {
    name: "Solstice Winter",
    icon: Snowflake,
    sky1: "#F1F5F9",
    sky2: "#E2E8F0",
    sky3: "#CBD5E1",
    ink: "#0F172A",
    accent: "#2563EB",
    cloth: "#FFFFFF",
    clothTint: "#F4ECD6",
    soft: "#64748B",
    sun: "#E2E8F0",
    hill1: "#DCE4EE",
    hill2: "#ECF2F8",
    hill3: "#FBFDFF",
    description: "Crisp design execution, razor-sharp alignment grids, and bulletproof user testing metrics.",
    tagline: "SYSTEM ARCHITECTURES SCULPTED IN COOL GLASS"
  },
  night: {
    name: "Midnight Studio",
    icon: Moon,
    sky1: "#1B2247",
    sky2: "#232C57",
    sky3: "#2E3866",
    ink: "#E8ECFF",
    accent: "#FBBF24",
    cloth: "#C9D2F0",
    clothTint: "#EDE6CF",
    soft: "#8A93C4",
    sun: "#F5F3E0",
    hill1: "#2A3360",
    hill2: "#222A52",
    hill3: "#1A2044",
    description: "Quiet late-night craft, deep focus, and ideas that glow brightest after dark.",
    tagline: "DESIGNING IN THE QUIET HOURS"
  }
};

const DESIGN_SYSTEMS_INFO = {
  weave: {
    label: "System Architecture & Flow",
    desc: "Structuring complete user maps, technical API schemas, and robust interactive state systems.",
    care: "Refined through detailed heuristic audits and cross-functional engineering alignment."
  },
  dots: {
    label: "Interactive Prototyping",
    desc: "Crafting delightful micro-interactions, spring-loaded motion behaviors, and fully physics-driven interfaces.",
    care: "Engineered with modern CSS, high-frame-rate JS triggers, and cognitive feedback loops."
  },
  stripe: {
    label: "Ecosystem & Platform Design",
    desc: "Architecting developer dashboards, complex layout blocks, and highly reusable design token models.",
    care: "Built with rigorous accessibility considerations and clear design library rules."
  },
  plain: {
    label: "Visual Interface Craft",
    desc: "Meticulous typesetting, high-contrast visual design, custom grids, and polished layout aesthetics.",
    care: "Validated strictly against WCAG AA guidelines with beautiful modern style guidelines."
  }
};

const INITIAL_PIECES = [
  { id: 0, title: "PLAYER SAFETY", note: "Trust & moderation system design", fabric: "weave", hue: "#F6EEDD" },
  { id: 1, title: "ROBLOX MATCHMAKING", note: "Grouping & queue mechanics", fabric: "dots", hue: "#F7E9D6" },
  { id: 2, title: "OPENCLOUD", note: "Developer tools & console platform", fabric: "plain", hue: "#F4D9C2" },
  { id: 3, title: "SERVICES FOR MATHWORKS", note: "Enterprise workspace layouts", fabric: "stripe", hue: "#FBF4E6" },
  { id: 4, title: "ZORRO", note: "Confidential design ecosystem", fabric: "weave", hue: "#FBF4E6" },
];

// Front-hill surface Y for spring poppies — matches the front hill SVG path
function hillSurfaceY(x) {
  const cx = Math.max(-320, Math.min(1360, x));
  const x0 = -320, y0 = 500, cx1 = 150, cy1 = 470, x1 = 450, y1 = 515;
  if (cx <= x1) {
    const t = (cx - x0) / (x1 - x0);
    const mt = 1 - t;
    return mt * mt * y0 + 2 * mt * t * cy1 + t * t * y1;
  }
  const cx2 = 750, cy2 = 560, x2 = 1360, y2 = 495;
  const t = (cx - x1) / (x2 - x1);
  const mt = 1 - t;
  return mt * mt * y1 + 2 * mt * t * cy2 + t * t * y2;
}

// Map screen clicks to SVG user space (preserveAspectRatio="xMidYMax meet")
function clientPointToSvg(svg, clientX, clientY) {
  const vb = svg.viewBox.baseVal;
  const rect = svg.getBoundingClientRect();
  const scale = Math.min(rect.width / vb.width, rect.height / vb.height);
  const renderedW = vb.width * scale;
  const renderedH = vb.height * scale;
  const offsetX = (rect.width - renderedW) / 2;
  const offsetY = rect.height - renderedH;
  return {
    x: vb.x + (clientX - rect.left - offsetX) / scale,
    y: vb.y + (clientY - rect.top - offsetY) / scale,
  };
}

const PRE_PLANTED_POPPIES = [
  { id: 100, x: -80, y: 438 },
  { id: 101, x: 80,  y: 442 },
  { id: 102, x: 300, y: 432 },
  { id: 103, x: 520, y: 436 },
  { id: 104, x: 737, y: 528 },
  { id: 107, x: 708, y: 526 },
  { id: 105, x: 980, y: 474 },
  { id: 106, x: 1130, y: 471 },

  { id: 200, x: -50, y: 470 },
  { id: 201, x: 150, y: 468 },
  { id: 202, x: 380, y: 458 },
  { id: 203, x: 620, y: 476 },
  { id: 204, x: 850, y: 462 },
  { id: 205, x: 1050, y: 471 },
  { id: 206, x: 1150, y: 466 },

  { id: 300, x: -90, y: 508 },
  { id: 301, x: 60,  y: 502 },
  { id: 302, x: 250, y: 492 },
  { id: 303, x: 470, y: 516 },
  { id: 304, x: 690, y: 508 },
  { id: 305, x: 880, y: 499 },
  { id: 306, x: 1020, y: 506 },
  { id: 307, x: 1140, y: 512 }
];

// Extends the same three-row meadow band into the left/right flanks — y anchored to front-hill surface
const FLANK_POPPIES = [
  { id: 402, x: -240, y: 473 },
  { id: 403, x: -250, y: 477 },
  { id: 405, x: -220, y: 510 },

  { id: 501, x: 1280, y: 484 },
  { id: 503, x: 1300, y: 485 },
  { id: 505, x: 1270, y: 510 },
];

const ALL_SPRING_POPPIES = [...PRE_PLANTED_POPPIES, ...FLANK_POPPIES];

const NIGHT_STARS = [...Array(34)].map((_, i) => {
  const h1 = Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
  const h2 = Math.abs(Math.sin(i * 39.346 + 11.135) * 43758.5453) % 1;
  const h3 = Math.abs(Math.sin(i * 73.156 + 52.235) * 43758.5453) % 1;
  return {
    sx: -90 + h1 * 1040,
    sy: -55 + h2 * 270,
    r: 0.5 + h3 * 1.8
  };
});

export default function App() {
  const svgRef = useRef(null);
  const [pieces, setPieces] = useState(INITIAL_PIECES);
  const [hot, setHot] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [windStrength, setWindStrength] = useState(3.0);
  const [currentSeasonKey, setCurrentSeasonKey] = useState("summer");

  const [birdPosition, setBirdPosition] = useState("left");
  const [isBirdFlying, setIsBirdFlying] = useState(false);
  const [birdGone, setBirdGone] = useState(false);
  const [birdChirp, setBirdChirp] = useState(false);
  const [chimeContact, setChimeContact] = useState(false);
  const [shiver, setShiver] = useState(false);
  const [lanternOn, setLanternOn] = useState(false);
  const [lanternIgniting, setLanternIgniting] = useState(false);
  const lanternIgniteTimerRef = useRef(null);
  const [meteor, setMeteor] = useState(null);

  const [bloomedFlowers, setBloomedFlowers] = useState(ALL_SPRING_POPPIES);
  const [rustledLeaves, setRustledLeaves] = useState([]);
  const [snowSplashes, setSnowSplashes] = useState([]);
  const [shimmerSparks, setShimmerSparks] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("NEW CASE STUDY");
  const [newType, setNewType] = useState("SHIRT");
  const [newFabric, setNewFabric] = useState("stripe");
  const [newHue, setNewHue] = useState("#EFE6D2");
  const [newNote, setNewNote] = useState("Interactive UI case study");
  const [addError, setAddError] = useState("");

  const P = SEASONS[currentSeasonKey];
  const isWinter = currentSeasonKey === "winter";
  const isNight = currentSeasonKey === "night";
  const sel = pieces.find((p) => p.id === hot) || pieces.find((p) => p.id === selectedId);

  const birdStartleRef = useRef(() => {});
  const recallBirdRef = useRef(() => {});
  const birdGoneRef = useRef(false);
  const [viewportWidth, setViewportWidth] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth : 1200)
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (lanternIgniteTimerRef.current) {
      clearTimeout(lanternIgniteTimerRef.current);
      lanternIgniteTimerRef.current = null;
    }
    if (!lanternOn) {
      setLanternIgniting(false);
      return;
    }
    setLanternIgniting(true);
    lanternIgniteTimerRef.current = setTimeout(() => {
      setLanternIgniting(false);
      lanternIgniteTimerRef.current = null;
    }, 180);
    return () => {
      if (lanternIgniteTimerRef.current) {
        clearTimeout(lanternIgniteTimerRef.current);
        lanternIgniteTimerRef.current = null;
      }
    };
  }, [lanternOn]);

  // Narrower viewBox on smaller screens keeps the clothesline from shrinking too much
  const sceneViewBox = (() => {
    if (viewportWidth < 480) return "-60 -70 1080 700";
    if (viewportWidth < 768) return "-140 -70 1280 700";
    if (viewportWidth < 1200) return "-220 -70 1480 700";
    return "-310 -70 1660 700";
  })();

  const [sceneMinX, , sceneWidth] = sceneViewBox.split(/\s+/).map(Number);
  const sceneMaxX = sceneMinX + sceneWidth;
  const poppyInset = 12; // petal radius — keep blooms fully inside the visible viewBox

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Suranna&family=Source+Sans+3:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);

    const welcomeFlightTimer = setTimeout(() => {
      birdStartleRef.current();
    }, 1500);

    const recurringFlight = setInterval(() => {
      if (birdGoneRef.current) {
        recallBirdRef.current();
      } else {
        birdStartleRef.current();
      }
    }, 9000);

    return () => {
      document.head.removeChild(l);
      clearTimeout(welcomeFlightTimer);
      clearInterval(recurringFlight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Shooting stars only in the night theme
  useEffect(() => {
    if (currentSeasonKey !== "night") {
      setMeteor(null);
      return;
    }

    let timer;
    const launch = () => {
      const startX = 100 + Math.random() * 700;
      const startY = 20 + Math.random() * 180;
      const len = 120 + Math.random() * 120;
      const dropX = 180 + Math.random() * 160;
      const dropY = 120 + Math.random() * 120;
      setMeteor({ id: Date.now(), startX, startY, len, dropX, dropY });
      setTimeout(() => setMeteor(null), 1400);
      timer = setTimeout(launch, 6000 + Math.random() * 9000);
    };
    timer = setTimeout(launch, 3000 + Math.random() * 4000);
    return () => clearTimeout(timer);
  }, [currentSeasonKey]);

  const resetToDefault = () => {
    setPieces(INITIAL_PIECES);
    setWindStrength(3.0);
    setCurrentSeasonKey("summer");
    setSelectedId(null);
    setHot(null);
    setAddError("");
    setBirdPosition("left");
    setIsBirdFlying(false);
    setBirdGone(false);
    setBloomedFlowers(ALL_SPRING_POPPIES);
    setRustledLeaves([]);
    setSnowSplashes([]);
    setShimmerSparks([]);
  };

  const triggerBirdStartle = () => {
    if (isBirdFlying || birdGone || birdPosition.startsWith("flying")) return;

    setIsBirdFlying(true);
    setBirdChirp(true);
    setTimeout(() => setBirdChirp(false), 1500);

    const startPos = birdPosition;
    const nextPos = startPos === "left" ? "right" : "left";
    const flightDirection = startPos === "left" ? "flying-to-right" : "flying-to-left";

    setBirdPosition(flightDirection);

    setTimeout(() => {
      setBirdPosition(nextPos);
      setIsBirdFlying(false);
    }, 1800);
  };

  birdStartleRef.current = triggerBirdStartle;

  const shooBird = () => {
    if (birdGone || birdPosition.startsWith("flying")) return;
    playChirpSound();
    setBirdChirp(true);
    setTimeout(() => setBirdChirp(false), 1200);
    const flightDirection = birdPosition === "left" ? "flying-away-right" : "flying-away-left";
    setIsBirdFlying(true);
    setBirdPosition(flightDirection);
    setTimeout(() => {
      setBirdGone(true);
      setIsBirdFlying(false);
      setBirdPosition("left");
    }, 1000);
  };

  const recallBird = () => {
    if (!birdGone || isBirdFlying || isNight) return;
    setBirdGone(false);
    setBirdPosition("flying-to-left");
    setIsBirdFlying(true);
    setTimeout(() => {
      setBirdPosition("left");
      setIsBirdFlying(false);
    }, 1800);
  };

  birdGoneRef.current = birdGone;
  recallBirdRef.current = recallBird;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "o" || e.key === "O") {
        recallBirdRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const audioCtxRef = useRef(null);
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  // Windchime: warm metallic bell tones with inharmonic partials and long shimmer
  const playChimeSound = () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const master = ctx.createGain();
    master.gain.value = 0.4;
    master.connect(ctx.destination);
    const pitches = [1046.5, 1244.5, 1567.98, 1864.66, 2093];
    const order = pitches
      .map((p) => ({ p, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .slice(0, 4)
      .map((o) => o.p);
    order.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.2 + Math.random() * 0.04;
      const partials = [
        { mult: 1, gain: 0.14, decay: 3.4 },
        { mult: 2.76, gain: 0.05, decay: 2.2 },
        { mult: 5.4, gain: 0.025, decay: 1.2 }
      ];
      partials.forEach((pt) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * pt.mult;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(pt.gain, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0006, t + pt.decay);
        osc.connect(g).connect(master);
        osc.start(t);
        osc.stop(t + pt.decay + 0.1);
      });
    });
  };

  const playLampSound = (turningOn) => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const master = ctx.createGain();
    const panner = ctx.createStereoPanner();
    master.gain.value = 0.26;
    panner.pan.value = 0.22;
    master.connect(panner);
    panner.connect(ctx.destination);

    const neonHum = (startT, stopT) => {
      const buzz = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const whine = ctx.createOscillator();
      const bpf = ctx.createBiquadFilter();
      const whineGain = ctx.createGain();
      const g = ctx.createGain();
      buzz.type = "triangle";
      overtone.type = "sine";
      whine.type = "sine";
      buzz.frequency.value = 120;
      overtone.frequency.value = 180;
      whine.frequency.value = 3400;
      bpf.type = "bandpass";
      bpf.frequency.value = 420;
      bpf.Q.value = 0.85;
      buzz.connect(bpf);
      overtone.connect(bpf);
      bpf.connect(g);
      whineGain.gain.value = 0.055;
      whine.connect(whineGain).connect(g);
      g.connect(master);
      buzz.start(startT);
      overtone.start(startT);
      whine.start(startT);
      buzz.stop(stopT);
      overtone.stop(stopT);
      whine.stop(stopT);
      return g;
    };

    const neonStrike = (startT, fromHz, toHz, peak, duration) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(fromHz, startT);
      osc.frequency.exponentialRampToValueAtTime(toHz, startT + duration * 0.75);
      osc.frequency.linearRampToValueAtTime(toHz * 0.92, startT + duration);
      g.gain.setValueAtTime(0, startT);
      g.gain.linearRampToValueAtTime(peak, startT + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, startT + duration);
      osc.connect(g).connect(master);
      osc.start(startT);
      osc.stop(startT + duration + 0.03);
    };

    const neonCrackle = (startT, vol) => {
      const len = Math.floor(ctx.sampleRate * 0.016);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bpf = ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = 1800 + Math.random() * 600;
      bpf.Q.value = 2.2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, startT);
      g.gain.linearRampToValueAtTime(vol, startT + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, startT + 0.014);
      src.connect(bpf).connect(g).connect(master);
      src.start(startT);
      src.stop(startT + 0.02);
    };

    const flickerPattern = (gainNode, startT, peaks, tailStart) => {
      gainNode.gain.setValueAtTime(0, startT);
      peaks.forEach(({ at, level }) => gainNode.gain.setValueAtTime(level, startT + at));
      gainNode.gain.setValueAtTime(peaks[peaks.length - 1].level, startT + tailStart);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startT + tailStart + 0.22);
    };

    if (turningOn) {
      neonStrike(t, 320, 2900, 0.045, 0.2);
      const humGain = neonHum(t, t + 0.42);
      flickerPattern(humGain, t, [
        { at: 0.01, level: 0.11 },
        { at: 0.03, level: 0.02 },
        { at: 0.05, level: 0.13 },
        { at: 0.07, level: 0.025 },
        { at: 0.09, level: 0.12 },
        { at: 0.11, level: 0.03 },
        { at: 0.13, level: 0.14 },
        { at: 0.16, level: 0.08 },
        { at: 0.18, level: 0.15 },
      ], 0.18);
      [0.01, 0.05, 0.09, 0.13].forEach((at) => neonCrackle(t + at, 0.012 + Math.random() * 0.006));
    } else {
      neonStrike(t, 2600, 380, 0.03, 0.16);
      const humGain = neonHum(t, t + 0.28);
      flickerPattern(humGain, t, [
        { at: 0, level: 0.14 },
        { at: 0.03, level: 0.04 },
        { at: 0.06, level: 0.09 },
        { at: 0.09, level: 0.02 },
        { at: 0.12, level: 0.05 },
      ], 0.12);
      [0.03, 0.09].forEach((at) => neonCrackle(t + at, 0.008));
    }
  };

  // Bird chirp: a quick, bright, surprising burst of tight rising blips
  const playChirpSound = () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const master = ctx.createGain();
    master.gain.value = 1.0;
    master.connect(ctx.destination);
    const blips = [0, 0.06, 0.115, 0.16];
    blips.forEach((offset, i) => {
      const t = ctx.currentTime + offset;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      const base = 2600 + i * 180;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 1.7, t + 0.025);
      osc.frequency.exponentialRampToValueAtTime(base * 1.15, t + 0.06);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0006, t + 0.08);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  };

  const handleAddPiece = (e) => {
    e.preventDefault();
    if (pieces.length >= 8) {
      setAddError("The clothesline is full! Remove an existing case study to hang a new concept.");
      return;
    }
    const newId = Date.now();
    const finalTitle = newTitle.toUpperCase().trim() || "NEW PROJECT";
    const finalNote = newNote.trim() || "UX conceptual sprint";

    setPieces([...pieces, {
      id: newId,
      title: finalTitle,
      note: finalNote,
      fabric: newFabric,
      hue: newHue
    }]);
    setIsAdding(false);
    setSelectedId(newId);
    setAddError("");
    triggerBirdStartle();
  };

  const removePiece = (id) => {
    setPieces(pieces.filter(p => p.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (hot === id) setHot(null);
    setAddError("");
    triggerBirdStartle();
  };

  const triggerGustOfWind = () => {
    const prev = windStrength;
    setWindStrength(7.0);
    triggerBirdStartle();
    setChimeContact(true);
    setTimeout(() => setChimeContact(false), 2800);
    setTimeout(() => {
      setWindStrength(prev);
    }, 2800);
  };

  const handleGroundInteraction = (e) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    const { x, y } = clientPointToSvg(svg, e.clientX, e.clientY);

    if (y > 380) {
      const interactionId = Date.now();

      if (currentSeasonKey === "spring") {
        const flowerX = Math.max(-280, Math.min(1320, x));
        const surfaceY = hillSurfaceY(flowerX);
        if (y < surfaceY - 40 || y > 638) return;
        const flowerY = y - (6 + Math.random() * 4);
        const newFlower = { id: interactionId, x: flowerX, y: flowerY };
        setBloomedFlowers(prev => {
          const list = [...prev, newFlower];
          if (list.length > 35) list.shift();
          return list;
        });
      } else if (currentSeasonKey === "autumn") {
        const rustled = Array.from({ length: 4 }).map((_, idx) => ({
          id: `${interactionId}-${idx}`,
          x: x + (Math.random() * 30 - 15),
          y: y - (Math.random() * 10),
          dx: Math.random() * 100 - 50,
          dy: -100 - Math.random() * 100,
          angle: Math.random() * 360
        }));
        setRustledLeaves(prev => [...prev, ...rustled]);
        setTimeout(() => {
          setRustledLeaves(prev => prev.filter(l => !rustled.includes(l)));
        }, 2200);
      } else if (currentSeasonKey === "winter") {
        const splashes = Array.from({ length: 6 }).map((_, idx) => ({
          id: `${interactionId}-${idx}`,
          x,
          y,
          vx: Math.random() * 4 - 2,
          vy: -3 - Math.random() * 4
        }));
        setSnowSplashes(prev => [...prev, ...splashes]);
        setTimeout(() => {
          setSnowSplashes(prev => prev.filter(s => !splashes.includes(s)));
        }, 1500);
      } else if (currentSeasonKey === "summer") {
        const spark = { id: interactionId, x, y };
        setShimmerSparks(prev => [...prev, spark]);
        setTimeout(() => {
          setShimmerSparks(prev => prev.filter(s => s.id !== interactionId));
        }, 1200);
      }
    }
  };

  const nav = ["WORK", "ABOUT", "CREATIVE WORK", "CONTACT"];

  const nightFooterLit = isNight && lanternOn;
  const nightFooterDim = isNight && !lanternOn;
  const titleLit = isNight && lanternOn;
  const titleColor = titleLit ? "#FFF4D6" : P.ink;
  const titleSubColor = titleLit ? "#F0E0B8" : P.ink;
  const titleDescColor = titleLit ? "#E8D4A8" : P.ink;
  const footerBg = isNight ? (lanternOn ? "#F5F0E6" : P.ink) : P.ink;
  const footerText = isNight
    ? (lanternOn ? "#1B2247" : P.cloth)
    : (sel ? "#FFF" : P.cloth);
  const footerNavColor = isNight ? (lanternOn ? "#1B2247" : P.cloth) : P.cloth;

  const renderSeasonalParticles = () => {
    const count = currentSeasonKey === "night" ? 34 : 14;
    return [...Array(count)].map((_, i) => {
      const delay = i * -1.8;
      const duration = 12 / windStrength + (i % 4);
      const style = {
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        transformOrigin: "center"
      };

      if (currentSeasonKey === "spring") {
        return (
          <g key={i} className={`drifting-sakura-container particle-spring-${i}`} style={style}>
            <g className="drifting-sakura">
              <ellipse cx="0" cy="0" rx="5" ry="3" fill="#FDA4AF" opacity="0.85" />
              <path d="M-2 0 Q0 -1 2 0" stroke="#f43f5e" strokeWidth="0.4" fill="none" />
            </g>
          </g>
        );
      }
      if (currentSeasonKey === "summer") {
        return (
          <g key={i} className={`drifting-heat-container particle-summer-${i}`} style={style}>
            <circle cx="0" cy="0" r="1.8" fill="#FDE047" opacity="0.65" />
            <circle cx="0" cy="0" r="0.8" fill="#FFFFFF" opacity="0.95" />
          </g>
        );
      }
      if (currentSeasonKey === "autumn") {
        const colors = ["#F97316", "#EA580C", "#D97706", "#C2410C"];
        const leafColor = colors[i % colors.length];
        return (
          <g key={i} className={`drifting-leaf-container particle-autumn-${i}`} style={style}>
            <g className="tumbling-leaf">
              <path d="M-5 0 C-4 -6, -1 -6, 0 -3 C1 -6, 4 -6, 5 0 C4 4, 1 5, 0 8 C-1 5, -4 4, -5 0 Z" fill={leafColor} opacity="0.9" />
              <line x1="0" y1="-2" x2="0" y2="8" stroke="#78350F" strokeWidth="0.5" />
            </g>
          </g>
        );
      }
      if (currentSeasonKey === "winter") {
        return (
          <g key={i} className={`drifting-snow-container particle-winter-${i}`} style={style}>
            <path d="M-4 0 L4 0 M0 -4 L0 4 M-3 -3 L3 3 M-3 3 L3 -3" stroke="#FFFFFF" strokeWidth="1.6" opacity="1" style={{ filter: "drop-shadow(0 0 1px rgba(100,116,139,0.45))" }} />
          </g>
        );
      }
      if (currentSeasonKey === "night") {
        const { sx, sy, r } = NIGHT_STARS[i];
        return (
          <g key={i} className={`star-twinkle star-${i % 6}`} transform={`translate(${sx}, ${sy})`}>
            <circle cx="0" cy="0" r={r} fill="#F5F3E0" />
          </g>
        );
      }
      return null;
    });
  };

  return (
    <div
      className={shiver ? "winter-shiver" : ""}
      style={{
        position: "fixed",
        inset: 0,
        background: `linear-gradient(to bottom, ${P.sky1} 0%, ${P.sky2} 45%, ${P.sky3} 70%)`,
        overflow: "hidden",
        transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
        color: P.ink
      }}
    >
      {/* WIND PARTICLES & ATMOSPHERIC EFFECTS */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.95 }}>
        <svg style={{ width: "100%", height: "100%" }}>
          {renderSeasonalParticles()}
          {isNight && meteor && (
            <g key={meteor.id} className="meteor"
              style={{ "--dx": `${meteor.dropX}px`, "--dy": `${meteor.dropY}px` }}>
              <line
                x1={meteor.startX} y1={meteor.startY}
                x2={meteor.startX - meteor.len} y2={meteor.startY - meteor.len * 0.6}
                stroke="url(#meteorTrail)" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx={meteor.startX} cy={meteor.startY} r="2.6" fill="#FFFFFF" />
            </g>
          )}
          <defs>
            <linearGradient id="meteorTrail" x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Night dimming veil — lifts when the lantern is lit */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
        background: "#0A0E25",
        opacity: isNight && !lanternOn ? 0.5 : 0,
        transition: "opacity 0.45s ease"
      }} />
      {/* Frosty chill vignette — flashes in during the winter shiver */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        background: "radial-gradient(130% 110% at 50% 50%, transparent 50%, rgba(186,214,240,0.4) 82%, rgba(147,190,234,0.6) 100%)",
        opacity: shiver ? 1 : 0,
        transition: "opacity 0.5s ease"
      }} />

      <div style={{ position: "absolute", inset: 0 }}>
        {/* PRIMARY INTERACTIVE PLAYGROUND */}
        <div style={{ position: "absolute", inset: 0, bottom: 56, display: "flex", flexDirection: "column" }}>

          <svg
            ref={svgRef}
            viewBox={sceneViewBox}
            preserveAspectRatio="xMidYMax meet"
            style={{ width: "100%", height: "100%", display: "block", minHeight: viewportWidth < 768 ? 380 : undefined }}
            onClick={handleGroundInteraction}
          >
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={P.sky1} />
                <stop offset="55%" stopColor={P.sky2} />
                <stop offset="100%" stopColor={P.sky3} />
              </linearGradient>
              <radialGradient id="sun" cx="78%" cy="22%" r="40%">
                <stop offset="0%" stopColor={P.sun} stopOpacity="0.4" />
                <stop offset="35%" stopColor={P.sky2} stopOpacity="0.18" />
                <stop offset="100%" stopColor={P.sky2} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sunDisk" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={P.sun} stopOpacity="1" />
                <stop offset="62%" stopColor={P.sun} stopOpacity="0.92" />
                <stop offset="82%" stopColor={P.sun} stopOpacity="0.28" />
                <stop offset="100%" stopColor={P.sun} stopOpacity="0" />
              </radialGradient>
              <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor={P.ink} floodOpacity="0.12" />
              </filter>
              <radialGradient id="lanternLight" cx="50%" cy="48%" r="50%">
                <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.85" />
                <stop offset="22%" stopColor="#FFE9A8" stopOpacity="0.4" />
                <stop offset="48%" stopColor="#FCD34D" stopOpacity="0.18" />
                <stop offset="72%" stopColor="#FBBF24" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>
              <filter id="lanternSoft" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
              <filter id="lanternCastBlur" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="32" />
              </filter>
              <radialGradient id="lanternCast" gradientUnits="userSpaceOnUse" cx="970" cy="98" r="660">
                <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.4" />
                <stop offset="28%" stopColor="#FFE9A8" stopOpacity="0.2" />
                <stop offset="55%" stopColor="#FCD34D" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>
              <filter id="moonGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
              <filter id="moonSoft" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <radialGradient id="moonBloom" cx="34%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#FFF4C9" stopOpacity="0.42" />
                <stop offset="38%" stopColor="#F5E8B8" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#F5E8B8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="moonSurface" cx="28%" cy="30%" r="72%">
                <stop offset="0%" stopColor="#FFFDF3" />
                <stop offset="45%" stopColor="#F7F0D4" />
                <stop offset="100%" stopColor="#CFC6A4" />
              </radialGradient>
              <linearGradient id="moonLimb" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF5" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.35" />
              </linearGradient>
              <mask id="moonCrescent">
                <rect x="-90" y="-90" width="180" height="180" fill="black" />
                <circle cx="0" cy="0" r="56" fill="white" />
                <circle cx="36" cy="-6" r="45" fill="black" />
              </mask>
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
                <feComposite operator="over" in2="SourceGraphic" />
              </filter>

              {/* bandhani — dense rows of small tie-dye dots with light centers */}
              <pattern id="weave" width="11" height="11" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.7" fill={P.accent} opacity="0.5" />
                <circle cx="3" cy="3" r="0.6" fill={P.cloth} opacity="0.95" />
                <circle cx="8.5" cy="8.5" r="1.7" fill={P.accent} opacity="0.5" />
                <circle cx="8.5" cy="8.5" r="0.6" fill={P.cloth} opacity="0.95" />
              </pattern>
              {/* block-print butti — small repeated flower motif */}
              <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
                <g fill={P.accent} opacity="0.5">
                  <circle cx="6" cy="6" r="1.5" />
                  <ellipse cx="6" cy="2.5" rx="1" ry="1.8" />
                  <ellipse cx="6" cy="9.5" rx="1" ry="1.8" />
                  <ellipse cx="2.5" cy="6" rx="1.8" ry="1" />
                  <ellipse cx="9.5" cy="6" rx="1.8" ry="1" />
                  <ellipse cx="3.5" cy="3.5" rx="1.3" ry="1.3" transform="rotate(45 3.5 3.5)" />
                  <ellipse cx="8.5" cy="8.5" rx="1.3" ry="1.3" />
                </g>
                <g fill={P.accent} opacity="0.5">
                  <circle cx="17" cy="17" r="1.5" />
                  <ellipse cx="17" cy="13.5" rx="1" ry="1.8" />
                  <ellipse cx="17" cy="20.5" rx="1" ry="1.8" />
                  <ellipse cx="13.5" cy="17" rx="1.8" ry="1" />
                  <ellipse cx="20.5" cy="17" rx="1.8" ry="1" />
                </g>
              </pattern>
              {/* leheriya — fine diagonal wave stripes */}
              <pattern id="stripe" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="12" stroke={P.accent} strokeWidth="1.4" opacity="0.32" />
                <line x1="6" y1="0" x2="6" y2="12" stroke={P.soft} strokeWidth="1" opacity="0.3" />
              </pattern>

              <pattern id="woven-straw" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="none" />
                <path d="M0 2.5 H10 M0 7.5 H10" stroke="#F1D2B3" strokeWidth="1.2" opacity="0.5" />
                <path d="M2.5 0 V10 M7.5 0 V10" stroke="#E5C19B" strokeWidth="1" opacity="0.45" />
              </pattern>
            </defs>

            {/* Sky is the page-level CSS gradient — no duplicate SVG fill (avoids a visible seam) */}

            {/* Distant glowing sun / moon — painted before clouds so clouds pass in front */}
            <g style={{ transition: "all 1s ease" }}>
              {/* SUN (day): soft halo + feathered disk + solid core */}
              <g style={{ opacity: isNight ? 0 : 1, transition: "opacity 1s ease" }}>
                <circle cx="820" cy="180" r="115" fill="url(#sunDisk)" opacity="0.12" />
                <circle cx="820" cy="125" r="92" fill="url(#sunDisk)" />
                <circle cx="820" cy="125" r="70" fill={P.sun} opacity="0.97" />
              </g>
              {/* MOON (night): tilted crescent with earthshine, golden limb, orbiting starlets */}
              <g
                className="moon-scene"
                transform="translate(820, 125) rotate(-16)"
                style={{ opacity: isNight ? 1 : 0, transition: "opacity 1s ease" }}
              >
                {/* Halo, bloom, sparkles — hidden while the street lantern is lit */}
                <g style={{ opacity: isNight && !lanternOn ? 1 : 0, transition: "opacity 0.45s ease" }}>
                  <ellipse cx="6" cy="-2" rx="112" ry="96" fill="url(#moonBloom)" opacity="0.72" />
                  <circle cx="0" cy="0" r="58" fill="#B8C2EA" opacity="0.06" filter="url(#moonSoft)" />
                  <circle cx="0" cy="0" r="60" fill="#FFF6D6" opacity="0.22" filter="url(#moonGlow)" />
                  <g fill="#FFF9E8">
                    <circle cx="-74" cy="-30" r="2" className="moon-sparkle moon-sparkle-0" />
                    <circle cx="-88" cy="6" r="1.3" className="moon-sparkle moon-sparkle-1" />
                    <circle cx="-64" cy="36" r="1.6" className="moon-sparkle moon-sparkle-2" />
                    <path d="M -96 -14 l2.2 0 l0.7 2.2 l-1.3 -1 l-1.3 1 z" className="moon-sparkle moon-sparkle-3" />
                  </g>
                </g>
                {/* Crescent — dim when lantern on, bright (not scene-lighting) when off */}
                <g
                  style={{
                    opacity: isNight ? (lanternOn ? 0.28 : 1) : 0,
                    filter: isNight && !lanternOn ? "brightness(1.14)" : "none",
                    transition: "opacity 0.45s ease, filter 0.45s ease"
                  }}
                >
                  <circle cx="0" cy="0" r="58" fill="#7B86B8" opacity="0.1" />
                  <g mask="url(#moonCrescent)">
                    <circle cx="0" cy="0" r="56" fill="url(#moonSurface)" />
                    <ellipse cx="-10" cy="10" rx="17" ry="13" fill="#E5DCC0" opacity="0.34" />
                    <ellipse cx="8" cy="-14" rx="11" ry="8" fill="#D9D0B6" opacity="0.28" />
                    <ellipse cx="-18" cy="-8" rx="7" ry="5" fill="#CEC4A8" opacity="0.22" />
                  </g>
                  <path
                    d="M -52 -8 A 56 56 0 1 1 -18 52"
                    fill="none"
                    stroke="url(#moonLimb)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    mask="url(#moonCrescent)"
                  />
                </g>
              </g>
            </g>

            {/* Drifting Clouds — SVG motion keeps them reliably in front of the moon */}
            <g
              fill={isNight ? (lanternOn ? "#5C6688" : "#7A84A8") : "#FFFFFF"}
              opacity={isNight ? (lanternOn ? 0.42 : 0.58) : 0.88}
              style={{ transition: "opacity 0.45s ease, fill 0.45s ease" }}
            >
              <g>
                <animateTransform attributeName="transform" type="translate" from="-300 0" to="1420 0" dur="72s" repeatCount="indefinite" />
                <ellipse cx="0" cy="48" rx="50" ry="17" />
                <ellipse cx="-44" cy="54" rx="34" ry="13" />
                <ellipse cx="42" cy="55" rx="36" ry="12" />
              </g>
              <g>
                <animateTransform attributeName="transform" type="translate" from="-300 0" to="1420 0" dur="72s" begin="-24s" repeatCount="indefinite" />
                <ellipse cx="0" cy="48" rx="46" ry="16" />
                <ellipse cx="-40" cy="54" rx="32" ry="12" />
                <ellipse cx="38" cy="55" rx="34" ry="11" />
              </g>
              <g>
                <animateTransform attributeName="transform" type="translate" from="-300 0" to="1420 0" dur="72s" begin="-48s" repeatCount="indefinite" />
                <ellipse cx="0" cy="48" rx="44" ry="15" />
                <ellipse cx="-38" cy="54" rx="30" ry="11" />
                <ellipse cx="36" cy="55" rx="32" ry="10" />
              </g>
            </g>

            {/* Animated Birds Flock (hidden at night) */}
            <g stroke={P.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" style={{ opacity: isNight ? 0 : 0.6, transition: "opacity 1s ease, stroke 1s ease" }}>
              <g className="flock-a">
                <path d="M0 0 q9 -8 17 0 q8 -8 17 0" />
                <path d="M44 16 q7 -6 13 0 q6 -6 13 0" />
                <path d="M30 -14 q6 -5 11 0 q5 -5 11 0" />
              </g>
            </g>

            {/* LANDSCAPE HILL LAYERS */}
            <g style={{ transition: "all 1s ease" }}>
              <path
                d="M -320 640 L -320 440 Q 250 370, 550 450 T 1360 410 L 1360 640 Z"
                fill={P.hill1}
                style={{ transition: "fill 1s ease" }}
              />

              <path
                d="M -320 640 L -320 480 Q 350 430, 750 480 T 1360 450 L 1360 640 Z"
                fill={P.hill2}
                style={{ transition: "fill 1s ease" }}
              />

              <path
                id="front-hill-base"
                d="M -320 640 L -320 500 Q 150 470, 450 515 T 1360 495 L 1360 640 Z"
                fill={P.hill3}
                style={{ transition: "fill 1s ease", cursor: "pointer" }}
              />

              <g style={{ opacity: isWinter ? 1 : 0, transition: "opacity 1s ease", pointerEvents: "none" }}>
                {/* Soft powdery sheen near each snowy crest for subtle texture */}
                <path
                  fill="#FFFFFF"
                  opacity="0.45"
                  d="M -320 500 Q 150 470, 450 515 T 1360 495 L 1360 512 Q 450 532, 150 487 T -320 517 Z"
                />
              </g>

            </g>

            {/* Clothesline posts */}
            <g stroke={P.ink} strokeWidth="4" fill="none" strokeLinecap="round" style={{ transition: "stroke 1s ease" }}>
              <path d="M70 130 V470" />
              <path d="M970 130 V470" />
              <path d="M40 150 L100 130 M40 130 L100 150" strokeWidth="2.5" />
              <path d="M940 150 L1000 130 M940 130 L1000 150" strokeWidth="2.5" />
            </g>

            <g fill="#FFFFFF" stroke="none" style={{ opacity: isWinter ? 0.95 : 0, transition: "opacity 1s ease", pointerEvents: "none" }}>
              <path d="M 35 145 Q 70 135 105 145 Q 70 148 35 145 Z" />
              <path d="M 935 145 Q 970 135 1005 145 Q 970 148 935 145 Z" />
            </g>

            {/* NIGHT: street-lantern mounted on top of the right pole — click to light the scene */}
            <g
              style={{ opacity: isNight ? 1 : 0, transition: "opacity 1s ease", pointerEvents: isNight ? "auto" : "none", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                if (isNight) {
                  setLanternOn((v) => {
                    playLampSound(!v);
                    return !v;
                  });
                }
              }}
            >
              {/* smooth lantern bloom — single gradient + blur, no hard rings */}
              {lanternOn && (
                <circle
                  className={lanternIgniting ? "lantern-bloom lantern-ignite-flicker" : "lantern-bloom"}
                  cx="970" cy="96" r="110"
                  fill="url(#lanternLight)"
                  filter="url(#lanternSoft)"
                  style={{ pointerEvents: "none" }}
                />
              )}

              <g stroke={P.ink} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" fill={P.soft}>
                {/* base collar sitting on the pole top (pole top ~y130) */}
                <path d="M963 128 h14 l-3 -8 h-8 Z" />
                {/* tapered glass cage (wider top, narrow bottom) */}
                <path d="M958 95 L982 95 L976 120 L964 120 Z"
                  fill={lanternOn ? "#FFE08A" : "#2E3658"}
                  style={{ transition: lanternOn ? "fill 0.4s ease" : "fill 0.1s ease" }} />
                {/* glowing inner pane when lit */}
                <path
                  className={lanternOn && lanternIgniting ? "lantern-ignite-flicker" : undefined}
                  d="M963 97 L977 97 L973 117 L967 117 Z"
                  fill={lanternOn ? "#FFF4C2" : "#222B4A"} stroke="none"
                  style={{ transition: lanternOn ? "fill 0.4s ease" : "fill 0.1s ease" }} />
                {/* corner frame edge */}
                <path d="M970 95 V120" stroke={P.ink} strokeWidth="0.8" opacity="0.5" fill="none" />
                {/* brim above the cage */}
                <path d="M956 95 h28" stroke={P.ink} strokeWidth="2" />
                {/* peaked dome cap + top knob */}
                <path d="M970 80 L982 94 q-12 4 -24 0 Z" />
                <circle cx="970" cy="78" r="2.2" />
              </g>

            </g>

            {/* Dynamic Chime Assembly */}
            <g
              className={`wind-chime-assembly ${chimeContact ? "chime-clang" : ""}`}
              style={{
                cursor: "pointer",
                transformOrigin: "48px 139px",
                animation: `unifiedSway ${6.5 / windStrength}s ease-in-out infinite`
              }}
              onClick={(e) => {
                e.stopPropagation();
                setChimeContact(true);
                playChimeSound();
                setTimeout(() => setChimeContact(false), 1500);
              }}
            >
              <line x1="48" y1="139" x2="48" y2="149" stroke={P.ink} strokeWidth="1.5" />
              <rect x="36" y="149" width="24" height="4" rx="1" fill={P.soft} stroke={P.ink} strokeWidth="1" />

              <rect x="39" y="153" width="3" height="28" rx="1" fill={P.cloth} stroke={P.ink} strokeWidth="1" />
              <rect x="46" y="153" width="3" height="34" rx="1" fill={P.cloth} stroke={P.ink} strokeWidth="1" />
              <rect x="53" y="153" width="3" height="24" rx="1" fill={P.cloth} stroke={P.ink} strokeWidth="1" />

              <circle cx="48" cy="172" r="2.5" fill={P.accent} />
              <line x1="48" y1="172" x2="48" y2="194" stroke={P.ink} strokeWidth="1" />
              <polygon points="45,194 51,194 48,200" fill={P.accent} stroke={P.ink} strokeWidth="1" />

              {chimeContact && (
                <g stroke={P.accent} strokeWidth="1" fill="none" opacity="0.8">
                  <circle cx="48" cy="174" r="15" className="sound-ring" />
                  <circle cx="48" cy="174" r="28" className="sound-ring" style={{ animationDelay: "0.2s" }} />
                </g>
              )}
            </g>

            {/* The line */}
            <path id="line" className="sway-line"
              d="M70 138 Q520 196 970 138"
              stroke={P.ink} strokeWidth="2.5" fill="none" style={{ transition: "stroke 1s ease" }} />

            <g style={{ opacity: isWinter ? 1 : 0, transition: "opacity 0.8s ease", pointerEvents: "none" }}>
                <path
                  className="sway-line"
                  d="M70 137 Q520 195 970 137"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  fill="none"
                  opacity={windStrength > 4.5 ? "0.4" : "0.95"}
                  strokeLinecap="round"
                />
                <g fill="#FFFFFF" opacity="0.9">
                  <polygon points="318,162 322,176 326,162" />
                  <polygon points="497,162 501,176 505,162" />
                  <polygon points="677,162 681,176 685,162" />
                </g>
              </g>

            {/* PORTFOLIO CASE STUDY GARMENTS */}
            {pieces.map((pc, i) => {
              const segmentCount = pieces.length + 1;
              const spacing = 800 / segmentCount;
              const x = 70 + (i + 1) * spacing;

              const t = (x - 70) / 900;
              const hangOffsets = [5, 4, 0, 9, 2];
              const y = 133 + 44 * (1 - Math.pow(2 * t - 1, 2)) + (hangOffsets[i % hangOffsets.length]);
              const isHovered = hot === pc.id;
              const isSelected = selectedId === pc.id;
              const isHighlit = isHovered || isSelected;

              const lampWarmth = isNight && lanternOn ? Math.pow(Math.max(0, Math.min(1, (x - 70) / 900)), 0.82) : 0;
              const windSpeedFactor = windStrength > 0 ? (9 + (i % 3) * 1.4) / windStrength : 1000;
              const animationStyle = {
                animationDuration: `${windSpeedFactor}s`,
                animationDelay: `${i * -0.7}s`,
                transformOrigin: `${x}px ${y}px`,
                cursor: "pointer"
              };

              return (
                <g key={pc.id}
                  className={`piece-wrapper ${isHighlit ? "lift" : ""}`}
                  style={{ animationDelay: `${i * -0.4}s` }}
                  onMouseEnter={() => setHot(pc.id)}
                  onMouseLeave={() => setHot(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(pc.id);
                  }}
                >
                  <g style={{ transition: "all 0.5s ease" }}>
                    <g>
                      <rect x={x - 22} y={y - 8} width="5.2" height="15" rx="2.4" fill="#C68A4E" />
                      <rect x={x - 22} y={y - 8} width="5.2" height="15" rx="2.4" fill="none" stroke="#8A5A2C" strokeWidth="0.6" opacity="0.7" />
                      <line x1={x - 19.4} y1={y - 5} x2={x - 19.4} y2={y + 5} stroke="#8A5A2C" strokeWidth="0.5" opacity="0.5" />
                    </g>
                    <g>
                      <rect x={x + 16.8} y={y - 8} width="5.2" height="15" rx="2.4" fill="#C68A4E" />
                      <rect x={x + 16.8} y={y - 8} width="5.2" height="15" rx="2.4" fill="none" stroke="#8A5A2C" strokeWidth="0.6" opacity="0.7" />
                      <line x1={x + 19.4} y1={y - 5} x2={x + 19.4} y2={y + 5} stroke="#8A5A2C" strokeWidth="0.5" opacity="0.5" />
                    </g>
                  </g>

                  <g style={animationStyle} className="cloth-body">
                    {clothShape(pc, x, y, isHighlit, P, newType, currentSeasonKey, lampWarmth)}
                    {isHighlit && (() => {
                      const labelW = Math.max(104, pc.title.length * 7.2 + 24);
                      const tooltipBg = isNight
                        ? (lanternOn ? P.accent : "#F0C53A")
                        : P.accent;
                      const tooltipText = isNight
                        ? (lanternOn ? "#1B2247" : P.cloth)
                        : P.cloth;
                      return (
                      <g>
                        <rect x={x - labelW / 2} y={y - 42} width={labelW} height="25" rx="5" fill={tooltipBg} stroke="none" style={{ transition: "fill 1.1s ease" }} />
                        <text x={x} y={y - 26} fontSize="9.5" textAnchor="middle" fill={tooltipText} stroke="none" style={{ fontFamily: MONO, fontWeight: 600, letterSpacing: 1.2, transition: "fill 1.1s ease" }}>
                          {pc.title}
                        </text>
                        <path d={`M${x} ${y - 17} v9`} stroke={tooltipBg} strokeWidth="1.8" style={{ transition: "stroke 1.1s ease" }} />
                      </g>
                      );
                    })()}
                  </g>
                </g>
              );
            })}

            {rustledLeaves.map((l) => (
              <g key={l.id} transform={`translate(${l.x}, ${l.y})`} style={{ pointerEvents: "none" }}>
                <g
                  className="sand-ripple"
                  style={{
                    "--dx": `${l.dx}px`,
                    "--dy": `${l.dy}px`,
                    "--rot": `${l.angle}deg`
                  }}
                >
                  <path d="M-6 0 C-5 -7, -2 -7, 0 -3 C1 -7, 4 -7, 6 0 C5 5, 2 6, 0 10 Z" fill="#EA580C" opacity="0.85" />
                  <line x1="0" y1="-2" x2="0" y2="10" stroke="#78350F" strokeWidth="0.5" />
                </g>
              </g>
            ))}

            {snowSplashes.map((s) => (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r="3"
                fill="#FFFFFF"
                className="snow-splash"
                style={{
                  pointerEvents: "none",
                  "--vx": `${s.vx * 30}px`,
                  "--vy": `${s.vy * 30}px`
                }}
              />
            ))}

            {shimmerSparks.map((s) => (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r="1"
                fill="none"
                stroke="#D65B3E"
                strokeWidth="1.5"
                className="heat-shimmer-ring"
                style={{ pointerEvents: "none" }}
              />
            ))}

            {/* Grass blades */}
            <g stroke={P.ink} strokeWidth="2" fill="none" opacity="0.55" strokeLinecap="round" style={{ transition: "stroke 1s ease" }}>
              {[...Array(26)].map((_, i) => {
                const gx = 30 + i * 39;
                return (
                  <path
                    key={i}
                    className="blade"
                    style={{
                      animationDelay: `${(i % 5) * -0.4}s`,
                      animationDuration: `${3 / (windStrength * 0.7 + 0.3)}s`,
                      transformOrigin: `${gx}px 500px`
                    }}
                    d={`M${gx} 500 q6 -22 -2 -40`}
                  />
                );
              })}
            </g>

            {/* Spring poppies — painted above hills & garments so stems stay visible */}
            {currentSeasonKey === "spring" && (
              <g style={{ transition: "all 1s ease", pointerEvents: "none" }}>
                {bloomedFlowers
                  .filter((f) => f.x >= sceneMinX + poppyInset && f.x <= sceneMaxX - poppyInset)
                  .map((f) => (
                  <g key={f.id} transform={`translate(${f.x}, ${f.y})`}>
                    <g className="poppy-bloom">
                      <path d="M0 0 Q3 14 0 25" stroke="#3A6346" strokeWidth="1.6" fill="none" />
                      <circle cx="-5" cy="-3" r="6" fill="#F43F5E" />
                      <circle cx="5" cy="-3" r="6" fill="#F43F5E" />
                      <circle cx="0" cy="5" r="6" fill="#E11D48" />
                      <circle cx="0" cy="-6" r="6" fill="#E11D48" />
                      <circle cx="0" cy="0" r="3.2" fill="#111827" />
                      <circle cx="0" cy="0" r="1.5" fill="#FBBF24" />
                    </g>
                  </g>
                ))}
              </g>
            )}

            {/* Premium Light Straw Wicker Basket */}
            <g filter="url(#soft)" stroke={P.ink} strokeWidth="2.5" fill={P.cloth} strokeLinejoin="round" style={{ transition: "all 0.8s ease" }}>
              <path d="M110 505 Q100 488, 122 490" fill="none" stroke={P.ink} strokeWidth="3" />
              <path d="M250 505 Q260 488, 238 490" fill="none" stroke={P.ink} strokeWidth="3" />

              <path d="M120 500 L240 500 L226 556 L134 556 Z" fill="#FDF3E5" />
              <path d="M120 500 L240 500 L226 556 L134 556 Z" fill="url(#woven-straw)" />

              <path d="M120 500 L240 500" stroke="#FCE9D3" strokeWidth="4.5" />
              <path d="M134 556 L226 556" stroke="#DFBD99" strokeWidth="5.5" />

              <path d="M125 518 Q180 521, 235 518" fill="none" stroke="#F5DBBE" strokeWidth="2.2" />
              <path d="M130 538 Q180 541, 230 538" fill="none" stroke="#F5DBBE" strokeWidth="2.2" />

              <path d="M150 498 q30 -28 60 -2" fill="none" stroke={P.accent} strokeWidth="2.5" />
              <path d="M150 504 q14 -22 30 -6 q16 -18 30 0" fill="none" stroke={P.soft} strokeWidth="1.6" />
            </g>

            {/* Autumn leaves peeking out of the basket, fades with season */}
            <g style={{ opacity: currentSeasonKey === "autumn" ? 1 : 0, transition: "opacity 1s ease", pointerEvents: "none" }}>
              <g stroke="#7C3A12" strokeWidth="0.7" strokeOpacity="0.5">
                <path d="M150 496 q3 -7 7 -1 q3 -7 7 0 q-1 6 -7 7 q-6 -1 -7 -6 Z" fill="#D97706" transform="rotate(-18 156 494)" />
                <path d="M172 492 q3 -7 7 -1 q3 -7 7 0 q-1 6 -7 7 q-6 -1 -7 -6 Z" fill="#EA580C" transform="rotate(8 178 490)" />
                <path d="M196 495 q3 -7 7 -1 q3 -7 7 0 q-1 6 -7 7 q-6 -1 -7 -6 Z" fill="#CA8A04" transform="rotate(22 202 493)" />
                <path d="M216 498 q3 -6 6 -1 q3 -6 6 0 q-1 5 -6 6 q-5 -1 -6 -5 Z" fill="#C2410C" transform="rotate(-10 220 496)" />
              </g>
            </g>

            {/* STARTLED BIRD */}
            <g
              onClick={(e) => {
                e.stopPropagation();
                shooBird();
              }}
              onMouseEnter={() => setBirdChirp(true)}
              onMouseLeave={() => setBirdChirp(false)}
              className={
                birdPosition === "flying-to-right" ? "scared-bird-flight-right" :
                birdPosition === "flying-to-left" ? "scared-bird-flight-left" :
                birdPosition === "flying-away-right" ? "bird-fly-away-right" :
                birdPosition === "flying-away-left" ? "bird-fly-away-left" : ""
              }
              style={{
                cursor: "pointer",
                opacity: birdGone || isNight ? 0 : 1,
                pointerEvents: birdGone || isNight ? "none" : "auto",
                transition: "opacity 1s ease",
                transform: birdPosition === "left" ? "translate(70px, 122px) scale(1, 1)" :
                           birdPosition === "right" ? "translate(970px, 122px) scale(-1, 1)" : undefined,
                transformOrigin: "center"
              }}
            >
              <g transform="translate(-10, -10)">
                <circle cx="10" cy="10" r="7" fill={P.accent} />
                <path d="M3 10 Q10 18 17 10" fill={P.accent} />
                <polygon points="16,8 20,10 16,12" fill="#3A2A22" />
                <path d="M4 11 L1 15 L5 13 Z" fill={P.accent} />
                <circle cx="13" cy="8" r="1.2" fill={P.cloth} />
              </g>

              {birdChirp && !isBirdFlying && (
                <g transform="translate(15, -25)" opacity="0.9">
                  <rect x="-10" y="0" width="44" height="15" rx="4" fill={P.cloth} stroke={P.ink} strokeWidth="1" />
                  <text x="12" y="10" fontSize="8" textAnchor="middle" fill={P.ink} style={{ fontFamily: MONO, fontWeight: 600 }}>
                    ♫ chip
                  </text>
                </g>
              )}
            </g>

            {/* Lantern light cast — soft cone from the lamp onto clothes + ground */}
            <g
              style={{
                opacity: isNight && lanternOn ? 1 : 0,
                mixBlendMode: "screen",
                pointerEvents: "none",
                transition: lanternIgniting ? "none" : "opacity 0.5s ease",
                animation: lanternIgniting ? "lanternIgniteFlicker 0.18s steps(1) forwards" : "none",
              }}
            >
              <ellipse
                className="lantern-cast-layer"
                cx="700" cy="300" rx="580" ry="255"
                fill="url(#lanternCast)"
                filter="url(#lanternCastBlur)"
                transform="rotate(-16 700 300)"
              />
              <ellipse
                className="lantern-cast-layer"
                cx="500" cy="485" rx="400" ry="95"
                fill="url(#lanternCast)"
                filter="url(#lanternCastBlur)"
                opacity="0.72"
                transform="rotate(-10 500 485)"
              />
              <ellipse
                className="lantern-cast-layer"
                cx="210" cy="468" rx="160" ry="52"
                fill="url(#lanternCast)"
                filter="url(#lanternCastBlur)"
                opacity="0.45"
                transform="rotate(-8 210 468)"
              />
              <path
                d="M70 138 Q520 196 970 138"
                stroke="#FFF0C2"
                strokeWidth="5"
                fill="none"
                opacity="0.35"
                strokeLinecap="round"
              />
              <line
                x1="970" y1="128" x2="970" y2="468"
                stroke="#FFE9A8"
                strokeWidth="7"
                opacity="0.18"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Intro Title Typography */}
          <div style={{
            position: "absolute",
            top: "clamp(108px, 12vh, 140px)",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 620,
            width: "90%",
            pointerEvents: "none",
            textAlign: "center",
            zIndex: 5,
            textShadow: titleLit ? "0 0 28px rgba(251,191,36,0.22)" : "none",
            transition: "text-shadow 1.1s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: titleLit ? "#FCD34D" : P.accent, transition: "background 0.5s ease" }} />
              <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 500, letterSpacing: 2.5, textTransform: "uppercase", color: titleSubColor, opacity: 0.8, transition: "color 1.1s ease" }}>
                Product & UX Designer
              </span>
            </div>
            <div style={{ fontFamily: HEADER, fontSize: "4rem", fontWeight: 400, color: titleColor, lineHeight: 1.05, letterSpacing: -0.5, transition: "color 1.1s ease" }}>
              Hi, I'm Varna Das<span style={{ color: titleLit ? "#FCD34D" : P.accent, transition: "color 1.1s ease" }}>.</span><br />
              <span style={{ fontSize: "1.0125rem", fontWeight: 400, fontFamily: BODY, display: "block", marginTop: 4, opacity: 0.82, lineHeight: 1.45, marginLeft: "auto", marginRight: "auto", maxWidth: 450, color: titleDescColor, transition: "color 1.1s ease" }}>
                {P.description}
              </span>
            </div>
          </div>

          {/* Vertical glassy season toggle (icon-only), floating top-right */}
          <div style={{
            position: "absolute",
            top: 24,
            right: 24,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: 6,
            borderRadius: 999,
            background: `${P.cloth}30`,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: `1px solid ${P.cloth}66`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 1px ${P.cloth}b3, inset 0 -1px 1px ${P.ink}0D`,
            zIndex: 12,
            opacity: isNight && !lanternOn ? 0.58 : 1,
            filter: isNight && !lanternOn ? "brightness(0.88) saturate(0.85)" : "none",
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease, filter 0.45s ease"
          }}>
            {Object.keys(SEASONS).map((key) => {
              const SeasonIcon = SEASONS[key].icon;
              const active = currentSeasonKey === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentSeasonKey(key);
                    if (key !== "night") setLanternOn(false);
                    if (key === "night") {
                      setBirdGone(true);
                    } else {
                      setBirdGone(false);
                      triggerBirdStartle();
                    }
                    if (key === "winter") {
                      setShiver(true);
                      setTimeout(() => setShiver(false), 470);
                    }
                  }}
                  title={SEASONS[key].name}
                  aria-label={SEASONS[key].name}
                  style={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: active ? `1px solid ${P.cloth}88` : "1px solid transparent",
                    background: active ? `${P.accent}B3` : "transparent",
                    color: active ? P.cloth : P.ink,
                    boxShadow: active
                      ? `0 2px 8px ${P.accent}33, inset 0 1px 1px ${P.cloth}66`
                      : "none",
                    backdropFilter: active ? "blur(8px)" : "none",
                    WebkitBackdropFilter: active ? "blur(8px)" : "none",
                    transition: "all 0.3s cubic-bezier(0.34, 1.4, 0.64, 1)",
                    transform: active ? "scale(1.02)" : "scale(1)"
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = `${P.cloth}59`; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <SeasonIcon size={16} strokeWidth={1.9} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Project Case Inspector */}
        {selectedId !== null && (
          <div style={{
            position: "absolute",
            top: 24,
            right: isAdding ? 330 : 32,
            bottom: 72,
            width: 320,
            background: P.cloth,
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
            border: `1.5px solid ${P.ink}20`,
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            transition: "all 0.5s ease"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: P.accent }}>CASE INSPECTOR</span>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: P.ink }}
                >
                  <X size={18} />
                </button>
              </div>

              {pieces.find(p => p.id === selectedId) ? (
                (() => {
                  const item = pieces.find(p => p.id === selectedId);
                  const sysInfo = DESIGN_SYSTEMS_INFO[item.fabric] || { label: "Design Artifact", desc: "Interactive UX design framework built at absolute fidelity.", care: "Maintain absolute clarity and layout standards." };
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <h3 style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>{item.title}</h3>
                        <span style={{ fontFamily: MONO, fontSize: 12, opacity: 0.7, display: "block", marginTop: 4 }}>{item.note}</span>
                      </div>

                      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: item.hue,
                          border: `1.5px solid ${P.ink}`,
                          position: "relative",
                          overflow: "hidden"
                        }}>
                          {item.fabric === "dots" && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, #E11D48 15%, transparent 16%)", backgroundSize: "8px 8px" }} />}
                          {item.fabric === "stripe" && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(15,23,42,0.1) 4px, rgba(15,23,42,0.1) 8px)" }} />}
                          {item.fabric === "weave" && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)" }} />}
                        </div>
                        <div>
                          <span style={{ display: "block", fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>{sysInfo.label}</span>
                          <span style={{ display: "block", fontFamily: MONO, fontSize: 10, opacity: 0.6 }}>Pattern: {item.fabric.toUpperCase()}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: `1px solid ${P.ink}15`, paddingTop: 16 }}>
                        <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <Award size={14} style={{ color: P.accent }} /> Design Intent:
                        </span>
                        <p style={{ fontFamily: DISPLAY, fontSize: 13, margin: 0, opacity: 0.8, lineHeight: 1.4 }}>{sysInfo.desc}</p>
                      </div>

                      <div style={{ borderTop: `1px solid ${P.ink}15`, paddingTop: 16 }}>
                        <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <Droplet size={14} className="animate-bounce" /> Care & Iteration:
                        </span>
                        <p style={{ fontFamily: DISPLAY, fontSize: 13, margin: 0, opacity: 0.8, lineHeight: 1.4 }}>{sysInfo.care}</p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p style={{ fontFamily: MONO, fontSize: 12, opacity: 0.6 }}>No case study selected.</p>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => removePiece(selectedId)}
                style={{
                  background: "none",
                  border: `1.5px solid ${P.accent}`,
                  color: P.accent,
                  borderRadius: 10,
                  padding: "10px",
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 0.2s ease"
                }}
              >
                <Trash2 size={13} /> REMOVE ARCHIVE ITEM
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Clothes Creator Menu */}
        {isAdding && (
          <div style={{
            position: "absolute",
            top: 24,
            right: 32,
            bottom: 72,
            width: 320,
            background: P.cloth,
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
            border: `1.5px solid ${P.ink}20`,
            zIndex: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: P.accent }}>DESIGN A NEW CONCEPT</span>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setAddError("");
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: P.ink }}
                >
                  <X size={18} />
                </button>
              </div>

              {addError && (
                <div style={{
                  background: `${P.accent}15`,
                  border: `1px solid ${P.accent}`,
                  color: P.accent,
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontFamily: MONO,
                  fontSize: 10,
                  lineHeight: 1.3,
                  marginBottom: 12
                }}>
                  {addError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Case / Project Title:</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${P.ink}30`,
                      background: P.cloth,
                      color: P.ink,
                      fontFamily: MONO,
                      fontSize: 12,
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Visual Silhouette Style:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${P.ink}30`,
                      background: P.cloth,
                      color: P.ink,
                      fontFamily: MONO,
                      fontSize: 12,
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="SHIRT">Linen Shirt Silhouette</option>
                    <option value="DRESS">Flowing Silhouette Dress</option>
                    <option value="SCARF">Streamlined Scarf</option>
                    <option value="TROUSERS">Wide-Cut Trousers</option>
                    <option value="TEE">Classic Fitted Tee</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Primary Methodology:</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {Object.keys(DESIGN_SYSTEMS_INFO).map((fabricKey) => (
                      <button
                        key={fabricKey}
                        type="button"
                        onClick={() => setNewFabric(fabricKey)}
                        style={{
                          padding: "6px",
                          borderRadius: 8,
                          border: `1.5px solid ${newFabric === fabricKey ? P.accent : P.ink + '20'}`,
                          background: newFabric === fabricKey ? `${P.accent}10` : P.cloth,
                          color: P.ink,
                          fontFamily: MONO,
                          fontSize: 11,
                          cursor: "pointer"
                        }}
                      >
                        {fabricKey === "weave" && "SYSTEM"}
                        {fabricKey === "dots" && "MOTION"}
                        {fabricKey === "stripe" && "PLATFORM"}
                        {fabricKey === "plain" && "VISUAL"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Brand Palette Hue:</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#F6EEDD", "#F7E9D6", "#F4D9C2", "#EFE6D2", "#FFF9F2", "#E0ECF8", "#E6F3E6", "#FAEAEA"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewHue(color)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: color,
                          border: `2px solid ${newHue === color ? P.accent : P.ink + '15'}`,
                          cursor: "pointer",
                          transform: newHue === color ? "scale(1.15)" : "scale(1)",
                          transition: "all 0.2s ease"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Brief Summary Note:</label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${P.ink}30`,
                      background: P.cloth,
                      color: P.ink,
                      fontFamily: MONO,
                      fontSize: 11,
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAddPiece}
              style={{
                width: "100%",
                background: P.accent,
                color: P.cloth,
                border: "none",
                borderRadius: 10,
                padding: "10px",
                fontFamily: MONO,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 12
              }}
            >
              PIN CONVENTIONAL PROTOTYPE
            </button>
          </div>
        )}

        {/* Navigation Footer */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 56,
          boxSizing: "border-box",
          background: footerBg,
          padding: "0 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          zIndex: 20,
          borderTop: `1px solid ${nightFooterDim ? `${P.cloth}30` : nightFooterLit ? `${P.soft}50` : `${P.cloth}10`}`,
          boxShadow: nightFooterLit ? "inset 0 8px 28px rgba(251,191,36,0.18)" : "none",
          opacity: nightFooterDim ? 0.52 : 1,
          filter: nightFooterDim ? "saturate(0.85)" : "none",
          transition: "opacity 1.1s ease, filter 1.1s ease, color 1.1s ease, border-color 1.1s ease, box-shadow 0.5s ease, background 0.5s ease"
        }}>
          <span style={{
            fontFamily: MONO,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 1.5,
            color: footerText,
            minWidth: 260,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            {sel ? (
              <>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: P.accent }} />
                <span>{sel.title} — {sel.note.toUpperCase()}</span>
              </>
            ) : (
              <>
                <span className="pulse-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: nightFooterLit ? P.accent : P.cloth, transition: "background 0.5s ease" }} />
                <span>{P.tagline}</span>
              </>
            )}
          </span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {nav.map((n) => (
              <a key={n} href="#" onClick={(e) => e.preventDefault()}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 2,
                  color: footerNavColor,
                  textDecoration: "none",
                  borderBottom: "2px solid transparent",
                  paddingBottom: 3,
                  cursor: "pointer",
                  transition: "color 0.5s ease, border-color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = P.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
              >{n}</a>
            ))}
          </div>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes unifiedSway {
          0%, 100% { transform: rotate(-5deg); }
          50%      { transform: rotate(5deg); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-4deg) skewX(-2deg); }
          50%      { transform: rotate(4deg)  skewX(3deg); }
        }
        @keyframes flutter {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-4px) rotate(1deg); }
        }
        @keyframes lineSway {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }
        @keyframes blade {
          0%, 100% { transform: rotate(-5deg); }
          50%      { transform: rotate(5deg); }
        }
        @keyframes winterShiver {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-5px); }
          30%  { transform: translateX(5px); }
          45%  { transform: translateX(-4px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
          90%  { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        .winter-shiver { animation: winterShiver 0.09s linear 5; }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        .star-twinkle { animation: starTwinkle 3s ease-in-out infinite; }
        .star-0 { animation-duration: 2.4s; animation-delay: 0s; }
        .star-1 { animation-duration: 3.1s; animation-delay: -0.6s; }
        .star-2 { animation-duration: 2.8s; animation-delay: -1.2s; }
        .star-3 { animation-duration: 3.6s; animation-delay: -1.8s; }
        .star-4 { animation-duration: 2.6s; animation-delay: -2.4s; }
        .star-5 { animation-duration: 3.3s; animation-delay: -0.3s; }
        @keyframes lanternIgniteFlicker {
          0%   { opacity: 0.2; }
          14%  { opacity: 1; }
          28%  { opacity: 0.35; }
          42%  { opacity: 0.95; }
          56%  { opacity: 0.5; }
          70%  { opacity: 0.9; }
          84%  { opacity: 0.65; }
          100% { opacity: 1; }
        }
        .lantern-ignite-flicker {
          animation: lanternIgniteFlicker 0.18s steps(1) forwards;
        }
        @keyframes moonSparkle {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
        .moon-sparkle { animation: moonSparkle 3.2s ease-in-out infinite; }
        .moon-sparkle-0 { animation-delay: 0s; }
        .moon-sparkle-1 { animation-delay: -0.8s; }
        .moon-sparkle-2 { animation-delay: -1.6s; }
        .moon-sparkle-3 { animation-delay: -2.4s; }
        @keyframes flock {
          from { transform: translate(-120px, 40px); }
          to   { transform: translate(1180px, -30px); }
        }
        @keyframes flap {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.65); }
        }
        @keyframes windParticle {
          from { transform: translateX(-200px); opacity: 0.1; }
          50%  { opacity: 0.5; }
          to   { transform: translateX(1200px); opacity: 0.0; }
        }

        @keyframes springPath0 { 0% { transform: translate(50px, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.95; } 100% { transform: translate(500px, 600px) rotate(360deg); opacity: 0; } }
        @keyframes springPath1 { 0% { transform: translate(250px, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.95; } 100% { transform: translate(700px, 600px) rotate(270deg); opacity: 0; } }
        @keyframes springPath2 { 0% { transform: translate(450px, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.95; } 100% { transform: translate(900px, 600px) rotate(540deg); opacity: 0; } }
        @keyframes springPath3 { 0% { transform: translate(650px, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.95; } 100% { transform: translate(1050px, 600px) rotate(180deg); opacity: 0; } }
        @keyframes springPath4 { 0% { transform: translate(850px, -50px) rotate(0deg); opacity: 0; } 10% { opacity: 0.95; } 100% { transform: translate(1150px, 600px) rotate(420deg); opacity: 0; } }

        @keyframes summerPath0 { 0% { transform: translate(100px, -50px) scale(0.8); opacity: 0; } 20% { opacity: 0.7; } 100% { transform: translate(400px, 600px) scale(1.2); opacity: 0; } }
        @keyframes summerPath1 { 0% { transform: translate(350px, -50px) scale(0.8); opacity: 0; } 20% { opacity: 0.7; } 100% { transform: translate(650px, 600px) scale(1.2); opacity: 0; } }
        @keyframes summerPath2 { 0% { transform: translate(600px, -50px) scale(0.8); opacity: 0; } 20% { opacity: 0.7; } 100% { transform: translate(900px, 600px) scale(1.2); opacity: 0; } }
        @keyframes summerPath3 { 0% { transform: translate(800px, -50px) scale(0.8); opacity: 0; } 20% { opacity: 0.7; } 100% { transform: translate(1100px, 600px) scale(1.2); opacity: 0; } }

        @keyframes autumnPath0 { 0% { transform: translate(50px, -50px) rotate(0deg); opacity: 0; } 15% { opacity: 0.95; } 100% { transform: translate(450px, 600px) rotate(720deg); opacity: 0; } }
        @keyframes autumnPath1 { 0% { transform: translate(250px, -50px) rotate(0deg); opacity: 0; } 15% { opacity: 0.95; } 100% { transform: translate(650px, 600px) rotate(540deg); opacity: 0; } }
        @keyframes autumnPath2 { 0% { transform: translate(450px, -50px) rotate(0deg); opacity: 0; } 15% { opacity: 0.95; } 100% { transform: translate(850px, 600px) rotate(900deg); opacity: 0; } }
        @keyframes autumnPath3 { 0% { transform: translate(650px, -50px) rotate(0deg); opacity: 0; } 15% { opacity: 0.95; } 100% { transform: translate(1050px, 600px) rotate(360deg); opacity: 0; } }
        @keyframes autumnPath4 { 0% { transform: translate(850px, -50px) rotate(0deg); opacity: 0; } 15% { opacity: 0.95; } 100% { transform: translate(1150px, 600px) rotate(640deg); opacity: 0; } }

        @keyframes winterPath0 { 0% { transform: translate(100px, -50px); opacity: 1; } 92% { opacity: 1; } 100% { transform: translate(300px, 600px); opacity: 0; } }
        @keyframes winterPath1 { 0% { transform: translate(300px, -50px); opacity: 1; } 92% { opacity: 1; } 100% { transform: translate(500px, 600px); opacity: 0; } }
        @keyframes winterPath2 { 0% { transform: translate(500px, -50px); opacity: 1; } 92% { opacity: 1; } 100% { transform: translate(700px, 600px); opacity: 0; } }
        @keyframes winterPath3 { 0% { transform: translate(700px, -50px); opacity: 1; } 92% { opacity: 1; } 100% { transform: translate(900px, 600px); opacity: 0; } }
        @keyframes winterPath4 { 0% { transform: translate(900px, -50px); opacity: 1; } 92% { opacity: 1; } 100% { transform: translate(1100px, 600px); opacity: 0; } }

        @keyframes birdFlyToRight {
          0%   { transform: translate(70px, 122px) scale(1, 1); }
          15%  { transform: translate(200px, -55px) scale(1, 1); }
          35%  { transform: translate(380px, 90px) scale(1, 1); }
          55%  { transform: translate(560px, -60px) scale(1, 1); }
          75%  { transform: translate(750px, 70px) scale(1, 1); }
          90%  { transform: translate(880px, -45px) scale(-1, 1); }
          100% { transform: translate(970px, 122px) scale(-1, 1); }
        }

        @keyframes birdFlyToLeft {
          0%   { transform: translate(970px, 122px) scale(-1, 1); }
          15%  { transform: translate(840px, -55px) scale(-1, 1); }
          35%  { transform: translate(660px, 90px) scale(-1, 1); }
          55%  { transform: translate(480px, -60px) scale(-1, 1); }
          75%  { transform: translate(290px, 70px) scale(-1, 1); }
          90%  { transform: translate(160px, -45px) scale(1, 1); }
          100% { transform: translate(70px, 122px) scale(1, 1); }
        }

        @keyframes birdFlyAwayRight {
          0%   { transform: translate(70px, 122px) scale(1, 1); opacity: 1; }
          45%  { transform: translate(580px, -115px) scale(1, 1); opacity: 1; }
          100% { transform: translate(1360px, -75px) scale(1, 1); opacity: 0; }
        }

        @keyframes birdFlyAwayLeft {
          0%   { transform: translate(970px, 122px) scale(-1, 1); opacity: 1; }
          45%  { transform: translate(460px, -115px) scale(-1, 1); opacity: 1; }
          100% { transform: translate(-160px, -75px) scale(-1, 1); opacity: 0; }
        }

        @keyframes soundExpand {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes popIn {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes leafRustle {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes snowSplashAnim {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(var(--vx), var(--vy)); opacity: 0; }
        }
        @keyframes shimmerHeat {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        .pulse-dot {
          animation: pulse 2s infinite ease-in-out;
        }
        .flock-a { animation: flock 28s linear infinite; }
        .flock-a path { animation: flap 0.85s ease-in-out infinite; transform-origin: center; }

        @keyframes meteorFly {
          0%   { transform: translate(0, 0); opacity: 0; }
          12%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }
        .meteor { animation: meteorFly 1.3s ease-in forwards; }

        .drifting-sakura-container.particle-spring-0 { animation: springPath0 11s linear infinite; }
        .drifting-sakura-container.particle-spring-1 { animation: springPath1 12s linear infinite; animation-delay: -1.5s; }
        .drifting-sakura-container.particle-spring-2 { animation: springPath2 10s linear infinite; animation-delay: -3.2s; }
        .drifting-sakura-container.particle-spring-3 { animation: springPath3 13s linear infinite; animation-delay: -4.8s; }
        .drifting-sakura-container.particle-spring-4 { animation: springPath4 11s linear infinite; animation-delay: -6.4s; }
        .drifting-sakura-container.particle-spring-5 { animation: springPath0 12s linear infinite; animation-delay: -8s; }
        .drifting-sakura-container.particle-spring-6 { animation: springPath2 11s linear infinite; animation-delay: -9.5s; }
        .drifting-sakura-container.particle-spring-7 { animation: springPath1 13s linear infinite; animation-delay: -11s; }
        .drifting-sakura-container.particle-spring-8 { animation: springPath3 10s linear infinite; animation-delay: -2s; }
        .drifting-sakura-container.particle-spring-9 { animation: springPath4 12s linear infinite; animation-delay: -5s; }
        .drifting-sakura-container.particle-spring-10 { animation: springPath0 11s linear infinite; animation-delay: -7.5s; }
        .drifting-sakura-container.particle-spring-11 { animation: springPath1 13s linear infinite; animation-delay: -3s; }
        .drifting-sakura-container.particle-spring-12 { animation: springPath2 10s linear infinite; animation-delay: -9s; }
        .drifting-sakura-container.particle-spring-13 { animation: springPath3 12s linear infinite; animation-delay: -6s; }

        .drifting-heat-container.particle-summer-0 { animation: summerPath0 10s linear infinite; }
        .drifting-heat-container.particle-summer-1 { animation: summerPath1 11s linear infinite; animation-delay: -2s; }
        .drifting-heat-container.particle-summer-2 { animation: summerPath2 9s linear infinite; animation-delay: -4s; }
        .drifting-heat-container.particle-summer-3 { animation: summerPath3 12s linear infinite; animation-delay: -6s; }
        .drifting-heat-container.particle-summer-4 { animation: summerPath0 10s linear infinite; animation-delay: -8s; }
        .drifting-heat-container.particle-summer-5 { animation: summerPath1 11s linear infinite; animation-delay: -1.2s; }
        .drifting-heat-container.particle-summer-6 { animation: summerPath2 9s linear infinite; animation-delay: -3.4s; }
        .drifting-heat-container.particle-summer-7 { animation: summerPath3 12s linear infinite; animation-delay: -5.6s; }
        .drifting-heat-container.particle-summer-8 { animation: summerPath0 10s linear infinite; animation-delay: -7.8s; }
        .drifting-heat-container.particle-summer-9 { animation: summerPath1 11s linear infinite; animation-delay: -2.2s; }
        .drifting-heat-container.particle-summer-10 { animation: summerPath2 9s linear infinite; animation-delay: -4.4s; }
        .drifting-heat-container.particle-summer-11 { animation: summerPath3 12s linear infinite; animation-delay: -6.6s; }
        .drifting-heat-container.particle-summer-12 { animation: summerPath0 10s linear infinite; animation-delay: -8.8s; }
        .drifting-heat-container.particle-summer-13 { animation: summerPath1 11s linear infinite; animation-delay: -1.5s; }

        .drifting-leaf-container.particle-autumn-0 { animation: autumnPath0 13s linear infinite; }
        .drifting-leaf-container.particle-autumn-1 { animation: autumnPath1 14s linear infinite; animation-delay: -2s; }
        .drifting-leaf-container.particle-autumn-2 { animation: autumnPath2 12s linear infinite; animation-delay: -4s; }
        .drifting-leaf-container.particle-autumn-3 { animation: autumnPath3 15s linear infinite; animation-delay: -6s; }
        .drifting-leaf-container.particle-autumn-4 { animation: autumnPath4 13s linear infinite; animation-delay: -8s; }
        .drifting-leaf-container.particle-autumn-5 { animation: autumnPath0 14s linear infinite; animation-delay: -10s; }
        .drifting-leaf-container.particle-autumn-6 { animation: autumnPath2 12s linear infinite; animation-delay: -12s; }
        .drifting-leaf-container.particle-autumn-7 { animation: autumnPath1 15s linear infinite; animation-delay: -14s; }
        .drifting-leaf-container.particle-autumn-8 { animation: autumnPath3 13s linear infinite; animation-delay: -1s; }
        .drifting-leaf-container.particle-autumn-9 { animation: autumnPath4 14s linear infinite; animation-delay: -5s; }
        .drifting-leaf-container.particle-autumn-10 { animation: autumnPath0 12s linear infinite; animation-delay: -7s; }
        .drifting-leaf-container.particle-autumn-11 { animation: autumnPath1 15s linear infinite; animation-delay: -3s; }
        .drifting-leaf-container.particle-autumn-12 { animation: autumnPath2 13s linear infinite; animation-delay: -9s; }
        .drifting-leaf-container.particle-autumn-13 { animation: autumnPath3 14s linear infinite; animation-delay: -11s; }

        .drifting-snow-container.particle-winter-0 { animation: winterPath0 10s linear infinite; }
        .drifting-snow-container.particle-winter-1 { animation: winterPath1 11s linear infinite; animation-delay: -1.8s; }
        .drifting-snow-container.particle-winter-2 { animation: winterPath2 9s linear infinite; animation-delay: -3.5s; }
        .drifting-snow-container.particle-winter-3 { animation: winterPath3 12s linear infinite; animation-delay: -5.2s; }
        .drifting-snow-container.particle-winter-4 { animation: winterPath4 10s linear infinite; animation-delay: -6.9s; }
        .drifting-snow-container.particle-winter-5 { animation: winterPath0 11s linear infinite; animation-delay: -8.6s; }
        .drifting-snow-container.particle-winter-6 { animation: winterPath2 9s linear infinite; animation-delay: -10.3s; }
        .drifting-snow-container.particle-winter-7 { animation: winterPath1 12s linear infinite; animation-delay: -12.0s; }
        .drifting-snow-container.particle-winter-8 { animation: winterPath3 10s linear infinite; animation-delay: -2s; }
        .drifting-snow-container.particle-winter-9 { animation: winterPath4 11s linear infinite; animation-delay: -4s; }
        .drifting-snow-container.particle-winter-10 { animation: winterPath0 9s linear infinite; animation-delay: -6s; }
        .drifting-snow-container.particle-winter-11 { animation: winterPath1 12s linear infinite; animation-delay: -8s; }
        .drifting-snow-container.particle-winter-12 { animation: winterPath2 10s linear infinite; animation-delay: -1s; }
        .drifting-snow-container.particle-winter-13 { animation: winterPath3 11s linear infinite; animation-delay: -7s; }

        .scared-bird-flight-right {
          animation: birdFlyToRight 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .scared-bird-flight-left {
          animation: birdFlyToLeft 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .bird-fly-away-right {
          animation: birdFlyAwayRight 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .bird-fly-away-left {
          animation: birdFlyAwayLeft 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .chime-clang {
          animation: unifiedSway 1.1s ease-in-out infinite !important;
        }
        .sound-ring {
          transform-origin: 48px 174px;
          animation: soundExpand 0.8s ease-out forwards;
        }

        .poppy-bloom {
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-origin: 0px 25px;
        }
        .sand-ripple {
          animation: leafRustle 1.8s ease-out forwards;
        }
        .snow-splash {
          animation: snowSplashAnim 1.2s ease-out forwards;
        }
        .heat-shimmer-ring {
          transform-origin: center;
          animation: shimmerHeat 1.2s ease-out forwards;
        }

        .cloth-body {
          animation: sway var(--wind-speed, 4.2s) ease-in-out infinite;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .piece-wrapper {
          animation: flutter 5s ease-in-out infinite;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .piece-wrapper.lift {
          transform: translateY(-8px) scale(1.05);
        }
        .piece-wrapper.lift .cloth-body {
          animation-duration: 1.5s !important;
        }
        .sway-line { animation: lineSway 4.8s ease-in-out infinite; transform-origin: center; }
        .blade { animation: blade 3.6s ease-in-out infinite; }
        .action-btn:hover {
          transform: scale(1.02);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${P.accent};
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}

function blendHex(a, b, t) {
  const pa = a.replace("#", "");
  const pb = b.replace("#", "");
  const ar = parseInt(pa.slice(0, 2), 16);
  const ag = parseInt(pa.slice(2, 4), 16);
  const ab = parseInt(pa.slice(4, 6), 16);
  const br = parseInt(pb.slice(0, 2), 16);
  const bg = parseInt(pb.slice(2, 4), 16);
  const bb = parseInt(pb.slice(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const getClothType = (pc, creatorType) => {
  if (creatorType && pc.id > 4) {
    return creatorType;
  }
  const title = pc.title.toUpperCase();
  if (title.includes("SAFETY") || title.includes("TEE")) return "TEE";
  if (title.includes("MATCHMAKING") || title.includes("DRESS")) return "DRESS";
  if (title.includes("OPENCLOUD") || title.includes("SCARF")) return "SCARF";
  if (title.includes("MATHWORKS") || title.includes("TROUSERS")) return "TROUSERS";
  if (title.includes("ZORRO") || title.includes("SHIRT")) return "SHIRT";
  return "TEE";
};

function clothShape(pc, x, y, on, P, creatorType, currentSeasonKey, lampWarmth = 0) {
  const stroke = on ? P.accent : P.ink;
  const tinted = P.clothTint ? blendHex(pc.hue, P.clothTint, 0.3) : pc.hue;
  let fill = on ? blendHex(tinted, P.accent, 0.18) : tinted;
  if (lampWarmth > 0) {
    fill = blendHex(fill, "#FFE9A8", 0.1 + lampWarmth * 0.3);
    fill = blendHex(fill, "#FFFDF5", lampWarmth * 0.14);
  }
  const fabricFill =
    pc.fabric === "weave" ? "url(#weave)" :
    pc.fabric === "dots" ? "url(#dots)" :
    pc.fabric === "stripe" ? "url(#stripe)" : "none";

  const typeKey = getClothType(pc, creatorType);
  const winterFrostStyle = currentSeasonKey === "winter" ? { filter: "drop-shadow(0 0 4px #FFFFFF)" } : {};

  return (
    <g style={winterFrostStyle}>

      {typeKey === "DRESS" && (
        <g stroke="none" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "stroke 0.4s ease" }}>
          <path d={`M${x - 20} ${y}
            L${x - 26} ${y + 40}
            L${x - 26} ${y + 150}
            L${x - 12} ${y + 150} L${x - 12} ${y + 132}
            L${x + 12} ${y + 132} L${x + 12} ${y + 150}
            L${x + 26} ${y + 150}
            L${x + 26} ${y + 40}
            L${x + 20} ${y}
            Q${x} ${y + 12}, ${x - 20} ${y} Z`} fill={fill} style={{ transition: "fill 0.4s ease" }} />
          <path d={`M${x - 20} ${y}
            L${x - 26} ${y + 40}
            L${x - 26} ${y + 150}
            L${x - 12} ${y + 150} L${x - 12} ${y + 132}
            L${x + 12} ${y + 132} L${x + 12} ${y + 150}
            L${x + 26} ${y + 150}
            L${x + 26} ${y + 40}
            L${x + 20} ${y}
            Q${x} ${y + 12}, ${x - 20} ${y} Z`} fill={fabricFill} stroke="none" />
          <path d={`M${x - 7} ${y + 4} L${x} ${y + 48} L${x + 7} ${y + 4}`} fill="none" stroke={stroke} strokeWidth="1.4" />
          <g fill={P.accent} opacity="0.7">
            <circle cx={x} cy={y + 14} r="1.3" />
            <circle cx={x} cy={y + 26} r="1.3" />
          </g>
          <path d={`M${x - 26} ${y + 144} L${x - 12} ${y + 144} M${x + 12} ${y + 144} L${x + 26} ${y + 144}`} stroke={P.accent} strokeWidth="3" fill="none" opacity="0.7" />
          <g fill="none" stroke={P.accent} strokeWidth="1" opacity="0.55">
            <path d={`M${x - 21} ${y + 128} q6 -4 2 4 q-2 4 -4 1 q-2 -2 2 -5`} />
            <path d={`M${x + 17} ${y + 128} q6 -4 2 4 q-2 4 -4 1 q-2 -2 2 -5`} />
          </g>
          {currentSeasonKey === "winter" && (
            <g fill="#FFFFFF" stroke={stroke} strokeWidth="1" opacity="0.9">
              <polygon points={`${x - 21},${y + 150} ${x - 19},${y + 163} ${x - 17},${y + 150}`} />
              <polygon points={`${x + 17},${y + 150} ${x + 19},${y + 165} ${x + 21},${y + 150}`} />
            </g>
          )}
        </g>
      )}

      {typeKey === "SCARF" && (
        <g stroke="none" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "stroke 0.4s ease" }}>
          <path d={`M${x - 28} ${y}
            C${x - 36} ${y + 75}, ${x - 30} ${y + 118}, ${x - 34} ${y + 162}
            Q${x - 22} ${y + 171}, ${x - 10} ${y + 163}
            C${x - 8} ${y + 118}, ${x - 10} ${y + 75}, ${x - 4} ${y + 5} Z`} fill={fill} style={{ transition: "fill 0.4s ease" }} />
          <path d={`M${x - 28} ${y}
            C${x - 36} ${y + 75}, ${x - 30} ${y + 118}, ${x - 34} ${y + 162}
            Q${x - 22} ${y + 171}, ${x - 10} ${y + 163}
            C${x - 8} ${y + 118}, ${x - 10} ${y + 75}, ${x - 4} ${y + 5} Z`} fill={fabricFill} stroke="none" />
          <path d={`M${x + 4} ${y + 5}
            C${x + 10} ${y + 70}, ${x + 8} ${y + 108}, ${x + 10} ${y + 150}
            Q${x + 22} ${y + 158}, ${x + 34} ${y + 148}
            C${x + 30} ${y + 108}, ${x + 36} ${y + 70}, ${x + 28} ${y} Z`} fill={fill} style={{ transition: "fill 0.4s ease" }} />
          <path d={`M${x + 4} ${y + 5}
            C${x + 10} ${y + 70}, ${x + 8} ${y + 108}, ${x + 10} ${y + 150}
            Q${x + 22} ${y + 158}, ${x + 34} ${y + 148}
            C${x + 30} ${y + 108}, ${x + 36} ${y + 70}, ${x + 28} ${y} Z`} fill={fabricFill} stroke="none" />
          <path d={`M${x - 34} ${y + 156} Q${x - 22} ${y + 167}, ${x - 10} ${y + 157}`} stroke={P.accent} strokeWidth="3.5" fill="none" opacity="0.8" />
          <path d={`M${x + 10} ${y + 142} Q${x + 22} ${y + 153}, ${x + 34} ${y + 141}`} stroke={P.accent} strokeWidth="3.5" fill="none" opacity="0.8" />
          <path d={`M${x - 31} ${y + 10} C${x - 39} ${y + 80}, ${x - 33} ${y + 120}, ${x - 37} ${y + 158}`} stroke={P.accent} strokeWidth="1.4" fill="none" opacity="0.5" />
          <path d={`M${x + 31} ${y + 10} C${x + 39} ${y + 80}, ${x + 33} ${y + 112}, ${x + 37} ${y + 146}`} stroke={P.accent} strokeWidth="1.4" fill="none" opacity="0.5" />
          <g stroke={P.accent} strokeWidth="0.7" fill="none" opacity="0.28">
            <path d={`M${x - 24} ${y + 16} C${x - 22} ${y + 60}, ${x - 26} ${y + 110}, ${x - 25} ${y + 160}`} />
            <path d={`M${x - 16} ${y + 14} C${x - 14} ${y + 60}, ${x - 18} ${y + 110}, ${x - 17} ${y + 161}`} />
            <path d={`M${x + 24} ${y + 16} C${x + 22} ${y + 55}, ${x + 26} ${y + 100}, ${x + 25} ${y + 148}`} />
            <path d={`M${x + 16} ${y + 14} C${x + 14} ${y + 55}, ${x + 18} ${y + 100}, ${x + 17} ${y + 148}`} />
          </g>
          <g stroke={P.accent} strokeWidth="1" opacity="0.7">
            <path d={`M${x - 30} ${y + 161} l-1 7`} />
            <path d={`M${x - 22} ${y + 166} l0 7`} />
            <path d={`M${x - 14} ${y + 162} l1 7`} />
            <path d={`M${x + 14} ${y + 149} l-1 7`} />
            <path d={`M${x + 22} ${y + 154} l0 7`} />
            <path d={`M${x + 30} ${y + 149} l1 7`} />
          </g>
          {currentSeasonKey === "winter" && (
            <g fill="#FFFFFF" stroke={stroke} strokeWidth="1" opacity="0.9">
              <polygon points={`${x - 26},${y + 161} ${x - 24},${y + 173} ${x - 22},${y + 161}`} />
              <polygon points={`${x + 22},${y + 148} ${x + 24},${y + 160} ${x + 26},${y + 148}`} />
            </g>
          )}
        </g>
      )}

      {typeKey === "TROUSERS" && (
        <g stroke="none" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "stroke 0.4s ease" }}>
          <path d={`M${x - 24} ${y} h48
            C${x + 26} ${y + 60}, ${x + 16} ${y + 120}, ${x + 12} ${y + 156}
            q-7 6 -13 -1 L${x} ${y + 74}
            L${x - 13} ${y + 155} q-6 8 -13 1
            C${x - 16} ${y + 120}, ${x - 26} ${y + 60}, ${x - 24} ${y} Z`} fill={fill} style={{ transition: "fill 0.4s ease" }} />
          <rect x={x - 24} y={y} width="48" height="150" fill={fabricFill} stroke="none" opacity="0.6" />
          <g stroke={stroke} strokeWidth="0.9" fill="none" opacity="0.6">
            <path d={`M${x - 19} ${y + 120} q6 3 12 0`} />
            <path d={`M${x - 19} ${y + 128} q6 3 12 0`} />
            <path d={`M${x - 19} ${y + 136} q6 3 12 0`} />
            <path d={`M${x - 19} ${y + 144} q6 3 12 0`} />
            <path d={`M${x + 7} ${y + 120} q6 3 12 0`} />
            <path d={`M${x + 7} ${y + 128} q6 3 12 0`} />
            <path d={`M${x + 7} ${y + 136} q6 3 12 0`} />
            <path d={`M${x + 7} ${y + 144} q6 3 12 0`} />
          </g>
          {currentSeasonKey === "winter" && (
            <g fill="#FFFFFF" stroke={stroke} strokeWidth="1" opacity="0.9">
              <polygon points={`${x - 15},${y + 153} ${x - 13},${y + 165} ${x - 11},${y + 153}`} />
              <polygon points={`${x + 5},${y + 153} ${x + 7},${y + 165} ${x + 9},${y + 153}`} />
            </g>
          )}
        </g>
      )}

      {typeKey === "SHIRT" && (
        <g stroke="none" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "stroke 0.4s ease" }}>
          <path d={`M${x - 28} ${y}
            L${x - 36} ${y + 150}
            Q${x} ${y + 166}, ${x + 36} ${y + 150}
            L${x + 30} ${y}
            Q${x} ${y + 12}, ${x - 28} ${y} Z`} fill={fill} style={{ transition: "fill 0.4s ease" }} />
          <path d={`M${x - 28} ${y}
            L${x - 36} ${y + 150}
            Q${x} ${y + 166}, ${x + 36} ${y + 150}
            L${x + 30} ${y}
            Q${x} ${y + 12}, ${x - 28} ${y} Z`} fill={fabricFill} stroke="none" />
          <g stroke={P.accent} strokeWidth="0.9" opacity="0.45" fill="none">
            <path d={`M${x - 18} ${y + 12} L${x - 22} ${y + 150}`} />
            <path d={`M${x - 8} ${y + 10} L${x - 11} ${y + 154}`} />
            <path d={`M${x + 2} ${y + 9} L${x + 1} ${y + 156}`} />
            <path d={`M${x + 12} ${y + 10} L${x + 14} ${y + 153}`} />
          </g>
          <path d={`M${x + 30} ${y + 3} L${x + 25} ${y + 150}`} stroke={P.accent} strokeWidth="4" fill="none" opacity="0.8" />
          <path d={`M${x - 34} ${y + 145} Q${x} ${y + 161}, ${x + 34} ${y + 145}`} stroke={P.accent} strokeWidth="5" fill="none" opacity="0.8" />
          <path d={`M${x - 32} ${y + 134} Q${x} ${y + 149}, ${x + 32} ${y + 134}`} stroke={P.accent} strokeWidth="2" fill="none" opacity="0.5" />
          <path d={`M${x + 30} ${y}
            Q${x + 48} ${y + 2}, ${x + 47} ${y + 30}
            Q${x + 46} ${y + 70}, ${x + 40} ${y + 100}
            Q${x + 34} ${y + 92}, ${x + 30} ${y + 96}
            Q${x + 33} ${y + 60}, ${x + 30} ${y} Z`} fill={`${P.accent}40`} stroke={stroke} strokeWidth="1.2" />
          <path d={`M${x + 47} ${y + 30} Q${x + 46} ${y + 70}, ${x + 40} ${y + 100}`} stroke={P.accent} strokeWidth="2.5" fill="none" opacity="0.85" />
          <g fill="none" stroke={P.accent} strokeWidth="1" opacity="0.75">
            <path d={`M${x + 36} ${y + 30} q6 -4 2 4 q-2 4 -4 1 q-2 -2 2 -5`} />
            <path d={`M${x + 36} ${y + 55} q6 -4 2 4 q-2 4 -4 1 q-2 -2 2 -5`} />
            <path d={`M${x + 35} ${y + 80} q6 -4 2 4 q-2 4 -4 1 q-2 -2 2 -5`} />
          </g>
          {currentSeasonKey === "winter" && (
            <g fill="#FFFFFF" stroke={stroke} strokeWidth="1" opacity="0.9">
              <polygon points={`${x - 26},${y + 150} ${x - 24},${y + 163} ${x - 22},${y + 150}`} />
              <polygon points={`${x + 20},${y + 150} ${x + 22},${y + 165} ${x + 24},${y + 150}`} />
            </g>
          )}
        </g>
      )}

      {typeKey === "TEE" && (
        <g stroke="none" strokeLinejoin="round" strokeLinecap="round" style={{ transition: "stroke 0.4s ease" }}>
          <path d={`M${x - 20} ${y}
            L${x - 16} ${y + 24}
            C${x - 40} ${y + 84}, ${x - 50} ${y + 130}, ${x - 44} ${y + 150}
            Q${x} ${y + 172}, ${x + 44} ${y + 150}
            C${x + 50} ${y + 130}, ${x + 40} ${y + 84}, ${x + 16} ${y + 24}
            L${x + 20} ${y}
            Q${x} ${y + 12}, ${x - 20} ${y} Z`} fill={fill} style={{ transition: "fill 0.4s ease" }} />
          <path d={`M${x - 16} ${y + 24}
            C${x - 40} ${y + 84}, ${x - 50} ${y + 130}, ${x - 44} ${y + 150}
            Q${x} ${y + 172}, ${x + 44} ${y + 150}
            C${x + 50} ${y + 130}, ${x + 40} ${y + 84}, ${x + 16} ${y + 24} Z`} fill={fabricFill} stroke="none" />
          <path d={`M${x - 20} ${y + 8} Q${x} ${y + 18}, ${x + 20} ${y + 8}`} stroke={P.accent} strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d={`M${x - 42} ${y + 140} Q${x} ${y + 162}, ${x + 42} ${y + 140}`} stroke={P.accent} strokeWidth="5" fill="none" opacity="0.75" />
          <path d={`M${x - 40} ${y + 126} Q${x} ${y + 146}, ${x + 40} ${y + 126}`} stroke={P.accent} strokeWidth="2" fill="none" opacity="0.5" />
          <g fill="none" stroke={P.accent} strokeWidth="1.2" opacity="0.6">
            <path d={`M${x - 30} ${y + 112} q8 -7 16 0`} />
            <path d={`M${x - 8} ${y + 116} q8 -7 16 0`} />
            <path d={`M${x + 14} ${y + 112} q8 -7 16 0`} />
          </g>
          {currentSeasonKey === "winter" && (
            <g fill="#FFFFFF" stroke={stroke} strokeWidth="1" opacity="0.9">
              <polygon points={`${x - 30},${y + 150} ${x - 28},${y + 163} ${x - 26},${y + 150}`} />
              <polygon points={`${x + 26},${y + 150} ${x + 28},${y + 165} ${x + 30},${y + 150}`} />
            </g>
          )}
        </g>
      )}
    </g>
  );
}
