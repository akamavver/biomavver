const PHOTO_DIR = "Images/mavver";
const PHOTO_LIST_URL = "photos.json";

const VISIBLE_COUNT = 56;

const TILE_TYPES_DESKTOP = [
  { w: 2, h: 2, weight: 25 },
  { w: 2, h: 1, weight: 30 },
  { w: 1, h: 2, weight: 25 },
  { w: 1, h: 1, weight: 20 }
];

const TILE_TYPES_MOBILE = [
  { w: 1, h: 1, weight: 100 }
];

const MOSAIC_START_DELAY = 150;

const CELL_STAGGER = {
  base: 70,
  row: 75,
  column: 35
};

let currentPhotos = [];
let resizeTimer = null;

function isMobile() {
  return window.matchMedia("(max-width: 600px)").matches;
}

function photoUrl(name) {
  return `${PHOTO_DIR}/${encodeURIComponent(name)}`;
}

function shuffle(items) {
  const result = items.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i]
    ];
  }

  return result;
}

function randomTileType() {
  const types = isMobile()
    ? TILE_TYPES_MOBILE
    : TILE_TYPES_DESKTOP;

  const totalWeight = types.reduce(
    (sum, tile) => sum + tile.weight,
    0
  );

  let value = Math.random() * totalWeight;

  for (const tile of types) {
    value -= tile.weight;

    if (value <= 0) {
      return tile;
    }
  }

  return types[0];
}

async function fetchPhotoList() {
  try {
    const response = await fetch(
      `${PHOTO_LIST_URL}?v=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `photos.json error: ${response.status}`
      );
    }

    const photos = await response.json();

    if (!Array.isArray(photos)) {
      throw new Error(
        "photos.json должен содержать массив"
      );
    }

    return photos.filter(
      (name) =>
        typeof name === "string" &&
        /\.(jpe?g|png|webp|gif|avif)$/i.test(name)
    );
  } catch (error) {
    console.error(
      "Не удалось получить список фотографий:",
      error
    );

    return [];
  }
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.loading = "eager";

    let finished = false;

    const finish = (success) => {
      if (finished) {
        return;
      }

      finished = true;

      resolve(
        success
          ? {
              src,
              image
            }
          : null
      );
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

function createCell(size, src) {
  const cell = document.createElement("div");

  cell.className = "cell";

  cell.style.gridColumn =
    `span ${size.w}`;

  cell.style.gridRow =
    `span ${size.h}`;

  const image = document.createElement("img");

  image.className = "cell-img";

  image.alt = "";

  image.decoding = "async";
  image.loading = "eager";
  image.draggable = false;

  image.src = src;

  cell.appendChild(image);

  return cell;
}

function getVisualOrder(cells) {
  const items = Array.from(cells).map((cell) => {
    const rect = cell.getBoundingClientRect();

    return {
      cell,
      top: rect.top,
      left: rect.left
    };
  });

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

function getCellStagger(index) {
  const row = Math.floor(index / 4);
  const column = index % 4;

  return (
    CELL_STAGGER.base +
    row * CELL_STAGGER.row +
    column * CELL_STAGGER.column
  );
}

function revealMosaic(mosaic) {
  const cells =
    mosaic.querySelectorAll(".cell");

  const ordered =
    getVisualOrder(cells);

  ordered.forEach((cell, index) => {
    cell.style.animationDelay =
      `${getCellStagger(index)}ms`;

    cell.classList.add("is-visible");
  });

  return ordered;
}

function getAnimationEndTime(cellCount) {
  if (!cellCount) {
    return 0;
  }

  const lastIndex =
    cellCount - 1;

  return (
    getCellStagger(lastIndex) +
    950
  );
}

function markHeroComplete() {
  const hero =
    document.getElementById("hero");

  if (!hero) {
    return;
  }

  hero.classList.add("is-complete");

  updateScrollFade();
}

async function createMosaic() {
  const mosaic =
    document.getElementById("mosaic");

  const hero =
    document.getElementById("hero");

  if (!mosaic || !hero) {
    return;
  }

  hero.classList.remove("is-complete");

  mosaic.innerHTML = "";

  const photoNames =
    await fetchPhotoList();

  if (!photoNames.length) {
    console.error(
      "photos.json не содержит фотографий."
    );

    return;
  }

  const shuffled =
    shuffle(photoNames);

  const selected =
    shuffled.slice(
      0,
      Math.min(
        VISIBLE_COUNT,
        shuffled.length
      )
    );

  const sources =
    selected.map(photoUrl);

  const validSources =
    await preloadImages(sources);

  if (!validSources.length) {
    console.error(
      "Ни одна фотография не загрузилась."
    );

    return;
  }

  currentPhotos =
    validSources.slice();

  const fragment =
    document.createDocumentFragment();

  validSources.forEach((src) => {
    const size =
      randomTileType();

    const cell =
      createCell(
        size,
        src
      );

    fragment.appendChild(cell);
  });

  mosaic.appendChild(fragment);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const cells =
        revealMosaic(mosaic);

      const animationDuration =
        getAnimationEndTime(
          cells.length
        );

      setTimeout(() => {
        markHeroComplete();
      }, animationDuration + 250);
    });
  });
}

function updateScrollFade() {
  const hero =
    document.getElementById("hero");

  const fade =
    document.getElementById("heroBottomFade");

  if (!hero || !fade) {
    return;
  }

  if (
    !hero.classList.contains(
      "is-complete"
    )
  ) {
    fade.style.opacity = "0";
    return;
  }

  const heroHeight =
    hero.offsetHeight;

  const scrollY =
    window.scrollY;

  const fadeDistance =
    Math.min(
      heroHeight * 0.45,
      500
    );

  const progress =
    Math.min(
      1,
      Math.max(
        0,
        scrollY / fadeDistance
      )
    );

  const opacity =
    1 - progress;

  fade.style.opacity =
    opacity.toString();

  fade.style.transform =
    `translateY(${progress * 25}px)`;
}

function handleResize() {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    if (!currentPhotos.length) {
      return;
    }

    createMosaic();
  }, 250);
}

async function boot() {
  const hero =
    document.getElementById("hero");

  const mosaic =
    document.getElementById("mosaic");

  if (!hero || !mosaic) {
    return;
  }

  await new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });

  setTimeout(() => {
    createMosaic();
  }, MOSAIC_START_DELAY);
}

window.addEventListener(
  "scroll",
  updateScrollFade,
  {
    passive: true
  }
);

window.addEventListener(
  "resize",
  handleResize
);

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    boot,
    {
      once: true
    }
  );
} else {
  boot();
}