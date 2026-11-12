// MY BLOCK v1.0.0 — juego voxel estilo Minecraft (Three.js r160)
// Mundo de bloques, 1.ª/3.ª persona, pistola, poderes, monstruos. 100% offline.
import * as THREE from 'three';

// ---------------------------------------------------------------- constantes
const W = 64, D = 64, H = 24;          // tamaño del mundo en bloques
const SAVE_KEY = 'myblock-save-v1';
const B = { AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, WOOD: 4, LEAVES: 5, SAND: 6, PLANKS: 7, BRICK: 8, GLASS: 9, TNT: 10, WATER: 11, ASPHALT: 12, SIDEWALK: 13, WHITE: 14, DARK: 15, DOOR: 16, WINDOW: 17, TV: 18, COMPUTER: 19, FIRE: 20 };
const BLOCK_DEFS = {
  [B.GRASS]:  { name: 'Hierba',  top: [0.42, 0.72, 0.25], side: [0.55, 0.38, 0.24], bottom: [0.55, 0.38, 0.24] },
  [B.DIRT]:   { name: 'Tierra',  top: [0.55, 0.38, 0.24], side: [0.55, 0.38, 0.24], bottom: [0.55, 0.38, 0.24] },
  [B.STONE]:  { name: 'Piedra',  top: [0.55, 0.55, 0.58], side: [0.55, 0.55, 0.58], bottom: [0.55, 0.55, 0.58] },
  [B.WOOD]:   { name: 'Madera',  top: [0.66, 0.48, 0.26], side: [0.42, 0.28, 0.13], bottom: [0.66, 0.48, 0.26] },
  [B.LEAVES]: { name: 'Hojas',   top: [0.20, 0.55, 0.20], side: [0.18, 0.50, 0.18], bottom: [0.18, 0.50, 0.18] },
  [B.SAND]:   { name: 'Arena',   top: [0.86, 0.79, 0.55], side: [0.86, 0.79, 0.55], bottom: [0.86, 0.79, 0.55] },
  [B.PLANKS]: { name: 'Tablón',  top: [0.73, 0.56, 0.33], side: [0.73, 0.56, 0.33], bottom: [0.73, 0.56, 0.33] },
  [B.BRICK]:  { name: 'Ladrillo',top: [0.63, 0.29, 0.22], side: [0.63, 0.29, 0.22], bottom: [0.63, 0.29, 0.22] },
  [B.GLASS]:  { name: 'Cristal', top: [0.78, 0.89, 0.96], side: [0.78, 0.89, 0.96], bottom: [0.78, 0.89, 0.96], pass: 'glass' },
  [B.TNT]:    { name: 'TNT',     top: [0.85, 0.20, 0.14], side: [0.85, 0.20, 0.14], bottom: [0.85, 0.20, 0.14] },
  [B.WATER]:  { name: 'Agua',    top: [0.25, 0.55, 0.95], side: [0.25, 0.55, 0.95], bottom: [0.25, 0.55, 0.95], pass: 'water' },
  [B.ASPHALT]:{ name: 'Asfalto', top: [0.16, 0.16, 0.18], side: [0.16, 0.16, 0.18], bottom: [0.16, 0.16, 0.18] },
  [B.SIDEWALK]:{ name: 'Acera',  top: [0.72, 0.72, 0.74], side: [0.72, 0.72, 0.74], bottom: [0.72, 0.72, 0.74] },
  [B.WHITE]:  { name: 'Blanco',  top: [0.94, 0.94, 0.92], side: [0.94, 0.94, 0.92], bottom: [0.94, 0.94, 0.92] },
  [B.DARK]:   { name: 'Oscuro',  top: [0.20, 0.20, 0.24], side: [0.20, 0.20, 0.24], bottom: [0.20, 0.20, 0.24] },
  [B.DOOR]:   { name: 'Puerta',  top: [0.48, 0.32, 0.18], side: [0.48, 0.32, 0.18], bottom: [0.48, 0.32, 0.18] },
  [B.WINDOW]: { name: 'Ventana', top: [0.78, 0.89, 0.96], side: [0.78, 0.89, 0.96], bottom: [0.78, 0.89, 0.96], pass: 'glass' },
  [B.TV]:     { name: 'TV plasma', top: [0.08, 0.08, 0.12], side: [0.10, 0.10, 0.16], bottom: [0.10, 0.10, 0.16] },
  [B.COMPUTER]:{ name: 'Computadora', top: [0.23, 0.25, 0.29], side: [0.23, 0.25, 0.29], bottom: [0.23, 0.25, 0.29] },
  [B.FIRE]:   { name: 'Fogata',  top: [1.00, 0.45, 0.10], side: [1.00, 0.45, 0.10], bottom: [1.00, 0.45, 0.10] },
};
const HOTBAR = [
  { kind: 'hand',  name: 'Mano',     icon: '✋', color: '#f2c184' },
  { kind: 'block', id: B.GRASS,  name: 'Hierba',   icon: '🌱', color: '#69b53f' },
  { kind: 'block', id: B.DIRT,   name: 'Tierra',   icon: '🟫', color: '#8a5f3c' },
  { kind: 'block', id: B.STONE,  name: 'Piedra',   icon: '⬜', color: '#8d8d92' },
  { kind: 'block', id: B.WOOD,   name: 'Madera',   icon: '🪵', color: '#6b4a22' },
  { kind: 'block', id: B.PLANKS, name: 'Tablón',   icon: '🟧', color: '#b88a52' },
  { kind: 'block', id: B.BRICK,  name: 'Ladrillo', icon: '🧱', color: '#9e4738' },
  { kind: 'block', id: B.GLASS,  name: 'Cristal',  icon: '🔷', color: '#bfe0f2' },
  { kind: 'block', id: B.TNT,    name: 'TNT',      icon: '🧨', color: '#d93326' },
  { kind: 'gun',   name: 'Pistola', icon: '🔫', color: '#3a3f4a', weapon: { name: 'Pistola', dmg: 1, ammo: 12, rate: 220, range: 60, splash: 0 } },
];
const extraSlots = []; // bloques y armas creados en el crafteo (se añaden a la barra)
function allSlots() { return HOTBAR.concat(extraSlots); }

// ---------------------------------------------------------------- estado v2 (mochila, vehículos, mano)
const inv = {}; // id -> cantidad (apilado: un hueco por objeto)
const ammoByWeapon = { Pistola: 12 };
let driving = null; // vehículo que se está manejando
let handGroup = null, heldBlock = null, handSwing = 0;
let prevCameraMode = 'first';

// ---------------------------------------------------------------- ruido (mundo determinista)
let worldSeed = 1337;
function hash2(x, z) {
  let n = Math.sin(x * 127.1 + z * 311.7 + worldSeed * 0.731) * 43758.5453;
  return n - Math.floor(n);
}
function smooth(t) { return t * t * (3 - 2 * t); }
function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  const u = smooth(xf), v = smooth(zf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, z) { return vnoise(x, z) * 0.65 + vnoise(x * 2.13, z * 2.13) * 0.35; }
function groundHeight(x, z) {
  if (x >= 56 && z >= 8) return x === 56 ? 2 : 1;    // mar: fondo de arena (1-2 de profundidad)
  if (x >= 52 && z >= 8) return 3;                   // playa
  if (x >= 28 && x <= 51 && z >= 8 && z <= 47) return 3; // ciudad plana
  if (x >= 44 && z < 8) return 3;                    // aeropuerto
  if (x < 12 && z < 12) return 8 + Math.floor(fbm(x * 0.08, z * 0.08) * 5); // montañas 8..12
  return 3 + Math.floor(fbm(x * 0.08, z * 0.08) * 6); // bosque/colinas 3..8
}
function inCity(x, z) { return x >= 28 && x <= 51 && z >= 8 && z <= 47; }
function isStreet(x, z) {
  if (!inCity(x, z)) return false;
  const vx = (x === 32 || x === 33 || x === 40 || x === 41);
  const hz = (z === 16 || z === 17 || z === 24 || z === 25 || z === 32 || z === 33 || z === 40 || z === 41);
  return vx || hz;
}
function isSidewalk(x, z) {
  if (!inCity(x, z) || isStreet(x, z)) return false;
  const nearV = [31, 34, 39, 42].includes(x);
  const nearH = [15, 18, 23, 26, 31, 34, 39, 42].includes(z);
  return nearV || nearH;
}
function isRunway(x, z) { return x >= 44 && x <= 63 && z >= 2 && z <= 5; }
function topType(x, z, h) {
  if (isRunway(x, z)) return (z === 3 || z === 4) && (x % 4 === 0) ? B.WHITE : B.ASPHALT;
  if (x >= 52 && z >= 8) return B.SAND;             // playa y fondo del mar
  if (isStreet(x, z)) return B.ASPHALT;
  if (isSidewalk(x, z)) return B.SIDEWALK;
  if (inCity(x, z)) return B.GRASS;                  // parcelas
  if (x >= 44 && z < 8) return B.GRASS;              // aeropuerto (fuera de la pista)
  return h <= 3 ? B.SAND : B.GRASS;
}
function setGen(x, y, z, t) { // poner bloque al generar el mundo (no se guarda como cambio del jugador)
  if (inBounds(x, y, z)) blocks[idx(x, y, z)] = t;
}

// ---------------------------------------------------------------- estado
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x79a6ff);
scene.fog = new THREE.Fog(0x9ec3ff, 40, 110);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
camera.rotation.order = 'YXZ';

scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x8a6b46, 1.0));
const sun = new THREE.DirectionalLight(0xfff2c0, 1.4);
sun.position.set(40, 80, 20);
scene.add(sun);

// mundo (voxels)
const blocks = new Uint8Array(W * H * D);
const modified = {}; // índice -> tipo (para guardar lo construido/roto)
const idx = (x, y, z) => (y * D + z) * W + x;
const inBounds = (x, y, z) => x >= 0 && x < W && z >= 0 && z < D && y >= 0 && y < H;
function getBlock(x, y, z) {
  if (y < 0) return B.STONE;                 // suelo infinito
  if (!inBounds(x, y, z)) return B.STONE;    // paredes invisibles en los bordes
  return blocks[idx(x, y, z)];
}
function setBlock(x, y, z, t) {
  if (!inBounds(x, y, z)) return;
  blocks[idx(x, y, z)] = t;
  modified[idx(x, y, z)] = t;
}
function topSolidY(x, z) { // y del bloque sólido más alto + 1 (para apoyar cosas)
  for (let y = H - 1; y >= 0; y--) if (getBlock(x, y, z) !== B.AIR) return y + 1;
  return 0;
}

