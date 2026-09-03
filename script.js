const PHOTO_DIR = "Images/mavver";
const VISIBLE_COUNT = 42;

const TEXT_ANIMATION_END = 2730;
const MOSAIC_START_DELAY = 50;

const TILE_TYPES = [
  { w: 2, h: 2, weight: 25 },
  { w: 2, h: 1, weight: 30 },
  { w: 1, h: 2, weight: 25 },
  { w: 1, h: 1, weight: 20 },
];

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

function photoUrl(name) {
  return `${PHOTO_DIR}/${encodeURIComponent(name)}`;
}

function shuffle(items) {
  const result = items.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

function randomTileType() {
  const totalWeight = TILE_TYPES.reduce(
    (sum, tile) => sum + tile.weight,
    0
  );

  let value = Math.random() * totalWeight;

  for (const tile of TILE_TYPES) {
    value -= tile.weight;

    if (value <= 0) {
      return tile;
    }
  }

  return TILE_TYPES[0];
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";

    let finished = false;

    const finish = (success) => {
      if (finished) {
        return;
      }

      finished = true;

      if (success) {
        resolve({
          src,
          image,
        });
      } else {
        resolve(null);
      }
    };

    image.onload = async () => {
      try {
        if (typeof image.decode === "function") {
          await image.decode();
        }

        if (
          image.naturalWidth > 0 &&
          image.naturalHeight > 0
        ) {
          finish(true);
        } else {
          finish(false);
        }
      } catch {
        finish(false);
      }
    };

    image.onerror = () => {
      finish(false);
    };

    image.src = src;
  });
}

async function preloadImages(sources) {
  const results = await Promise.all(
    sources.map(preloadImage)
  );

  return results
    .filter(Boolean)
    .map((item) => item.src);
}

function cellStaggerMs(index) {
  const row = Math.floor(index / 4);
  const column = index % 4;

  return (
    70 +
    row * 90 +
    column * 45
  );
}

function createCell(size, index, src) {
  const cell = document.createElement("div");

  cell.className = "cell";

  cell.style.gridColumn =
    `span ${size.w}`;

  cell.style.gridRow =
    `span ${size.h}`;

  cell.style.animationDelay =
    `${cellStaggerMs(index)}ms`;

  const image = document.createElement("img");

  image.className =
    "cell-img is-front";

  image.alt = "";

  image.decoding = "async";

  image.draggable = false;

  image.loading = "eager";

  image.src = src;

  cell.appendChild(image);

  return cell;
}

function getVisualOrder(cells) {
  const items = Array.from(cells).map(
    (cell) => {
      const rect =
        cell.getBoundingClientRect();

      return {
        cell,
        top: rect.top,
        left: rect.left,
      };
    }
  );

  items.sort((a, b) => {
    const topDifference =
      a.top - b.top;

    if (Math.abs(topDifference) > 15) {
      return topDifference;
    }

    return a.left - b.left;
  });

  return items.map(
    (item) => item.cell
  );
}

function revealMosaic(mosaic) {
  const cells =
    mosaic.querySelectorAll(".cell");

  const ordered =
    getVisualOrder(cells);

  ordered.forEach(
    (cell, index) => {
      cell.style.animationDelay =
        `${cellStaggerMs(index)}ms`;

      cell.classList.add(
        "is-visible"
      );
    }
  );
}

async function createMosaic() {
  const mosaic =
    document.getElementById("mosaic");

  if (!mosaic) {
    return;
  }

  const deck =
    shuffle(PHOTOS);

  const requested =
    deck.slice(
      0,
      Math.min(
        VISIBLE_COUNT,
        deck.length
      )
    );

  const sources =
    requested.map(photoUrl);

  const validSources =
    await preloadImages(sources);

  if (!validSources.length) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  validSources.forEach(
    (src, index) => {
      const size =
        randomTileType();

      const cell =
        createCell(
          size,
          index,
          src
        );

      fragment.appendChild(cell);
    }
  );

  mosaic.innerHTML = "";

  mosaic.appendChild(fragment);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      revealMosaic(mosaic);
    });
  });
}

function boot() {
  const stage =
    document.getElementById("stage");

  const mosaic =
    document.getElementById("mosaic");

  if (!stage || !mosaic) {
    return;
  }

  mosaic.innerHTML = "";

  requestAnimationFrame(() => {
    stage.classList.add("is-play");
  });

  setTimeout(() => {
    createMosaic();
  }, TEXT_ANIMATION_END + MOSAIC_START_DELAY);
}

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    boot,
    { once: true }
  );
} else {
  boot();
}