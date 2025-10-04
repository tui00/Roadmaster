// === Параметры ===
function setup(cellScale) {
    // === Запуск и иницилизация дисплея ===
    var oled = require("SSD1306").connect(I2C1);

    oled.clear();
    oled.flip();

    // === Форма машинки ===
    const ARROW = [
        [2, 0], // head
        [2, -1.4], // up left wheel 
        [2, 1.4], // up right wheel
        [1, 0], // body
        [0, 0], // body
        [-1, 0], // body
        [-2, 0], // tall
        [-2, -1.4], // bottom left wheel 
        [-2, 1.4], // bottom right wheel
    ];

    // === Поворот ===
    function rotate(points, deg) {
        const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180);
        return points.map(e => [e[0] * c - e[1] * s, e[0] * s + e[1] * c]);
    };

    // === Отрисовка клетки в маштабе ===
    function drawCell(x, y) {
        oled.drawRect(x * cellScale, y * cellScale, (x + 1) * cellScale, (y + 1) * cellScale);
    }

    function fillCell(x, y) {
        oled.fillRect(x * cellScale, y * cellScale, (x + 1) * cellScale, (y + 1) * cellScale);
    }

    // === Основной цикл дисплея ===
    function updateDisplay(x, y, a) {
        oled.clear();

        // Поворачиваем в нужную сторону машинку и рисуем
        rotate(ARROW, a).forEach((p, i) => {
            const x1 = x + Math.round(p[0]);
            const y1 = y + Math.round(p[1]);
            if (i < 3) fillCell(x1, y1);
            else drawCell(x1, y1);
        });

        oled.flip();
    }

    return updateDisplay;
}
exports.setup = setup;