function generateWorld() {
  blocks.fill(B.AIR);
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    const h = groundHeight(x, z);
    const top = topType(x, z, h);
    for (let y = 0; y < h; y++) {
      let t = B.STONE;
      if (y === h - 1) t = top;
      else if (y >= h - 3) t = (top === B.SAND) ? B.SAND : B.DIRT;
      blocks[idx(x, y, z)] = t;
    }
    // mar: agua encima del fondo de arena
    if (x >= 56 && z >= 8) for (let y = h; y <= 2; y++) blocks[idx(x, y, z)] = B.WATER;
    // árboles solo en el bosque (oeste) y alguno en las aceras
    if (x < 28 && h > 3 && hash2(x * 7 + 13, z * 7 + 29) < 0.016) {
      const dx = x - W / 2, dz = z - D / 2;
      if (dx * dx + dz * dz > 25) makeTree(x, h, z);
    }
  }
  // casas modernas de la ciudad (blancas, cristal, terraza, piscina)
  makeHouse(34, 20, 5, 4, true);   // A — Nacho
  makeHouse(42, 20, 5, 4, true);   // B — Dagar
  makeHouse(34, 28, 5, 4, false);  // C — Lucía
  makeHouse(42, 28, 5, 4, false);  // D — Carlos
  makeHouse(34, 36, 5, 4, false);  // E — Marta
  makeHouse(42, 36, 5, 4, false);  // F — Pedro
  makeHouse(28, 44, 4, 4, false);  // G — Ana
  makeHouse(48, 44, 4, 4, false);  // H — Luis
  makeHouse(28, 10, 4, 4, false);  // I — Roco
  makeHouse(48, 10, 4, 4, false);  // J — Tito
  // avión aparcado en el aeropuerto + terminal
  makePlane(54, 3, 6);
  makeHouse(44, 6, 4, 3, false);   // terminal
  // aplicar lo guardado (lo construido/roto por el jugador)
  for (const k of Object.keys(modified)) blocks[k] = modified[k];
}
function makeTree(x, h, z) {
  for (let y = h; y < h + 4; y++) setGen(x, y, z, B.WOOD);
  for (let ox = -2; ox <= 2; ox++) for (let oz = -2; oz <= 2; oz++) for (let oy = 0; oy <= 1; oy++) {
    if (Math.abs(ox) === 2 && Math.abs(oz) === 2) continue;
    const xx = x + ox, yy = h + 4 + oy, zz = z + oz;
    if (inBounds(xx, yy, zz) && blocks[idx(xx, yy, zz)] === B.AIR) setGen(xx, yy, zz, B.LEAVES);
  }
  if (inBounds(x, h + 6, z)) setGen(x, h + 6, z, B.LEAVES);
}
// casa moderna (estilo de las fotos): blanca, cristal, puerta, techo plano, piscina
function makeHouse(x0, z0, w, d, pool) {
  const baseY = 3, H1 = 3, H2 = 3;
  for (let y = 0; y < H1 + H2; y++) {
    for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) {
      const edge = x === x0 || x === x0 + w - 1 || z === z0 || z === z0 + d - 1;
      if (!edge) continue;
      let t = B.WHITE;
      if (z === z0 && x === x0 + 1 && y < 2) t = B.DOOR; // puerta al frente
      else if (y === 1 || y === 4) {
        if ((x === x0 || x === x0 + w - 1) && z !== z0 && z !== z0 + d - 1) t = B.WINDOW;
        else if (z === z0 + d - 1 && x !== x0 && x !== x0 + w - 1) t = B.WINDOW;
        else if (z === z0 && x !== x0 && x !== x0 + w - 1 && y === 4) t = B.WINDOW;
      }
      if (y === H1) t = B.DARK; // franja oscura entre plantas
      setGen(x, baseY + y, z, t);
    }
  }
  for (let x = x0; x < x0 + w; x++) for (let z = z0; z < z0 + d; z++) setGen(x, baseY + H1 + H2, z, B.WHITE); // techo
  for (let y = 0; y < H1 + H2; y++) for (let x = x0 + 1; x < x0 + w - 1; x++) for (let z = z0 + 1; z < z0 + d - 1; z++) setGen(x, baseY + y, z, B.AIR); // interior
  for (let x = x0 + 1; x < x0 + w - 1; x++) for (let z = z0 + 1; z < z0 + d - 1; z++) setGen(x, baseY - 1, z, B.PLANKS); // suelo
  if (pool) { // piscina 3x2 delante de la casa (a la derecha de la puerta)
    for (let x = x0 + 2; x < x0 + 5; x++) for (let z = z0 - 2; z < z0; z++) {
      setGen(x, 1, z, B.WHITE);
      setGen(x, 2, z, B.WATER);
    }
    for (let x = x0 + 1; x < x0 + 6; x++) { setGen(x, 2, z0 - 3, B.WHITE); setGen(x, 2, z0, B.WHITE); }
    setGen(x0 + 1, 2, z0 - 2, B.WHITE); setGen(x0 + 1, 2, z0 - 1, B.WHITE);
    setGen(x0 + 5, 2, z0 - 2, B.WHITE); setGen(x0 + 5, 2, z0 - 1, B.WHITE);
  }
}
// avión aparcado (decoración; manejable en la fase 3)
function makePlane(x0, y0, z0) {
  for (let x = x0; x < x0 + 9; x++) for (let z = z0; z < z0 + 3; z++) {
    setGen(x, y0, z, B.WHITE); setGen(x, y0 + 1, z, B.WHITE);
    if (z === z0 + 1) { setGen(x, y0 + 1, z, B.DARK); } // franja de ventanas
  }
  setGen(x0 + 9, y0, z0 + 1, B.DARK); // morro
  for (let z = z0 - 4; z <= z0 + 6; z++) { setGen(x0 + 4, y0, z, B.WHITE); } // alas
  for (let y = y0; y < y0 + 3; y++) setGen(x0, y, z0 + 1, B.WHITE); // cola
  setGen(x0, y0 + 2, z0, B.DARK); setGen(x0, y0 + 2, z0 + 2, B.DARK);
}

// ---------------------------------------------------------------- mallado (solo caras visibles)
const FACES = [
  { dir: [1, 0, 0],  shade: 0.80, c: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { dir: [-1, 0, 0], shade: 0.80, c: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
  { dir: [0, 1, 0],  shade: 1.00, c: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]] },
  { dir: [0, -1, 0], shade: 0.50, c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]] },
  { dir: [0, 0, 1],  shade: 0.65, c: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]] },
  { dir: [0, 0, -1], shade: 0.65, c: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]] },
];
let worldMesh = null, glassMesh = null, waterMesh = null;
const opaqueMat = new THREE.MeshLambertMaterial({ vertexColors: true });
const glassMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.45, depthWrite: false });
const waterMat = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false });

function buildGeometry(pass) {
  const pos = [], nor = [], col = [], ind = [];
  let v = 0;
  for (let y = 0; y < H; y++) for (let z = 0; z < D; z++) for (let x = 0; x < W; x++) {
    const t = blocks[idx(x, y, z)];
    if (t === B.AIR) continue;
    const def = BLOCK_DEFS[t];
    const myPass = def.pass || 'opaque';
    if (myPass !== pass) continue;
    for (const f of FACES) {
      const nx = x + f.dir[0], ny = y + f.dir[1], nz = z + f.dir[2];
      const nt = getBlock(nx, ny, nz);
      const nDef = BLOCK_DEFS[nt];
      const nPass = nt === B.AIR ? 'air' : (nDef.pass || 'opaque');
      // ¿se ve esta cara? (aire, o transparente distinto al de este bloque)
      let show = false;
      if (nPass === 'air') show = true;
      else if (pass === 'water') show = nPass !== 'water';
      else if (pass === 'glass') show = nPass !== 'glass';
      else show = (nPass === 'water' || nPass === 'glass');
      if (!show) continue;
      const base = f.dir[1] === 1 ? def.top : f.dir[1] === -1 ? def.bottom : def.side;
      for (const corner of f.c) {
        pos.push(x + corner[0], y + corner[1], z + corner[2]);
        nor.push(f.dir[0], f.dir[1], f.dir[2]);
        col.push(base[0] * f.shade, base[1] * f.shade, base[2] * f.shade);
      }
      ind.push(v, v + 1, v + 2, v, v + 2, v + 3);
      v += 4;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(ind);
  return g;
}
function rebuildMesh() {
  if (worldMesh) { scene.remove(worldMesh); worldMesh.geometry.dispose(); }
  if (glassMesh) { scene.remove(glassMesh); glassMesh.geometry.dispose(); }
  if (waterMesh) { scene.remove(waterMesh); waterMesh.geometry.dispose(); }
  worldMesh = new THREE.Mesh(buildGeometry('opaque'), opaqueMat);
  glassMesh = new THREE.Mesh(buildGeometry('glass'), glassMat);
  glassMesh.renderOrder = 1;
  waterMesh = new THREE.Mesh(buildGeometry('water'), waterMat);
  waterMesh.renderOrder = 2;
  scene.add(worldMesh, glassMesh, waterMesh);
}
function countSolid() { let n = 0; for (let i = 0; i < blocks.length; i++) if (blocks[i] !== B.AIR) n++; return n; }

// nubes
const clouds = [];
{
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 9; i++) {
    const g = new THREE.Group();
    const n = 2 + Math.floor(hash2(i * 3, i * 5) * 3);
    for (let j = 0; j < n; j++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(4 + hash2(i, j) * 5, 1.2, 3 + hash2(j, i) * 3), cloudMat);
      m.position.set(j * 4 - n * 2, 0, (hash2(i + j, 9) - 0.5) * 4);
      g.add(m);
    }
    g.position.set(hash2(i, 1) * W, 19 + hash2(i, 2) * 2, hash2(i, 3) * D);
    scene.add(g);
    clouds.push(g);
  }
}

// resaltado del bloque apuntado
const highlight = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002)),
  new THREE.LineBasicMaterial({ color: 0x111111 })
);
highlight.visible = false;
scene.add(highlight);

// ---------------------------------------------------------------- sonido (WebAudio, sin archivos)
let audioCtx = null, soundOn = true;
function ac() {
  if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; } }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function beep(f0, f1, dur, type = 'square', vol = 0.15) {
  if (!soundOn) return; const ctx = ac(); if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, ctx.currentTime);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), ctx.currentTime + dur);
  g.gain.setValueAtTime(vol, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
}
function noiseBurst(dur = 0.12, vol = 0.25, freq = 1200) {
  if (!soundOn) return; const ctx = ac(); if (!ctx) return;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
  const g = ctx.createGain(); g.gain.value = vol;
  src.connect(f).connect(g).connect(ctx.destination); src.start();
}
const sfx = {
  shoot: () => { noiseBurst(0.09, 0.3, 3000); beep(190, 60, 0.1, 'square', 0.18); },
  break: () => { noiseBurst(0.14, 0.25, 700); },
  place: () => { beep(240, 180, 0.07, 'square', 0.12); },
  jump: () => { beep(280, 520, 0.12, 'sine', 0.10); },
  hurt: () => { beep(140, 90, 0.2, 'sawtooth', 0.18); },
  mobDie: () => { beep(420, 70, 0.4, 'square', 0.16); },
  power: () => { beep(500, 500, 0.09, 'sine', 0.14); setTimeout(() => beep(660, 660, 0.09, 'sine', 0.14), 90); setTimeout(() => beep(880, 880, 0.14, 'sine', 0.14), 180); },
  reload: () => { beep(300, 300, 0.05, 'square', 0.12); setTimeout(() => beep(420, 420, 0.05, 'square', 0.12), 120); },
  explode: () => { noiseBurst(0.5, 0.4, 400); beep(90, 30, 0.5, 'sine', 0.25); },
  empty: () => { beep(160, 160, 0.05, 'square', 0.1); },
};

