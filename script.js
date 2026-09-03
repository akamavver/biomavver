const PHOTO_DIR = "Images/mavver";
const VISIBLE_COUNT = 30;
const SWAP_EVERY_MS = 5000;
const SWAP_BATCH = 3;

const PHOTOS = [
  "photo_2024-04-11_13-06-42.jpg",
  "photo_2024-11-11_10-24-52.jpg",
  "photo_2024-11-19_23-33-36.jpg",
  "photo_2025-01-01_06-29-51.jpg",
  "photo_2025-01-03_03-20-09.jpg",
  "photo_2025-01-24_16-22-14.jpg",
  "photo_2025-04-12_14-37-28.jpg",
  "photo_2025-06-17_03-30-39.jpg",
  "photo_2025-06-28_02-27-07.jpg",
  "photo_2026-01-17_01-14-22.jpg",
  "photo_2026-01-17_01-14-24.jpg",
  "photo_2026-01-17_01-18-01.jpg",
  "photo_2026-01-17_01-18-05.jpg",
  "photo_2026-01-17_01-25-02.jpg",
  "photo_2026-02-06_01-35-46.jpg",
  "photo_2026-03-27_20-04-10.jpg",
  "photo_2026-03-27_20-19-22.jpg",
  "photo_2026-03-27_20-19-33.jpg",
  "photo_2026-03-27_20-19-40.jpg",
  "photo_2026-03-27_20-19-48.jpg",
  "photo_2026-03-27_20-19-55.jpg",
  "photo_2026-03-27_20-20-00.jpg",
  "photo_2026-03-27_20-20-04.jpg",
  "photo_2026-03-27_20-20-08.jpg",
  "photo_2026-03-27_20-20-10.jpg",
  "photo_2026-03-27_20-20-17.jpg",
  "photo_2026-03-27_20-20-31.jpg",
  "photo_2026-03-27_20-21-12.jpg",
  "photo_2026-03-27_20-21-14.jpg",
  "photo_2026-03-27_20-21-16 (2).jpg",
  "photo_2026-03-27_20-21-17.jpg",
  "photo_2026-03-27_20-21-18.jpg",
  "photo_2026-03-27_20-21-20.jpg",
  "photo_2026-03-27_20-21-22.jpg",
  "photo_2026-03-27_20-21-23.jpg",
  "photo_2026-03-27_20-21-25.jpg",
  "photo_2026-03-27_20-21-26.jpg",
  "photo_2026-03-27_20-21-27.jpg",
  "photo_2026-03-27_20-21-28.jpg",
  "photo_2026-03-27_20-21-29.jpg",
  "photo_2026-03-27_20-21-31.jpg",
  "photo_2026-03-27_20-21-33.jpg",
  "photo_2026-03-27_20-21-35.jpg",
  "photo_2026-03-27_20-21-39.jpg",
  "photo_2026-03-27_20-21-40.jpg",
  "photo_2026-03-27_20-21-42.jpg",
  "photo_2026-03-27_20-24-13.jpg",
  "photo_2026-03-27_20-24-15.jpg",
  "photo_2026-03-27_20-24-18.jpg",
  "photo_2026-03-27_20-24-19.jpg",
  "photo_2026-03-27_20-24-20.jpg",
  "photo_2026-03-27_20-24-21.jpg",
  "photo_2026-03-27_20-24-26.jpg",
  "photo_2026-03-27_20-24-28.jpg",
  "photo_2026-03-27_20-24-29.jpg",
  "photo_2026-03-27_20-24-30.jpg",
  "photo_2026-03-27_20-24-36.jpg",
  "photo_2026-03-27_20-24-41.jpg",
  "photo_2026-03-27_20-24-45.jpg",
  "photo_2026-03-27_20-24-47.jpg",
  "photo_2026-03-27_20-24-53.jpg",
  "photo_2026-03-27_20-24-54.jpg",
  "photo_2026-03-27_20-24-56.jpg",
  "photo_2026-03-27_20-24-57.jpg",
  "photo_2026-03-27_20-25-00.jpg",
  "photo_2026-03-27_20-25-04.jpg",
  "photo_2026-03-27_20-25-06.jpg",
  "photo_2026-03-27_20-25-10.jpg",
];

