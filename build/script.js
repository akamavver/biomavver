const images = ["img_0.jpg", "img_1.jpg", "img_2.jpg", "img_3.jpg", "img_4.jpg", "img_5.jpg", "img_6.jpg", "img_7.jpg", "img_8.jpg", "img_9.jpg", "img_10.jpg", "img_11.jpg", "img_12.jpg", "img_13.jpg", "img_14.jpg", "img_15.jpg", "img_16.jpg", "img_17.jpg", "img_18.jpg", "img_19.jpg", "img_20.jpg", "img_21.jpg", "img_22.jpg", "img_23.jpg", "img_24.jpg", "img_25.jpg", "img_26.jpg", "img_27.jpg", "img_28.jpg", "img_29.jpg", "img_30.jpg", "img_31.jpg", "img_32.jpg", "img_33.jpg", "img_34.jpg", "img_35.jpg", "img_36.jpg", "img_37.jpg", "img_38.jpg", "img_39.jpg", "img_40.jpg", "img_41.jpg", "img_42.jpg", "img_43.jpg", "img_44.jpg", "img_45.jpg", "img_46.jpg", "img_47.jpg", "img_48.jpg", "img_49.jpg", "img_50.jpg", "img_51.jpg", "img_52.jpg", "img_53.jpg", "img_54.jpg", "img_55.jpg", "img_56.jpg", "img_57.jpg", "img_58.jpg", "img_59.jpg", "img_60.jpg", "img_61.jpg", "img_62.jpg", "img_63.jpg", "img_64.jpg", "img_65.jpg", "img_66.jpg", "img_67.jpg", "img_68.jpg"];
const grid = document.getElementById('grid');

let items = [];
const gap = 10;
const speed = window.innerWidth < 600 ? 120 : 80;

let lastTime = 0;
let isAnimating = false;

function getColumnCount() {
    const w = window.innerWidth;
    if (w < 600) return 2;
    if (w < 900) return 3;
    if (w < 1200) return 4;
    return 6;
}

// умные веса размеров (динамически меняются)
function getAdaptiveSize(colCount, density) {
    // density = насколько сетка "забита"
    let variants;

    if (density < 0.3) {
        // пусто → можно большие
        variants = [
            { w: 2, h: 2, weight: 4 },
            { w: 2, h: 1, weight: 3 },
            { w: 1, h: 2, weight: 3 },
            { w: 1, h: 1, weight: 2 }
        ];
    } else if (density < 0.7) {
        // норм → баланс
        variants = [
            { w: 2, h: 2, weight: 2 },
            { w: 2, h: 1, weight: 3 },
            { w: 1, h: 2, weight: 3 },
            { w: 1, h: 1, weight: 5 }
        ];
    } else {
        // перегружено → мелкие
        variants = [
            { w: 1, h: 1, weight: 8 },
            { w: 1, h: 2, weight: 2 },
            { w: 2, h: 1, weight: 1 }
        ];
    }

    // фильтр по ширине
    variants = variants.filter(v => v.w <= colCount);

    // weighted random
    const total = variants.reduce((s, v) => s + v.weight, 0);
    let r = Math.random() * total;

    for (const v of variants) {
        if ((r -= v.weight) <= 0) return v;
    }

    return { w: 1, h: 1 };
}

function setupGrid() {
    const colCount = getColumnCount();
    const colWidth = (window.innerWidth - gap * (colCount + 1)) / colCount;

    const colBottoms = Array(colCount).fill(gap);
    let loadedCount = 0;

    images.sort(() => Math.random() - 0.5).forEach((src, index) => {

        const density = items.length / images.length;
        const size = getAdaptiveSize(colCount, density);

        const div = document.createElement('div');
        div.className = 'item';
        div.style.willChange = 'transform';

        const blur = document.createElement('img');
        blur.src = `blur/${src}`;
        blur.className = 'blur';

        const full = document.createElement('img');
        full.src = `assets/${src}`;
        full.className = 'full';
        full.style.opacity = '0';

        div.appendChild(blur);
        div.appendChild(full);
        grid.appendChild(div);

        full.onload = () => {

            let bestCol = 0;
            let minHeight = Infinity;

            for (let i = 0; i <= colCount - size.w; i++) {
                const maxColHeight = Math.max(...colBottoms.slice(i, i + size.w));
                if (maxColHeight < minHeight) {
                    minHeight = maxColHeight;
                    bestCol = i;
                }
            }

            const width = colWidth * size.w + gap * (size.w - 1);
            const ratio = full.naturalHeight / full.naturalWidth;
            const height = width * ratio * (size.h / size.w);

            const x = gap + bestCol * (colWidth + gap);
            const y = minHeight;

            div.style.width = `${width}px`;
            div.style.height = `${height}px`;

            div.dataset.x = x;
            div.dataset.y = y;
            div.dataset.col = bestCol;
            div.dataset.span = size.w;

            div.style.transform = `translate3d(${x}px, ${y}px, 0)`;

            for (let i = 0; i < size.w; i++) {
                colBottoms[bestCol + i] = minHeight + height + gap;
            }

            items.push(div);

            setTimeout(() => {
                full.style.opacity = '1';
                div.classList.add('loaded');
            }, index * 40);

            loadedCount++;
            if (loadedCount === 1 && !isAnimating) {
                isAnimating = true;
                requestAnimationFrame(animateGrid);
            }
        };
    });
}

function animateGrid(time) {
    if (!lastTime) lastTime = time;
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    const moveStep = speed * deltaTime;

    items.forEach(div => {
        let y = parseFloat(div.dataset.y) - moveStep;
        const height = parseFloat(div.style.height);
        const x = parseFloat(div.dataset.x);
        const col = parseInt(div.dataset.col);
        const span = parseInt(div.dataset.span);

        if (y + height < 0) {
            const colItems = items.filter(d =>
                parseInt(d.dataset.col) <= col + span - 1 &&
                parseInt(d.dataset.col) + parseInt(d.dataset.span) - 1 >= col
            );

            const maxBottom = Math.max(...colItems.map(d =>
                parseFloat(d.dataset.y) + parseFloat(d.style.height)
            ));

            y = maxBottom + gap;
        }

        div.dataset.y = y;
        div.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(animateGrid);
}

window.addEventListener('DOMContentLoaded', setupGrid);

window.addEventListener('resize', () => {
    location.reload();
});