// ---------------------------------------------------------------- jugador
const player = {
  pos: new THREE.Vector3(W / 2 + 0.5, 12, D / 2 + 0.5),
  vel: new THREE.Vector3(),
  yaw: Math.PI * 0.25, pitch: -0.05,
  onGround: false, halfW: 0.3, height: 1.8, eye: 1.62,
  speed: 4.6,
};
let cameraMode = 'first'; // 'first' | 'third'
const THIRD_DIST = 5.5;

function headPos() { return new THREE.Vector3(player.pos.x, player.pos.y + player.eye, player.pos.z); }
function lookDir() {
  const cp = Math.cos(player.pitch);
  return new THREE.Vector3(-Math.sin(player.yaw) * cp, Math.sin(player.pitch), -Math.cos(player.yaw) * cp);
}
function solidAt(x, y, z) { const t = getBlock(Math.floor(x), Math.floor(y), Math.floor(z)); return t !== B.AIR && t !== B.WATER; }
function collideAxis(axis, delta) {
  if (delta === 0) return;
  const p = player.pos, hw = player.halfW, h = player.height;
  if (axis === 0) p.x += delta; else if (axis === 1) p.y += delta; else p.z += delta;
  const minX = Math.floor(p.x - hw), maxX = Math.floor(p.x + hw);
  const minY = Math.floor(p.y), maxY = Math.floor(p.y + h - 0.01);
  const minZ = Math.floor(p.z - hw), maxZ = Math.floor(p.z + hw);
  for (let x = minX; x <= maxX; x++) for (let y = minY; y <= maxY; y++) for (let z = minZ; z <= maxZ; z++) {
    if (!solidAt(x + 0.5, y + 0.5, z + 0.5)) continue;
    // hay colisión: retroceder hasta el borde del bloque
    if (axis === 0) p.x = delta > 0 ? Math.min(p.x, x - hw - 0.001) : Math.max(p.x, x + 1 + hw + 0.001);
    else if (axis === 1) {
      if (delta > 0) p.y = Math.min(p.y, y - h - 0.001);
      else { p.y = Math.max(p.y, y + 1); player.onGround = true; }
      player.vel.y = 0;
    } else p.z = delta > 0 ? Math.min(p.z, z - hw - 0.001) : Math.max(p.z, z + 1 + hw + 0.001);
    return;
  }
}
function updatePlayer(dt, input) {
  const speed = player.speed * (superJump.active ? 1.15 : 1) * (isInWater() ? 0.55 : 1);
  const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
  let fx = 0, fz = 0;
  if (input.forward) { fx += -sin; fz += -cos; }
  if (input.back) { fx += sin; fz += cos; }
  if (input.left) { fx += -cos; fz += sin; }
  if (input.right) { fx += cos; fz += -sin; }
  const len = Math.hypot(fx, fz) || 1;
  player.vel.x = (fx / len) * speed * (fx || fz ? 1 : 0);
  player.vel.z = (fz / len) * speed * (fx || fz ? 1 : 0);
  if (isInWater()) {
    player.vel.y -= 6 * dt; // flotar
    if (input.jump) player.vel.y = 5.5; // nadar hacia arriba
    else if (headUnderWater()) player.vel.y = Math.max(player.vel.y, 1.0); // flotar a la superficie
    if (player.vel.y < -4) player.vel.y = -4;
    if (player.vel.y > 6) player.vel.y = 6;
  } else {
    player.vel.y -= 26 * dt;
    if (player.vel.y < -30) player.vel.y = -30;
    if (input.jump && player.onGround) {
      player.vel.y = superJump.active ? 15 : 9;
      player.onGround = false;
      sfx.jump();
    }
  }
  player.onGround = false;
  collideAxis(0, player.vel.x * dt);
  collideAxis(2, player.vel.z * dt);
  collideAxis(1, player.vel.y * dt);
  if (player.pos.y < 1) { player.pos.y = 1; player.vel.y = 0; player.onGround = true; }
  walking = !!(fx || fz);
}
function updateCamera() {
  if (driving) { // persecución detrás del vehículo
    const v = driving;
    const fx = -Math.sin(v.heading), fz = -Math.cos(v.heading);
    const px = v.group.position.x, py = v.group.position.y + 1.6, pz = v.group.position.z;
    camera.position.set(px - fx * 7, py + 3, pz - fz * 7);
    camera.lookAt(px + fx * 2, py, pz + fz * 2);
    return;
  }
  const head = headPos();
  if (cameraMode === 'first') {
    camera.position.copy(head);
    camera.rotation.set(player.pitch, player.yaw, 0);
  } else {
    const dir = lookDir();
    let dist = THIRD_DIST;
    // acercar la cámara si hay un bloque en medio
    for (let d = 0.5; d <= THIRD_DIST; d += 0.5) {
      const px = head.x - dir.x * d, py = head.y - dir.y * d, pz = head.z - dir.z * d;
      if (solidAt(px, py, pz)) { dist = Math.max(0.6, d - 0.6); break; }
    }
    camera.position.set(head.x - dir.x * dist, head.y - dir.y * dist, head.z - dir.z * dist);
    camera.lookAt(head.x + dir.x * 2, head.y + dir.y * 2, head.z + dir.z * 2);
  }
}
function setCameraMode(m) {
  cameraMode = m;
  character.visible = (m === 'third' && !driving);
  updateHandVisibility();
  toast(m === 'first' ? '📷 Primera persona' : '📷 Tercera persona');
}

// ---------------------------------------------------------------- personaje de bloques (visible en 3.ª persona)
const character = new THREE.Group();
{
  const skin = new THREE.MeshLambertMaterial({ color: 0xf2c184 });
  const shirt = new THREE.MeshLambertMaterial({ color: 0x2f6fd6 });
  const pants = new THREE.MeshLambertMaterial({ color: 0x2b2b44 });
  const hair = new THREE.MeshLambertMaterial({ color: 0x3a2314 });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), skin);
  head.position.y = 1.55;
  const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.14, 0.52), hair);
  hairTop.position.y = 1.84;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.3), shirt);
  torso.position.y = 1.04;
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.66, 0.2), shirt);
  armL.position.set(-0.39, 1.04, 0);
  const armR = armL.clone(); armR.position.x = 0.39;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.68, 0.24), pants);
  legL.position.set(-0.14, 0.34, 0);
  const legR = legL.clone(); legR.position.x = 0.14;
  character.add(head, hairTop, torso, armL, armR, legL, legR);
  character.userData = { armL, armR, legL, legR };
  character.visible = false;
  scene.add(character);
}
// pistola en primera persona
const gunModel = new THREE.Group();
{
  const dark = new THREE.MeshLambertMaterial({ color: 0x2c2f36 });
  const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.5), dark);
  barrel.position.set(0, 0.02, -0.1);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.1), dark);
  grip.position.set(0, -0.1, 0.08);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.02), new THREE.MeshLambertMaterial({ color: 0xffd23f }));
  sight.position.set(0, 0.1, -0.28);
  gunModel.add(barrel, grip, sight);
  gunModel.position.set(0.3, -0.26, -0.55);
  gunModel.visible = false;
  camera.add(gunModel);
  scene.add(camera);
}
let gunKick = 0;

// ---------------------------------------------------------------- rayo en voxels (DDA)
function raycastVoxel(origin, dir, maxDist) {
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const stepX = dir.x > 0 ? 1 : -1, stepY = dir.y > 0 ? 1 : -1, stepZ = dir.z > 0 ? 1 : -1;
  const tDeltaX = Math.abs(1 / (dir.x || 1e-9)), tDeltaY = Math.abs(1 / (dir.y || 1e-9)), tDeltaZ = Math.abs(1 / (dir.z || 1e-9));
  let tMaxX = tDeltaX * (dir.x > 0 ? (x + 1 - origin.x) : (origin.x - x));
  let tMaxY = tDeltaY * (dir.y > 0 ? (y + 1 - origin.y) : (origin.y - y));
  let tMaxZ = tDeltaZ * (dir.z > 0 ? (z + 1 - origin.z) : (origin.z - z));
  let nx = 0, ny = 0, nz = 0, t = 0;
  for (let i = 0; i < 128; i++) {
    if (tMaxX < tMaxY && tMaxX < tMaxZ) { x += stepX; t = tMaxX; tMaxX += tDeltaX; nx = -stepX; ny = 0; nz = 0; }
    else if (tMaxY < tMaxZ) { y += stepY; t = tMaxY; tMaxY += tDeltaY; nx = 0; ny = -stepY; nz = 0; }
    else { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; nx = 0; ny = 0; nz = -stepZ; }
    if (t > maxDist) return null;
    const b = getBlock(x, y, z);
    if (b !== B.AIR && b !== B.WATER) return { x, y, z, nx, ny, nz, dist: t, block: b }; // el agua no se apunta
  }
  return null;
}

// ---------------------------------------------------------------- HUD / UI
let walking = false;
const $ = (id) => document.getElementById(id);
const toastEl = $('toast');
let toastTimer = null;
function toast(msg, ms = 1600) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

let hearts = 10, maxHearts = 10, score = 0, lastHurtAt = 0;
function renderHearts() {
  let h = '';
  for (let i = 0; i < maxHearts; i++) h += i < hearts ? '❤️' : '🤍';
  $('hearts').innerHTML = h;
}
function renderScore() { $('score-num').textContent = score; }

let selectedSlot = 9; // la pistola (último hueco de la barra base)
function renderHotbar() {
  const bar = $('hotbar');
  bar.innerHTML = '';
  allSlots().forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'slot' + (i === selectedSlot ? ' selected' : '');
    d.style.background = s.color;
    const key = i < 9 ? i + 1 : (i === 9 ? 0 : '·');
    const cnt = s.item ? `<span class="cnt">${inv[s.item] || 0}</span>` : '';
    d.innerHTML = `<span class="key">${key}</span>${s.icon}<small>${s.name}</small>${cnt}`;
    d.addEventListener('pointerdown', (e) => { e.stopPropagation(); selectSlot(i); });
    bar.appendChild(d);
  });
  const sel = allSlots()[selectedSlot];
  $('ammo').style.display = sel && sel.kind === 'gun' ? 'block' : 'none';
  $('crosshair').style.display = sel && (sel.kind === 'gun' || sel.kind === 'hand') ? 'block' : 'none';
  renderAmmo();
  updateHandVisibility();
}
function selectSlot(i) {
  selectedSlot = ((i % allSlots().length) + allSlots().length) % allSlots().length;
  lastShotAt = 0; // cambiar de arma quita el enfriamiento del disparo
  renderHotbar();
}