const MOSAIC = [
  { c: 1, r: 1, w: 2, h: 2 },
  { c: 3, r: 1, w: 2, h: 1 },
  { c: 5, r: 1, w: 1, h: 2 },
  { c: 6, r: 1, w: 2, h: 2 },
  { c: 8, r: 1, w: 1, h: 1 },
  { c: 9, r: 1, w: 2, h: 1 },
  { c: 11, r: 1, w: 2, h: 2 },
  { c: 3, r: 2, w: 2, h: 1 },
  { c: 8, r: 2, w: 1, h: 1 },
  { c: 9, r: 2, w: 2, h: 1 },
  { c: 1, r: 3, w: 1, h: 2 },
  { c: 2, r: 3, w: 2, h: 1 },
  { c: 4, r: 3, w: 2, h: 2 },
  { c: 6, r: 3, w: 1, h: 1 },
  { c: 7, r: 3, w: 2, h: 1 },
  { c: 9, r: 3, w: 1, h: 1 },
  { c: 10, r: 3, w: 2, h: 2 },
  { c: 12, r: 3, w: 1, h: 2 },
  { c: 2, r: 4, w: 2, h: 1 },
  { c: 6, r: 4, w: 1, h: 1 },
  { c: 7, r: 4, w: 2, h: 1 },
  { c: 9, r: 4, w: 1, h: 1 },
  { c: 1, r: 5, w: 2, h: 2 },
  { c: 3, r: 5, w: 1, h: 2 },
  { c: 4, r: 5, w: 2, h: 2 },
  { c: 6, r: 5, w: 2, h: 2 },
  { c: 8, r: 5, w: 1, h: 2 },
  { c: 9, r: 5, w: 2, h: 2 },
  { c: 11, r: 5, w: 2, h: 1 },
  { c: 11, r: 6, w: 2, h: 1 },
];

function photoUrl(name) {
  return `${PHOTO_DIR}/${encodeURIComponent(name)}`;
}

function shuffle(items) {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
  }
  return next;
}

function cellStaggerMs(index) {
  const group = Math.floor(index / 3);
  const inner = index % 3;
  return 2150 + group * 130 + inner * 36;
}

function createCell(cell, index, src) {
  const el = document.createElement("div");
  el.className = "cell";
  el.style.gridColumn = `${cell.c} / span ${cell.w}`;
  el.style.gridRow = `${cell.r} / span ${cell.h}`;
  el.style.setProperty("--delay", `${cellStaggerMs(index)}ms`);

  const a = document.createElement("img");
  a.className = "cell-img is-front";
  a.alt = "";
  a.decoding = "async";
  a.draggable = false;
  a.fetchPriority = index < 8 ? "high" : "low";
  a.src = src;

  const b = document.createElement("img");
  b.className = "cell-img";
  b.alt = "";
  b.decoding = "async";
  b.draggable = false;
  b.fetchPriority = "low";

  el.append(a, b);
  el._front = a;
  el._back = b;
  el._src = src;
  return el;
}

function crossfade(el, nextSrc) {
  if (!nextSrc || el._src === nextSrc) return;
  const back = el._back;
  const img = new Image();
  img.src = nextSrc;
  const reveal = () => {
    back.src = nextSrc;
    back.classList.add("is-front");
    el._front.classList.remove("is-front");
    const tmp = el._front;
    el._front = back;
    el._back = tmp;
    el._src = nextSrc;
  };
  if (typeof img.decode === "function") {
    img.decode().then(reveal).catch(reveal);
  } else if (img.complete) {
    reveal();
  } else {
    img.onload = reveal;
  }
}

function boot() {
  const stage = document.getElementById("stage");
  const mosaic = document.getElementById("mosaic");
  const deck = shuffle(PHOTOS.slice());
  const visible = deck.slice(0, VISIBLE_COUNT);
  const pool = deck.slice(VISIBLE_COUNT);
  const nodes = MOSAIC.map((cell, i) => createCell(cell, i, photoUrl(visible[i])));
  mosaic.append(...nodes);

  requestAnimationFrame(() => stage.classList.add("is-play"));

  let lastSwapped = new Set();
  const lastCellMs = cellStaggerMs(VISIBLE_COUNT - 1) + 900;

  window.setTimeout(() => {
    window.setInterval(() => {
      const candidates = [];
      for (let i = 0; i < nodes.length; i += 1) {
        if (!lastSwapped.has(i)) candidates.push(i);
      }
      const source = candidates.length >= SWAP_BATCH ? candidates : nodes.map((_, i) => i);
      const picks = shuffle(source).slice(0, Math.min(SWAP_BATCH, nodes.length, pool.length));
      lastSwapped = new Set(picks);
      for (const idx of picks) {
        const incoming = pool.shift();
        if (!incoming) break;
        const outgoing = visible[idx];
        visible[idx] = incoming;
        pool.push(outgoing);
        crossfade(nodes[idx], photoUrl(incoming));
      }
    }, SWAP_EVERY_MS);
  }, lastCellMs + SWAP_EVERY_MS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
