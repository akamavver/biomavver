const images = {{IMAGES}};
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

function setupGrid() {
    const colCount = getColumnCount();
    const colWidth = (window.innerWidth - gap * (colCount + 1)) / colCount;
    const colBottoms = Array(colCount).fill(gap);

    let loadedCount = 0;

    images.sort(() => Math.random() - 0.5).forEach((src, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.style.width = `${colWidth}px`;
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
            const ratio = full.naturalHeight / full.naturalWidth;
            const height = colWidth * ratio;
            div.style.height = `${height}px`;

            const minCol = colBottoms.indexOf(Math.min(...colBottoms));
            const x = gap + minCol * (colWidth + gap);
            const y = colBottoms[minCol];

            div.dataset.y = y;
            div.dataset.x = x;
            div.dataset.col = minCol;

            div.style.transform = `translate3d(${x}px, ${y}px, 0)`;

            colBottoms[minCol] += height + gap;
            items.push(div);

            setTimeout(() => {
                full.style.opacity = '1';
                div.classList.add('loaded');
            }, index * 50);

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

        if (y + height < 0) {
            const colItems = items.filter(d => parseInt(d.dataset.col) === col);
            const maxBottom = Math.max(...colItems.map(d => parseFloat(d.dataset.y) + parseFloat(d.style.height)));
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