// ---------------------------------------------------------------- pistola
let reloading = false, lastShotAt = 0;
const raycaster = new THREE.Raycaster();
function currentWeapon() { const s = allSlots()[selectedSlot]; return s && s.kind === 'gun' ? s.weapon : null; }
function currentAmmo() { const w = currentWeapon(); return w ? (ammoByWeapon[w.name] ?? w.ammo) : 0; }
function renderAmmo() { const w = currentWeapon(); $('ammo-num').textContent = w ? (reloading ? '…' : currentAmmo()) : '—'; }
function reload() {
  const w = currentWeapon();
  if (!w || reloading || currentAmmo() === w.ammo) return;
  reloading = true; renderAmmo(); sfx.reload();
  setTimeout(() => { ammoByWeapon[w.name] = w.ammo; reloading = false; renderAmmo(); }, 1100);
}
function shoot() {
  const w = currentWeapon();
  if (!w) return false;
  if (reloading) return false;
  const now = performance.now();
  if (now - lastShotAt < w.rate) return false;
  lastShotAt = now;
  if (currentAmmo() <= 0) { sfx.empty(); reload(); return false; }
  ammoByWeapon[w.name] = currentAmmo() - 1; renderAmmo();
  gunKick = 0.09;
  sfx.shoot();
  const origin = headPos(), dir = lookDir();
  // ¿monstruo? (rayo contra sus mallas)
  raycaster.set(origin, dir); raycaster.far = w.range;
  const mobHits = raycaster.intersectObjects(mobMeshes, false);
  const vox = raycastVoxel(origin, dir, w.range);
  let hitPoint = null;
  if (mobHits.length && (!vox || mobHits[0].distance < vox.dist)) {
    const mob = mobHits[0].object.userData.mob;
    hitPoint = mobHits[0].point;
    damageMob(mob, w.dmg, mobHits[0].point);
  } else if (vox) {
    hitPoint = origin.clone().add(dir.clone().multiplyScalar(vox.dist));
    if (vox.block === B.TNT) explode(vox.x, vox.y, vox.z);
    else spawnParticles(hitPoint, 0xffffff, 4);
  } else {
    hitPoint = origin.clone().add(dir.clone().multiplyScalar(w.range * 0.6));
  }
  spawnTracer(origin, hitPoint);
  if (w.splash) damageArea(hitPoint, w.splash, w.dmg);
  if (currentAmmo() === 0) reload();
  return true;
}
function damageArea(point, radius, dmg) {
  spawnParticles(point, 0xff7722, 20);
  spawnParticles(point, 0x555555, 10);
  sfx.explode();
  for (const m of mobs) if (m.alive && m.group.position.distanceTo(point) < radius) damageMob(m, dmg, m.group.position.clone().add(new THREE.Vector3(0, 1, 0)));
}
function explode(bx, by, bz) {
  setBlock(bx, by, bz, B.AIR);
  const R = 2;
  for (let x = bx - R; x <= bx + R; x++) for (let y = by - R; y <= by + R; y++) for (let z = bz - R; z <= bz + R; z++) {
    if (Math.abs(x - bx) + Math.abs(y - by) + Math.abs(z - bz) > R + 1) continue;
    if (y <= 0) continue;
    setBlock(x, y, z, B.AIR);
  }
  rebuildMesh(); saveWorld();
  const center = new THREE.Vector3(bx + 0.5, by + 0.5, bz + 0.5);
  spawnParticles(center, 0xff7722, 26);
  spawnParticles(center, 0x555555, 14);
  sfx.explode();
  for (const m of mobs) if (m.alive && m.group.position.distanceTo(center) < 5) damageMob(m, 5, center);
  if (player.pos.distanceTo(center) < 4) hurtPlayer(2);
  toast('💥 ¡BOOM!');
}

// trazador del disparo
let tracer = null, tracerUntil = 0;
function spawnTracer(from, to) {
  if (tracer) { scene.remove(tracer); tracer.geometry.dispose(); }
  const g = new THREE.BufferGeometry().setFromPoints([from, to]);
  tracer = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.9 }));
  scene.add(tracer);
  tracerUntil = performance.now() + 90;
}

// ---------------------------------------------------------------- partículas
const particles = [];
{
  const geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
  for (let i = 0; i < 40; i++) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    m.visible = false; scene.add(m);
    particles.push({ mesh: m, vel: new THREE.Vector3(), life: 0 });
  }
}
function spawnParticles(point, color, n) {
  let made = 0;
  for (const p of particles) {
    if (p.life > 0) continue;
    p.life = 0.5 + Math.random() * 0.4;
    p.mesh.visible = true;
    p.mesh.material.color.setHex(color);
    p.mesh.position.copy(point);
    p.vel.set((Math.random() - 0.5) * 6, Math.random() * 5 + 1, (Math.random() - 0.5) * 6);
    if (++made >= n) break;
  }
}
function updateParticles(dt) {
  for (const p of particles) {
    if (p.life <= 0) continue;
    p.life -= dt;
    if (p.life <= 0) { p.mesh.visible = false; continue; }
    p.vel.y -= 18 * dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    p.mesh.rotation.x += dt * 5; p.mesh.rotation.y += dt * 4;
  }
}

// ---------------------------------------------------------------- monstruos
const mobs = [];
const mobMeshes = [];
function makeMobMesh(kind) {
  const g = new THREE.Group();
  const body = kind === 'zombie'
    ? new THREE.MeshLambertMaterial({ color: 0x4da34d })
    : new THREE.MeshLambertMaterial({ color: 0xe8e8e0 });
  const dark = new THREE.MeshLambertMaterial({ color: 0x222226 });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), body);
  head.position.y = 1.55;
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), dark);
  eyeL.position.set(-0.11, 1.58, 0.26);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.11;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.3), kind === 'zombie' ? new THREE.MeshLambertMaterial({ color: 0x2e7f8f }) : body);
  torso.position.y = 1.04;
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.18), body);
  armL.position.set(-0.38, 1.15, 0.15); armL.rotation.x = -1.2;
  const armR = armL.clone(); armR.position.x = 0.38;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.68, 0.24), dark);
  legL.position.set(-0.14, 0.34, 0);
  const legR = legL.clone(); legR.position.x = 0.14;
  g.add(head, eyeL, eyeR, torso, armL, armR, legL, legR);
  g.userData = { armL, armR, legL, legR };
  return g;
}
function spawnMob(i) {
  const kind = i % 3 === 2 ? 'skeleton' : 'zombie';
  const m = mobs[i];
  // quitar las mallas viejas de este monstruo (si no, el rayo seguiría pegándoles)
  for (let j = mobMeshes.length - 1; j >= 0; j--) {
    if (mobMeshes[j].userData.mob === m) mobMeshes.splice(j, 1);
  }
  m.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  m.group.clear();
  const mesh = makeMobMesh(kind);
  m.group.add(mesh);
  m.hp = 3; m.alive = true; m.attackCd = 0; m.respawnAt = 0; m.wander = new THREE.Vector3();
  m.group.visible = true;
  // posición en un anillo alrededor del jugador (12-20 bloques)
  const ang = Math.random() * Math.PI * 2;
  const r = 12 + Math.random() * 8;
  let x = Math.max(2, Math.min(W - 3, player.pos.x + Math.cos(ang) * r));
  let z = Math.max(2, Math.min(D - 3, player.pos.z + Math.sin(ang) * r));
  m.group.position.set(x, topSolidY(Math.floor(x), Math.floor(z)), z);
  for (const c of mesh.children) { c.userData.mob = m; mobMeshes.push(c); }
}
for (let i = 0; i < 6; i++) {
  const g = new THREE.Group();
  scene.add(g);
  mobs.push({ group: g, hp: 3, alive: false, attackCd: 0, respawnAt: performance.now() + i * 1200, kind: 'zombie', wander: new THREE.Vector3() });
}
function damageMob(mob, dmg, point) {
  if (!mob.alive) return;
  mob.hp -= dmg;
  spawnParticles(point, 0xff4444, 8);
  if (mob.hp <= 0) {
    mob.alive = false;
    mob.group.visible = false;
    mob.respawnAt = performance.now() + 8000;
    spawnParticles(mob.group.position.clone().add(new THREE.Vector3(0, 1, 0)), 0x88ff88, 16);
    score++;
    renderScore();
    sfx.mobDie();
    toast('👾 ¡Monstruo derrotado! +' + 1);
  }
}
function updateMobs(dt, now) {
  for (let i = 0; i < mobs.length; i++) {
    const m = mobs[i];
    if (!m.alive) {
      if (now >= m.respawnAt) spawnMob(i);
      continue;
    }
    const p = m.group.position;
    const toPlayer = new THREE.Vector3(player.pos.x - p.x, 0, player.pos.z - p.z);
    const dist = toPlayer.length();
    let mx = 0, mz = 0;
    if (dist < 26 && dist > 0.01) { mx = toPlayer.x / dist; mz = toPlayer.z / dist; }
    else {
      if (m.wander.lengthSq() < 0.01 || Math.random() < 0.005) {
        m.wander.set(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize().multiplyScalar(0.5);
      }
      mx = m.wander.x; mz = m.wander.z;
    }
    const sp = dist < 26 ? 1.6 : 0.7;
    p.x += mx * sp * dt; p.z += mz * sp * dt;
    p.x = Math.max(1, Math.min(W - 2, p.x));
    p.z = Math.max(1, Math.min(D - 2, p.z));
    p.y = topSolidY(Math.floor(p.x), Math.floor(p.z));
    m.group.rotation.y = Math.atan2(mx, mz);
    const swing = Math.sin(now * 0.008) * 0.5;
    const inner = m.group.children[0];
    if (inner && inner.userData.legL) { inner.userData.legL.rotation.x = swing; inner.userData.legR.rotation.x = -swing; }
    if (dist < 1.6) {
      m.attackCd -= dt;
      if (m.attackCd <= 0) { m.attackCd = 1.0; hurtPlayer(1); }
    }
  }
}
function hurtPlayer(n) {
  const now = performance.now();
  if (now - lastHurtAt < 400) return;
  lastHurtAt = now;
  hearts = Math.max(0, hearts - n);
  renderHearts();
  sfx.hurt();
  if (hearts <= 0) {
    hearts = maxHearts; renderHearts();
    player.pos.set(W / 2 + 0.5, topSolidY(W / 2, D / 2) + 0.1, D / 2 + 0.5);
    player.vel.set(0, 0, 0);
    toast('💥 ¡Te atraparon! Vuelves a empezar', 2500);
  }
}

// ---------------------------------------------------------------- poder: Super Salto
const superJump = { active: false, until: 0, cooldownUntil: 0 };
function usePower() {
  const now = performance.now();
  if (now < superJump.cooldownUntil) return false;
  superJump.active = true;
  superJump.until = now + 6000;
  superJump.cooldownUntil = now + 10000;
  sfx.power();
  toast('⚡ ¡SUPER SALTO! Salta muy alto 6 s', 2000);
  return true;
}
function updatePower(now) {
  if (superJump.active && now > superJump.until) superJump.active = false;
  const btn = $('btn-power');
  const cooling = now < superJump.cooldownUntil;
  btn.classList.toggle('cooling', cooling);
  btn.classList.toggle('ready', !cooling);
  btn.textContent = superJump.active ? '⚡ ¡SUPER SALTO!' : cooling ? '⚡ Cargando…' : '⚡ Poder';
}

// ---------------------------------------------------------------- romper / poner bloques
function currentTarget(maxDist = 6) {
  const origin = headPos(), dir = lookDir();
  const vox = raycastVoxel(origin, dir, maxDist);
  return vox;
}
function updateHighlight() {
  const vox = currentTarget();
  if (vox && state === 'playing') {
    highlight.visible = true;
    highlight.position.set(vox.x + 0.5, vox.y + 0.5, vox.z + 0.5);
  } else highlight.visible = false;
}
function breakBlock(maxDist = 6) {
  const vox = currentTarget(maxDist);
  if (!vox) return false;
  if (vox.block === B.TNT) { explode(vox.x, vox.y, vox.z); return true; }
  dropForBlock(vox.block, vox.x + 0.5, vox.y + 0.5, vox.z + 0.5);
  setBlock(vox.x, vox.y, vox.z, B.AIR);
  rebuildMesh(); saveWorld(); sfx.break();
  spawnParticles(new THREE.Vector3(vox.x + 0.5, vox.y + 0.5, vox.z + 0.5), 0xaaaaaa, 6);
  return true;
}
function placeBlock() {
  const slot = allSlots()[selectedSlot];
  if (!slot || slot.kind !== 'block') return false;
  if (slot.item && (inv[slot.item] || 0) <= 0) { toast(`No te quedan ${slot.name.toLowerCase()}s, crea más en 🔨 Crafteo`); return false; }
  const vox = currentTarget();
  if (!vox) return false;
  const x = vox.x + vox.nx, y = vox.y + vox.ny, z = vox.z + vox.nz;
  if (!inBounds(x, y, z) || getBlock(x, y, z) !== B.AIR) return false;
  // no poner el bloque dentro del jugador
  const p = player.pos;
  if (x + 1 > p.x - 0.3 && x < p.x + 0.3 && z + 1 > p.z - 0.3 && z < p.z + 0.3 && y + 1 > p.y && y < p.y + 1.8) return false;
  setBlock(x, y, z, slot.id);
  if (slot.item) { inv[slot.item]--; saveWorld(); renderHotbar(); if (state === 'inventory') renderInventory(); }
  rebuildMesh(); saveWorld(); sfx.place();
  return true;
}
function punch() {
  handSwing = 0.22;
  beep(200, 120, 0.08, 'square', 0.1);
  // puñetazo a un monstruo de cerca
  const origin = headPos(), dir = lookDir();
  for (const m of mobs) {
    if (!m.alive) continue;
    const to = m.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)).sub(origin);
    const d = to.length();
    if (d < 2.6 && to.normalize().dot(dir) > 0.75) {
      damageMob(m, 1, m.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)));
      return true;
    }
  }
  return breakBlock(3); // si no hay monstruo, rompe el bloque apuntado
}
function primaryAction() {
  const s = allSlots()[selectedSlot];
  if (s.kind === 'gun') shoot();
  else if (s.kind === 'hand') punch();
  else breakBlock();
}

// ---------------------------------------------------------------- guardar / cargar
let saveTimer = null;
function saveWorld() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ seed: worldSeed, modified, inv })); } catch (e) { /* sin almacenamiento */ }
  }, 300);
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.seed) worldSeed = d.seed;
    Object.assign(modified, d.modified || {});
    Object.assign(inv, d.inv || {});
  } catch (e) { /* ignorar */ }
}

// ---------------------------------------------------------------- entrada: teclado y ratón
const keys = {};
let state = 'menu'; // 'menu' | 'playing' | 'paused'
const input = { forward: false, back: false, left: false, right: false, jump: false };
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
if (isTouch) document.body.classList.add('touch');

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'Escape' && state === 'inventory') { closeInventory(); return; }
  if (state !== 'playing') return;
  if (e.code === 'Space') { input.jump = true; e.preventDefault(); }
  if (e.code === 'KeyF') setCameraMode(cameraMode === 'first' ? 'third' : 'first');
  if (e.code === 'KeyQ') usePower();
  if (e.code === 'KeyR') reload();
  if (e.code === 'KeyB') openInventory();
  if (e.code === 'KeyE') { if (driving) exitVehicle(); else if (!tryEnterVehicle()) openInventory(); }
  if (/^Digit[1-9]$/.test(e.code)) selectSlot(parseInt(e.code.slice(5), 10) - 1);
  if (e.code === 'Digit0') selectSlot(9);
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  if (e.code === 'Space') input.jump = false;
});
function syncKeys() {
  input.forward = !!(keys['KeyW'] || keys['ArrowUp']);
  input.back = !!(keys['KeyS'] || keys['ArrowDown']);
  input.left = !!(keys['KeyA'] || keys['ArrowLeft']);
  input.right = !!(keys['KeyD'] || keys['ArrowRight']);
  if (joy.active) {
    input.forward = input.forward || joy.y < -0.25;
    input.back = input.back || joy.y > 0.25;
    input.left = input.left || joy.x < -0.25;
    input.right = input.right || joy.x > 0.25;
  }
}
canvas.addEventListener('mousedown', (e) => {
  if (state !== 'playing') return;
  if (!isTouch && document.pointerLockElement !== canvas) { lockPointer(); return; }
  if (e.button === 0) primaryAction();
  else if (e.button === 2) placeBlock();
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('mousemove', (e) => {
  if (state !== 'playing' || document.pointerLockElement !== canvas) return;
  player.yaw -= e.movementX * 0.0025;
  player.pitch -= e.movementY * 0.0025;
  player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch));
});
document.addEventListener('pointerlockchange', () => {
  if (state === 'playing' && !isTouch && document.pointerLockElement !== canvas && !document.hidden) {
    pauseGame();
  }
});
canvas.addEventListener('wheel', (e) => {
  if (state !== 'playing') return;
  selectSlot(selectedSlot + (e.deltaY > 0 ? 1 : -1));
  e.preventDefault();
}, { passive: false });

// ---------------------------------------------------------------- entrada táctil
const joy = { active: false, id: null, x: 0, y: 0 };
const joyEl = $('joystick'), stickEl = $('stick');
let lookTouch = { id: null, lx: 0, ly: 0 };
function joyCenter() {
  const r = joyEl.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
joyEl.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.changedTouches[0];
  joy.active = true; joy.id = t.identifier;
}, { passive: false });
window.addEventListener('touchmove', (e) => {
  for (const t of e.changedTouches) {
    if (joy.active && t.identifier === joy.id) {
      const c = joyCenter();
      let dx = (t.clientX - c.x) / 45, dy = (t.clientY - c.y) / 45;
      const l = Math.hypot(dx, dy);
      if (l > 1) { dx /= l; dy /= l; }
      joy.x = dx; joy.y = dy;
      stickEl.style.transform = `translate(calc(-50% + ${dx * 32}px), calc(-50% + ${dy * 32}px))`;
    } else if (lookTouch.id === t.identifier) {
      player.yaw -= (t.clientX - lookTouch.lx) * 0.005;
      player.pitch -= (t.clientY - lookTouch.ly) * 0.005;
      player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch));
      lookTouch.lx = t.clientX; lookTouch.ly = t.clientY;
    }
  }
  if (state === 'playing') e.preventDefault();
}, { passive: false });
window.addEventListener('touchend', (e) => {
  for (const t of e.changedTouches) {
    if (joy.active && t.identifier === joy.id) {
      joy.active = false; joy.x = 0; joy.y = 0;
      stickEl.style.transform = 'translate(-50%, -50%)';
    }
    if (lookTouch.id === t.identifier) lookTouch.id = null;
  }
});
canvas.addEventListener('touchstart', (e) => {
  if (state !== 'playing') return;
  for (const t of e.changedTouches) {
    const r = joyEl.getBoundingClientRect();
    if (t.clientX >= r.left - 10 && t.clientX <= r.right + 10 && t.clientY >= r.top - 10 && t.clientY <= r.bottom + 10) continue;
    if (lookTouch.id === null) { lookTouch.id = t.identifier; lookTouch.lx = t.clientX; lookTouch.ly = t.clientY; }
  }
  e.preventDefault();
}, { passive: false });
function bindHold(id, down, up) {
  const el = $(id);
  el.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); down(); }, { passive: false });
  if (up) el.addEventListener('touchend', (e) => { e.preventDefault(); up(); }, { passive: false });
}
bindHold('tb-jump', () => { input.jump = true; setTimeout(() => { input.jump = false; }, 180); });
bindHold('tb-break', () => breakBlock());
bindHold('tb-place', () => placeBlock());
bindHold('tb-shoot', () => shoot());
bindHold('tb-inv', () => { if (state === 'playing') openInventory(); });
bindHold('tb-car', () => { if (state === 'playing') { if (driving) exitVehicle(); else tryEnterVehicle(); } });

// ---------------------------------------------------------------- botones HUD y pantallas
$('btn-inventory').addEventListener('click', () => { if (state === 'playing') openInventory(); });
$('btn-vehicle').addEventListener('click', () => { if (state === 'playing') { if (driving) exitVehicle(); else tryEnterVehicle(); } });
$('btn-inv-close').addEventListener('click', () => closeInventory());
$('tab-inv').addEventListener('click', () => showInvTab('inv'));
$('tab-craft').addEventListener('click', () => showInvTab('craft'));
$('btn-camera').addEventListener('click', () => { if (state === 'playing') setCameraMode(cameraMode === 'first' ? 'third' : 'first'); });
$('btn-power').addEventListener('click', () => { if (state === 'playing') usePower(); });
$('btn-sound').addEventListener('click', () => {
  soundOn = !soundOn;
  $('btn-sound').textContent = soundOn ? '🔊' : '🔇';
});
$('btn-pause').addEventListener('click', () => { if (state === 'playing') pauseGame(); });
$('btn-play').addEventListener('click', () => startGame());
$('btn-how').addEventListener('click', () => {
  const h = $('how');
  h.hidden = !h.hidden;
});
$('btn-resume').addEventListener('click', () => resumeGame());
$('btn-new-world').addEventListener('click', () => {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  for (const k of Object.keys(modified)) delete modified[k];
  worldSeed = Math.floor(Math.random() * 100000);
  generateWorld(); rebuildMesh();
  resetPlayer();
  $('pause-screen').hidden = true;
  state = 'playing';
  lockPointer();
  toast('🌍 ¡Mundo nuevo!');
});
$('btn-quit').addEventListener('click', () => {
  $('pause-screen').hidden = true;
  $('start-screen').hidden = false;
  state = 'menu';
  updateHUDVisibility();
  if (document.pointerLockElement) document.exitPointerLock();
});

function lockPointer() {
  if (isTouch) return;
  try {
    const r = canvas.requestPointerLock();
    if (r && r.catch) r.catch(() => {});
  } catch (e) { /* sin pointer lock (p. ej. headless) */ }
}
function resetPlayer() {
  player.pos.set(W / 2 + 0.5, topSolidY(W / 2, D / 2) + 0.1, D / 2 + 0.5);
  player.vel.set(0, 0, 0);
  player.yaw = Math.PI * 0.25; player.pitch = -0.05;
  hearts = maxHearts; renderHearts();
}
function updateHUDVisibility() {
  const show = state !== 'menu';
  const map = [['hud-top', 'flex'], ['hud-buttons', 'flex'], ['ammo', 'block'], ['hotbar', 'flex'], ['crosshair', 'block']];
  for (const [id, disp] of map) $(id).style.display = show ? disp : 'none';
  $('touch-ui').style.display = (show && isTouch) ? 'block' : 'none';
  $('inventory-screen').hidden = state !== 'inventory';
  // la munición y la mira solo se ven con la pistola (o la mano)
  if (show) renderHotbar();
}
function startGame() {
  ac();
  $('start-screen').hidden = true;
  $('pause-screen').hidden = true;
  state = 'playing';
  updateHUDVisibility();
  lockPointer();
  toast('¡A jugar! ⛏🔫', 2000);
}
function pauseGame() {
  if (state !== 'playing') return;
  state = 'paused';
  $('pause-screen').hidden = false;
  if (document.pointerLockElement) document.exitPointerLock();
}
function resumeGame() {
  $('pause-screen').hidden = true;
  state = 'playing';
  lockPointer();
}

// ---------------------------------------------------------------- bucle principal
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const now = performance.now();
  if (state === 'playing') {
    syncKeys();
    if (driving) updateVehicle(dt, input);
    else updatePlayer(dt, input);
    updateMobs(dt, now);
    updateNPCs(dt, now);
    updatePickups(dt);
    updatePower(now);
    updateHighlight();
    $('water-overlay').classList.toggle('on', headUnderWater());
    updateVehicleHUD();
    // regenerar 1 corazón cada 8 s si no te han pegado
    if (hearts < maxHearts && now - lastHurtAt > 8000) {
      hearts = Math.min(maxHearts, hearts + 1);
      renderHearts();
      lastHurtAt = now;
    }
    if (tracer && now > tracerUntil) { scene.remove(tracer); tracer.geometry.dispose(); tracer = null; }
  }
  // personaje (3.ª persona) sigue al jugador
  character.position.copy(player.pos);
  character.rotation.y = player.yaw;
  const swing = walking && state === 'playing' ? Math.sin(now * 0.012) * 0.6 : 0;
  character.userData.legL.rotation.x = swing;
  character.userData.legR.rotation.x = -swing;
  character.userData.armL.rotation.x = -swing;
  character.userData.armR.rotation.x = swing;
  if (handSwing > 0) { // animación del puñetazo
    handSwing -= dt;
    const k = Math.sin(Math.max(0, handSwing) / 0.22 * Math.PI);
    if (handGroup) { handGroup.position.z = -0.75 - k * 0.18; handGroup.rotation.x = -k * 0.7; }
  } else if (handGroup) { handGroup.position.z = -0.75; handGroup.rotation.x = 0; }
  if (gunKick > 0) { gunKick = Math.max(0, gunKick - dt * 0.5); gunModel.position.z = -0.55 + gunKick; }
  for (const c of clouds) {
    c.position.x += dt * 0.6;
    if (c.position.x > W + 10) c.position.x = -10;
  }
  updateParticles(dt);
  updateCamera();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------- inicio
loadSave();
generateWorld();
rebuildMesh();
resetPlayer();
renderHearts();
renderScore();
renderHotbar();
renderAmmo();
updateHUDVisibility();
updateCamera();
animate();

// ---------------------------------------------------------------- v2: agua
function blockAtPos(x, y, z) { return getBlock(Math.floor(x), Math.floor(y), Math.floor(z)); }
function isInWater() {
  return blockAtPos(player.pos.x, player.pos.y + 0.4, player.pos.z) === B.WATER
      || blockAtPos(player.pos.x, player.pos.y + 1.4, player.pos.z) === B.WATER;
}
function headUnderWater() { return blockAtPos(player.pos.x, player.pos.y + player.eye, player.pos.z) === B.WATER; }

// ---------------------------------------------------------------- v2: mano visible en 1.ª persona
{
  const skin = new THREE.MeshLambertMaterial({ color: 0xf2c184 });
  handGroup = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.3), skin);
  palm.rotation.x = -0.35;
  const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.16), skin);
  thumb.position.set(-0.09, 0.03, -0.05);
  heldBlock = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), new THREE.MeshLambertMaterial({ color: 0xffffff }));
  heldBlock.position.set(0, 0.12, -0.14);
  handGroup.add(palm, thumb, heldBlock);
  handGroup.position.set(0.36, -0.34, -0.75);
  handGroup.scale.setScalar(0.8);
  handGroup.visible = false;
  camera.add(handGroup);
}
function updateHandVisibility() {
  if (!handGroup) return;
  const s = allSlots()[selectedSlot];
  const showHand = cameraMode === 'first' && !driving && s && s.kind !== 'gun';
  handGroup.visible = showHand;
  gunModel.visible = cameraMode === 'first' && !driving && s && s.kind === 'gun';
  if (heldBlock) {
    heldBlock.visible = showHand && s.kind === 'block';
    if (heldBlock.visible) {
      const def = BLOCK_DEFS[s.id];
      heldBlock.material.color.setRGB(def.side[0], def.side[1], def.side[2]);
    }
  }
}

// ---------------------------------------------------------------- v2: objetos y crafteo
const ITEMS = {
  madera: { name: 'Madera', icon: '🪵', color: '#8a5f3c', where: 'Rompe árboles en el bosque 🌲 (al oeste)' },
  piedra: { name: 'Piedra', icon: '🪨', color: '#8d8d92', where: 'Rompe bloques de piedra en las montañas ⛰️' },
  roca: { name: 'Roca', icon: '🪨', color: '#6f6f74', where: 'Al romper piedra a veces cae una roca' },
  arena: { name: 'Arena', icon: '⏳', color: '#dbc28a', where: 'En la playa, junto al mar 🏖️ (al este)' },
  hojas: { name: 'Hojas', icon: '🍃', color: '#3f9e3f', where: 'Rompe las hojas de los árboles 🌳' },
  cristal: { name: 'Cristal', icon: '🔷', color: '#bfe0f2', where: 'Rompe ventanas en las casas de la ciudad 🏠, o crea con 2 de arena' },
  tierra: { name: 'Tierra', icon: '🟫', color: '#8a5f3c', where: 'Rompe bloques de tierra' },
  pico: { name: 'Pico', icon: '⛏️', color: '#9aa0a6', tool: true, where: 'Se crea en el crafteo' },
  puerta: { name: 'Puerta', icon: '🚪', color: '#7a5230', block: B.DOOR, where: 'Se crea en el crafteo' },
  ventana: { name: 'Ventana', icon: '🪟', color: '#bfe0f2', block: B.WINDOW, where: 'Se crea en el crafteo' },
  tv: { name: 'TV plasma', icon: '📺', color: '#22242a', block: B.TV, where: 'Se crea en el crafteo' },
  computadora: { name: 'Computadora', icon: '💻', color: '#3a3f4a', block: B.COMPUTER, where: 'Se crea en el crafteo' },
  fogata: { name: 'Fogata', icon: '🔥', color: '#ff7722', block: B.FIRE, where: 'Se crea en el crafteo' },
  francotirador: { name: 'Francotirador', icon: '🎯', color: '#2f4a2f', weapon: { name: 'Francotirador', dmg: 3, ammo: 5, rate: 900, range: 100, splash: 0 }, where: 'Se crea en el crafteo' },
  ametralladora: { name: 'Ametralladora', icon: '🔫', color: '#3a3f4a', weapon: { name: 'Ametralladora', dmg: 1, ammo: 30, rate: 90, range: 50, splash: 0 }, where: 'Se crea en el crafteo' },
  lanzacohetes: { name: 'Lanza cohetes', icon: '🚀', color: '#5a2f2f', weapon: { name: 'Lanza cohetes', dmg: 5, ammo: 3, rate: 1500, range: 80, splash: 4 }, where: 'Se crea en el crafteo' },
};
const RECIPES = [
  { id: 'pico', needs: { madera: 2, piedra: 3 }, desc: 'Rompe más rápido y da el doble de materiales' },
  { id: 'puerta', needs: { madera: 6 }, desc: 'Puerta de madera para tu casa (se puede poner)' },
  { id: 'ventana', needs: { cristal: 4 }, desc: 'Ventana de cristal (se puede poner)' },
  { id: 'tv', needs: { cristal: 4, piedra: 3, madera: 2 }, desc: 'Televisión de plasma para tu casa (se puede poner)' },
  { id: 'computadora', needs: { cristal: 3, piedra: 4, madera: 2 }, desc: 'Computadora para tu casa (se puede poner)' },
  { id: 'fogata', needs: { madera: 3, piedra: 2 }, desc: 'Fuego para calentarte de noche (se puede poner)' },
  { id: 'cristal', needs: { arena: 2 }, desc: '1 cristal hecho con arena' },
  { id: 'francotirador', needs: { madera: 3, piedra: 4, cristal: 2 }, desc: '5 balas, mucho daño, mucho alcance' },
  { id: 'ametralladora', needs: { madera: 4, piedra: 5, roca: 2 }, desc: '30 balas, dispara muy rápido' },
  { id: 'lanzacohetes', needs: { piedra: 5, roca: 3, cristal: 2 }, desc: '3 cohetes, daño en área' },
];
function addItem(id, n) {
  inv[id] = (inv[id] || 0) + n;
  saveWorld();
  if (state === 'inventory') renderInventory();
}
function hasItems(needs) { return Object.entries(needs).every(([id, n]) => (inv[id] || 0) >= n); }
function missingFor(needs) { return Object.entries(needs).filter(([id, n]) => (inv[id] || 0) < n).map(([id, n]) => ({ id, need: n, have: inv[id] || 0 })); }
function ensureExtraSlot(itemId) {
  const def = ITEMS[itemId];
  if (!def) return -1;
  let i = extraSlots.findIndex((s) => s.item === itemId);
  if (i >= 0) return HOTBAR.length + i;
  if (def.block) extraSlots.push({ kind: 'block', id: def.block, name: def.name, icon: def.icon, color: def.color, item: itemId });
  else if (def.weapon) extraSlots.push({ kind: 'gun', name: def.name, icon: def.icon, color: def.color, weapon: def.weapon, item: itemId });
  else return -1;
  renderHotbar();
  return HOTBAR.length + extraSlots.length - 1;
}
function craft(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return false;
  if (!hasItems(r.needs)) {
    const miss = missingFor(r.needs).map((m) => `${ITEMS[m.id].name} (${m.have}/${m.need})`).join(', ');
    toast(`🔒 Te falta: ${miss}`);
    return false;
  }
  for (const [mid, n] of Object.entries(r.needs)) inv[mid] -= n;
  addItem(id, 1);
  if (ITEMS[id].block || ITEMS[id].weapon) ensureExtraSlot(id);
  if (ITEMS[id].weapon) ammoByWeapon[ITEMS[id].weapon.name] = ITEMS[id].weapon.ammo;
  beep(660, 660, 0.08, 'sine', 0.14); setTimeout(() => beep(880, 880, 0.12, 'sine', 0.14), 90);
  toast(`✅ ¡Creaste ${ITEMS[id].name}!`);
  if (state === 'inventory') renderInventory();
  renderHotbar();
  return true;
}

// ---------------------------------------------------------------- v2: inventario (mochila) y crafteo
let invTab = 'inv';
function openInventory() {
  if (state !== 'playing') return;
  state = 'inventory';
  if (document.pointerLockElement) document.exitPointerLock();
  renderInventory();
  updateHUDVisibility();
}
function closeInventory() {
  if (state !== 'inventory') return;
  state = 'playing';
  updateHUDVisibility();
  lockPointer();
}
function showInvTab(t) {
  invTab = t;
  $('tab-inv').classList.toggle('active', t === 'inv');
  $('tab-craft').classList.toggle('active', t === 'craft');
  $('inv-grid').hidden = t !== 'inv';
  $('craft-grid').hidden = t !== 'craft';
}
function renderInventory() {
  const grid = $('inv-grid');
  grid.innerHTML = '';
  const ids = Object.keys(inv).filter((id) => inv[id] > 0).sort();
  if (!ids.length) grid.innerHTML = '<p class="inv-empty">La mochila está vacía.<br>Rompe bloques (árboles, piedra, arena) y camina encima de lo que cae para recogerlo. 🌲🪨🏖️</p>';
  for (const id of ids) {
    const def = ITEMS[id]; if (!def) continue;
    const d = document.createElement('div');
    d.className = 'inv-slot';
    const usable = def.block || def.weapon;
    d.innerHTML = `<span class="ico">${def.icon}</span><span class="nm">${def.name}</span><span class="cnt">×${inv[id]}</span>` +
      (usable ? `<button class="use">Usar</button>` : def.tool ? `<div class="owned">✓ Activo</div>` : '');
    const btn = d.querySelector('.use');
    if (btn) btn.addEventListener('click', () => {
      const slot = ensureExtraSlot(id);
      if (slot >= 0) { selectSlot(slot); closeInventory(); toast(`${def.icon} ${def.name} en la mano`); }
    });
    grid.appendChild(d);
  }
  const cg = $('craft-grid');
  cg.innerHTML = '';
  for (const r of RECIPES) {
    const def = ITEMS[r.id];
    const ok = hasItems(r.needs);
    const miss = missingFor(r.needs);
    const needsHtml = Object.entries(r.needs).map(([mid, n]) => {
      const have = inv[mid] || 0;
      return `<div class="${have >= n ? 'have' : 'miss'}">${ITEMS[mid].icon} ${ITEMS[mid].name}: ${have}/${n}</div>`;
    }).join('');
    const whereHtml = miss.length ? `<span class="where">🔎 Falta: ${miss.map((m) => `${ITEMS[m.id].name} — ${ITEMS[m.id].where}`).join('<br>')}</span>` : '';
    const d = document.createElement('div');
    d.className = 'recipe' + (ok ? '' : ' locked');
    d.innerHTML = `${ok ? '' : '<span class="lock">🔒</span>'}<span class="ico">${def.icon}</span><span class="nm">${def.name}</span><span class="desc">${r.desc}</span><div class="needs">${needsHtml}</div>${whereHtml}<button class="make">${ok ? 'Crear' : 'Bloqueado 🔒'}</button>`;
    d.querySelector('.make').addEventListener('click', () => {
      if (craft(r.id)) renderInventory();
      else {
        const m = missingFor(r.needs);
        toast(`🔒 Te falta: ${m.map((x) => ITEMS[x.id].name).join(', ')} — ${ITEMS[m[0].id].where}`);
      }
    });
    cg.appendChild(d);
  }
  showInvTab(invTab);
}

// ---------------------------------------------------------------- v2: recoger objetos del suelo
const pickups = [];
const DROP_MAP = {
  [B.WOOD]: { item: 'madera', n: 2 },
  [B.STONE]: { item: 'piedra', n: 1 },
  [B.SAND]: { item: 'arena', n: 1 },
  [B.LEAVES]: { item: 'hojas', n: 1 },
  [B.GLASS]: { item: 'cristal', n: 1 },
  [B.WINDOW]: { item: 'cristal', n: 1 },
  [B.DIRT]: { item: 'tierra', n: 1 },
  [B.GRASS]: { item: 'tierra', n: 1 },
  [B.DOOR]: { item: 'puerta', n: 1 },
  [B.TV]: { item: 'tv', n: 1 },
  [B.COMPUTER]: { item: 'computadora', n: 1 },
  [B.FIRE]: { item: 'fogata', n: 1 },
};
function dropForBlock(blockId, x, y, z) {
  const d = DROP_MAP[blockId];
  const mult = inv.pico > 0 ? 2 : 1; // el pico da el doble
  if (d) spawnPickup(x, y, z, d.item, d.n * mult);
  if (blockId === B.STONE && Math.random() < 0.35) spawnPickup(x, y, z, 'roca', 1); // a veces cae una roca
}
function spawnPickup(x, y, z, item, count) {
  if (pickups.length >= 24) return;
  const def = ITEMS[item]; if (!def) return;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.32, 0.32),
    new THREE.MeshLambertMaterial({ color: new THREE.Color(def.color) })
  );
  mesh.position.set(x, y + 0.2, z);
  scene.add(mesh);
  pickups.push({ mesh, item, count, life: 30, baseY: y + 0.2, phase: Math.random() * 6 });
}
function updatePickups(dt) {
  const now = performance.now() / 1000;
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i];
    p.life -= dt;
    if (p.life <= 0) { scene.remove(p.mesh); p.mesh.geometry.dispose(); pickups.splice(i, 1); continue; }
    p.mesh.position.y = p.baseY + Math.sin(now * 2 + p.phase) * 0.12;
    p.mesh.rotation.y += dt * 2;
    const d = p.mesh.position.distanceTo(player.pos.clone().add(new THREE.Vector3(0, 1, 0)));
    if (d < 1.6) { // radio generoso: recoger es fácil para un niño
      addItem(p.item, p.count);
      beep(880, 880, 0.07, 'sine', 0.12);
      toast(`${ITEMS[p.item].icon} +${p.count} ${ITEMS[p.item].name}`);
      scene.remove(p.mesh); p.mesh.geometry.dispose();
      pickups.splice(i, 1);
    }
  }
}

// ---------------------------------------------------------------- v2: vehículos
const vehicles = [];
function makeCarMesh(color) {
  const g = new THREE.Group();
  const body = new THREE.MeshLambertMaterial({ color });
  const dark = new THREE.MeshLambertMaterial({ color: 0x222226 });
  const glass = new THREE.MeshLambertMaterial({ color: 0x9ec3e8 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 3.2), body);
  base.position.y = 0.55;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.6), glass);
  cabin.position.set(0, 1.05, 0.1);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 1.6), body);
  roof.position.set(0, 1.32, 0.1);
  g.add(base, cabin, roof);
  for (const [wx, wz] of [[-0.8, -1.1], [0.8, -1.1], [-0.8, 1.1], [0.8, 1.1]]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.55, 0.55), dark);
    w.position.set(wx, 0.28, wz);
    g.add(w);
  }
  for (const lx of [-0.5, 0.5]) {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.06), new THREE.MeshLambertMaterial({ color: 0xffe27a }));
    light.position.set(lx, 0.6, -1.62);
    g.add(light);
  }
  return g;
}
function makeMotoMesh(color) {
  const g = new THREE.Group();
  const body = new THREE.MeshLambertMaterial({ color });
  const dark = new THREE.MeshLambertMaterial({ color: 0x222226 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 1.9), body);
  frame.position.y = 0.75;
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.7), dark);
  seat.position.set(0, 0.95, 0.5);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.08), dark);
  bar.position.set(0, 1.05, -0.8);
  g.add(frame, seat, bar);
  for (const wz of [-0.75, 0.75]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.55), dark);
    w.position.set(0, 0.28, wz);
    g.add(w);
  }
  return g;
}
function addVehicle(type, color, x, z, heading) {
  const group = type === 'car' ? makeCarMesh(color) : makeMotoMesh(color);
  group.position.set(x, topSolidY(Math.floor(x), Math.floor(z)), z);
  group.rotation.y = heading;
  scene.add(group);
  const v = { type, group, heading, speed: 0, maxSpeed: type === 'car' ? 12 : 16 };
  vehicles.push(v);
  return v;
}
function initVehicles() {
  addVehicle('car', 0xd62f2f, 32.5, 20, 0);
  addVehicle('car', 0x2f6fd6, 40.5, 28, Math.PI / 2);
  addVehicle('car', 0xf2d16b, 32.5, 44, Math.PI);
  addVehicle('moto', 0x4da34d, 40.5, 16, 0);
  addVehicle('moto', 0x9b59b6, 32.5, 36, Math.PI / 2);
}
function nearestVehicle(maxDist = 3) {
  let best = null, bd = maxDist;
  for (const v of vehicles) {
    const d = v.group.position.distanceTo(player.pos);
    if (d < bd) { bd = d; best = v; }
  }
  return best;
}
function tryEnterVehicle() {
  if (driving) return false;
  const v = nearestVehicle(3);
  if (!v) return false;
  driving = v;
  prevCameraMode = cameraMode;
  character.visible = false;
  setCameraMode('third');
  beep(300, 500, 0.15, 'square', 0.12);
  toast(v.type === 'car' ? '🚗 ¡Manejando! W acelerar, A/D girar, E para bajar' : '🏍️ ¡En la moto! W acelerar, A/D girar, E para bajar', 2500);
  return true;
}
function exitVehicle() {
  if (!driving) return false;
  const v = driving;
  driving = null;
  const sx = v.group.position.x + Math.cos(v.heading) * 2;
  const sz = v.group.position.z - Math.sin(v.heading) * 2;
  player.pos.set(sx, topSolidY(Math.floor(sx), Math.floor(sz)) + 0.1, sz);
  player.vel.set(0, 0, 0);
  setCameraMode(prevCameraMode);
  toast('🚶 Bajaste del vehículo');
  return true;
}
function updateVehicle(dt, input) {
  const v = driving;
  if (!v) return;
  if (input.forward) v.speed += 9 * dt;
  if (input.back) v.speed -= 12 * dt;
  if (!input.forward && !input.back) v.speed *= Math.max(0, 1 - 1.4 * dt);
  v.speed = Math.max(-4, Math.min(v.maxSpeed, v.speed));
  if (Math.abs(v.speed) > 0.5) {
    const steer = (input.left ? 1 : 0) - (input.right ? 1 : 0);
    v.heading += steer * 1.7 * dt * Math.sign(v.speed);
  }
  const fx = -Math.sin(v.heading), fz = -Math.cos(v.heading);
  const nx = v.group.position.x + fx * v.speed * dt;
  const nz = v.group.position.z + fz * v.speed * dt;
  const gy = topSolidY(Math.floor(nx), Math.floor(nz));
  const ax = nx + fx * 1.9, az = nz + fz * 1.9; // punto delante del vehículo
  if (nx < 1 || nx > W - 2 || nz < 1 || nz > D - 2 || solidAt(ax, gy + 0.5, az) || solidAt(ax, gy + 1.2, az)) {
    v.speed = 0; // choca con una pared o sale del mundo
  } else {
    v.group.position.x = nx;
    v.group.position.z = nz;
    v.group.position.y = gy;
  }
  v.group.rotation.y = v.heading;
  player.pos.set(v.group.position.x, v.group.position.y, v.group.position.z);
  player.vel.set(0, 0, 0);
}
let vehicleHudTick = 0;
function updateVehicleHUD() {
  const hud = $('vehicle-hud');
  if (!driving) { hud.hidden = true; return; }
  hud.hidden = false;
  if (++vehicleHudTick % 6 === 0) $('vehicle-speed').textContent = Math.round(Math.abs(driving.speed) * 3);
}

// ---------------------------------------------------------------- v2: gente (NPCs)
const npcs = [];
const NPC_DEFS = [
  { name: 'Nacho', job: 'constructor', color: 0x2f6fd6, home: [34, 20], type: 'bueno', greet: '¡Hola! Soy Nacho, constructor 🏗️ ¿Te ayudo a construir?' },
  { name: 'Dagar', job: 'piloto', color: 0xd62f2f, home: [42, 20], type: 'bueno', greet: '¡Hola! Soy Dagar, piloto ✈️ ¡Algún día volaremos!' },
  { name: 'Lucía', job: 'doctora', color: 0xe8a0c0, home: [34, 28], type: 'bueno', greet: '¡Hola! Soy Lucía, doctora 🩺 ¿Te sientes bien?' },
  { name: 'Carlos', job: 'panadero', color: 0xf2d16b, home: [42, 28], type: 'bueno', greet: '¡Hola! Soy Carlos, panadero 🍞 ¡El pan está caliente!' },
  { name: 'Marta', job: 'maestra', color: 0x7a4fd6, home: [34, 36], type: 'bueno', greet: '¡Hola! Soy Marta, maestra 📚 ¿Aprendemos algo hoy?' },
  { name: 'Pedro', job: 'mecánico', color: 0x4da34d, home: [42, 36], type: 'bueno', greet: '¡Hola! Soy Pedro, mecánico 🔧 ¿Tu auto necesita arreglo?' },
  { name: 'Ana', job: 'policía', color: 0x2b4a8f, home: [28, 44], type: 'bueno', greet: '¡Hola! Soy Ana, policía 👮 ¡La ciudad está segura!' },
  { name: 'Luis', job: 'vendedor', color: 0xd68a2f, home: [48, 44], type: 'bueno', greet: '¡Hola! Soy Luis, vendedor 🛍️ ¡Pasa por mi tienda!' },
  { name: 'Roco', job: 'matón', color: 0x333333, home: [28, 10], type: 'malo', greet: '😠 ¡Eh, tú! ¡Este es mi barrio!' },
  { name: 'Tito', job: 'matón', color: 0x555555, home: [42, 10], type: 'malo', greet: '😠 ¡Dame tus bloques o te empujo!' },
];
const STREET_X = [32, 40];
function makeNameSprite(text) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.font = 'bold 34px Trebuchet MS, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, 6, 256, 52);
  g.fillStyle = '#fff'; g.fillText(text, 128, 34);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set(2.4, 0.6, 1);
  return sp;
}
function makeNPCMesh(color) {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0xf2c184 });
  const shirt = new THREE.MeshLambertMaterial({ color });
  const pants = new THREE.MeshLambertMaterial({ color: 0x2b2b44 });
  const hair = new THREE.MeshLambertMaterial({ color: 0x3a2314 });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), skin);
  head.position.y = 1.55;
  const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.14, 0.52), hair);
  hairTop.position.y = 1.84;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.3), shirt);
  torso.position.y = 1.04;
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.66, 0.2), shirt);
  armL.position.set(-0.39, 1.04, 0);
  const armR = armL.clone(); armR.position.x = 0.39;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.68, 0.24), pants);
  legL.position.set(-0.14, 0.34, 0);
  const legR = legL.clone(); legR.position.x = 0.14;
  g.add(head, hairTop, torso, armL, armR, legL, legR);
  g.userData = { armL, armR, legL, legR };
  return g;
}
function initNPCs() {
  for (const def of NPC_DEFS) {
    const group = makeNPCMesh(def.color);
    const label = makeNameSprite(def.name);
    label.position.y = 2.35;
    group.add(label);
    const hx = def.home[0] + 0.5, hz = def.home[1] + 4.5; // delante de su casa
    group.position.set(hx, topSolidY(Math.floor(hx), Math.floor(hz)), hz);
    scene.add(group);
    // puntos de paseo: cruces de calles cercanos a su casa + frente de la casa
    const wps = [];
    for (const sx of STREET_X) for (const sz of [16, 24, 32, 40]) {
      if (Math.hypot(sx - hx, sz - hz) < 24) wps.push([sx + 0.5, sz + 0.5]);
    }
    wps.push([hx, hz]);
    npcs.push({ ...def, group, wps, wp: 0, waitUntil: 0, greetAt: 0, bumpAt: 0, walkPhase: Math.random() * 6 });
  }
}
function updateNPCs(dt, now) {
  for (const n of npcs) {
    const p = n.group.position;
    const toPlayer = new THREE.Vector3(player.pos.x - p.x, 0, player.pos.z - p.z);
    const distP = toPlayer.length();
    // saludar al acercarse
    if (distP < 2.6 && now > n.greetAt) {
      n.greetAt = now + 9000;
      toast(`${n.type === 'malo' ? '' : '👋 '}${n.greet}`);
    }
    let mx = 0, mz = 0, moving = false;
    if (n.type === 'malo' && distP < 7 && distP > 0.01) {
      // el matón te persigue
      mx = toPlayer.x / distP; mz = toPlayer.z / distP;
      moving = true;
      p.x += mx * 2.2 * dt; p.z += mz * 2.2 * dt;
      if (distP < 1.5 && now > n.bumpAt) {
        n.bumpAt = now + 1500;
        hurtPlayer(1);
        toast('😠 ¡El matón te empujó!');
      }
    } else if (now > n.waitUntil) {
      // caminar en forma de L por las calles (primero x, luego z)
      const wp = n.wps[n.wp];
      const dx = wp[0] - p.x, dz = wp[1] - p.z;
      if (Math.abs(dx) > 0.3) {
        mx = Math.sign(dx); moving = true; p.x += mx * 1.3 * dt;
      } else if (Math.abs(dz) > 0.3) {
        mz = Math.sign(dz); moving = true; p.z += mz * 1.3 * dt;
      } else {
        n.wp = (n.wp + 1) % n.wps.length;
        n.waitUntil = now + 1500 + Math.random() * 2500;
      }
    }
    p.x = Math.max(1, Math.min(W - 2, p.x));
    p.z = Math.max(1, Math.min(D - 2, p.z));
    p.y = topSolidY(Math.floor(p.x), Math.floor(p.z));
    if (moving) {
      n.group.rotation.y = Math.atan2(mx, mz);
      const swing = Math.sin(now * 0.01 + n.walkPhase) * 0.5;
      n.group.userData.legL.rotation.x = swing;
      n.group.userData.legR.rotation.x = -swing;
      n.group.userData.armL.rotation.x = -swing * 0.7;
      n.group.userData.armR.rotation.x = swing * 0.7;
    } else {
      n.group.userData.legL.rotation.x = 0;
      n.group.userData.legR.rotation.x = 0;
      n.group.userData.armL.rotation.x = 0;
      n.group.userData.armR.rotation.x = 0;
    }
  }
}

// v2: arrancar vehículos y gente
initVehicles();
initNPCs();
updateHandVisibility();

// ganchos de prueba (no afectan al juego)
window.__myblock = {
  ready: true, version: '2.0.0',
  state: () => state,
  mode: () => cameraMode,
  setMode: (m) => setCameraMode(m),
  start: () => startGame(),
  playerPos: () => ({ x: player.pos.x, y: player.pos.y, z: player.pos.z }),
  hearts: () => hearts,
  score: () => score,
  ammo: () => currentAmmo(),
  blockAt: (x, y, z) => getBlock(x, y, z),
  setBlock: (x, y, z, t) => { setBlock(x, y, z, t); rebuildMesh(); },
  breakAt: (x, y, z) => { const b = getBlock(x, y, z); if (b !== B.AIR) { setBlock(x, y, z, B.AIR); rebuildMesh(); return b; } return 0; },
  placeAt: (x, y, z, t) => { if (getBlock(x, y, z) === B.AIR) { setBlock(x, y, z, t); rebuildMesh(); return true; } return false; },
  aimAt: (x, y, z) => {
    const h = headPos();
    const dx = x - h.x, dy = y - h.y, dz = z - h.z;
    player.yaw = Math.atan2(-dx, -dz);
    player.pitch = Math.atan2(dy, Math.hypot(dx, dz));
  },
  shoot: () => shoot(),
  usePower: () => usePower(),
  mobsAlive: () => mobs.filter((m) => m.alive).length,
  summonMob: () => { // trae un monstruo a 6 bloques del jugador con línea de tiro despejada (para pruebas)
    const head = headPos();
    for (let a = 0; a < 8; a++) {
      const ang = player.yaw + (a * Math.PI) / 4;
      const x = player.pos.x - Math.sin(ang) * 6, z = player.pos.z - Math.cos(ang) * 6;
      if (x < 2 || x > W - 3 || z < 2 || z > D - 3) continue;
      const y = topSolidY(Math.floor(x), Math.floor(z));
      const target = new THREE.Vector3(x, y + 1.2, z);
      const dir = target.clone().sub(head);
      const dist = dir.length();
      dir.normalize();
      const vox = raycastVoxel(head, dir, dist + 0.5);
      if (vox && vox.dist < dist - 0.5) continue; // tapado por el terreno
      const m = mobs.find((mm) => mm.alive) || mobs[0];
      if (!m.group.children.length) return false;
      m.hp = 3; m.alive = true; m.group.visible = true;
      m.group.position.set(x, y, z);
      return true;
    }
    return false;
  },
  mobPositions: () => mobs.filter((m) => m.alive).map((m) => ({ x: m.group.position.x, y: m.group.position.y + 1.2, z: m.group.position.z, hp: m.hp })),
  mobsTotal: () => mobs.length,
  selectSlot: (i) => selectSlot(i),
  selectedSlot: () => selectedSlot,
  worldBlockCount: () => countSolid(),
  worldSize: () => ({ W, D, H }),
  placeBlock: () => placeBlock(),
  breakBlock: () => breakBlock(),
  punch: () => punch(),
  hotbarCount: () => allSlots().length,
  hotbarSlots: () => allSlots().map((s) => s.name),
  // v2
  inventory: () => ({ ...inv }),
  addItem: (id, n) => addItem(id, n || 1),
  craft: (id) => craft(id),
  recipes: () => RECIPES.map((r) => ({ id: r.id, locked: !hasItems(r.needs), needs: r.needs })),
  enterVehicle: () => tryEnterVehicle(),
  exitVehicle: () => exitVehicle(),
  driving: () => !!driving,
  vehicleSpeed: () => (driving ? driving.speed : 0),
  vehicleCount: () => vehicles.length,
  npcs: () => npcs.map((n) => ({ name: n.name, type: n.type, job: n.job, x: n.group.position.x, z: n.group.position.z })),
  npcCount: () => npcs.length,
  teleport: (x, y, z) => { player.pos.set(x, y, z); player.vel.set(0, 0, 0); },
  inWater: () => isInWater(),
  handVisible: () => !!(handGroup && handGroup.visible),
  openInventory: () => openInventory(),
  closeInventory: () => closeInventory(),
  inventoryOpen: () => state === 'inventory',
  spawnPickupTest: (item) => { const p = player.pos; spawnPickup(p.x + 0.8, topSolidY(Math.floor(p.x + 0.8), Math.floor(p.z)), p.z, item, 1); return true; },
  pickupsCount: () => pickups.length,
  blockName: (t) => (BLOCK_DEFS[t] ? BLOCK_DEFS[t].name : '?'),
};
