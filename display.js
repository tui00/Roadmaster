// Display
function setup(cellScale) {
    I2C1.setup({ scl: D21, sda: D22 });
    var oled = require("SSD1306").connect(I2C1);

    const OFFSETS = [
        [-1, 1, 1, 1, 0, 1], // 0
        [-1, -1, 1, 1], // 45
        [-1, -1, -1, 1, -1, 0], // 90
        [1, -1, -1, 1], // 135
        [-1, -1, 1, -1, 0, -1], // 180
        [1, 1, -1, -1], // 225
        [1, -1, 1, 1, 1, 0], // 270
        [-1, 1, 1, -1], // 315
    ];
    // Комментарий: предрассчитанные смещения для отрисовки "формы стрелки"
    // в зависимости от угла поворота. Индекс = угол/45.
    // В каждом массиве хранятся пары (dx, dy) для дополнительных клеток.

    function configDisplay() {
        oled.clear();
        oled.flip();
        oled.setFontVector(16);
    }

    const trigSign = v => Math.abs(v) < 1e-12 ? 0 : Math.sign(v);

    function updateDisplay(x, y, a) {
        oled.clear();

        var radians = (a - 90) * (Math.PI / 180);

        var x1 = x + (trigSign(Math.cos(radians)));
        var y1 = y + (trigSign(Math.sin(radians)));
        var x2 = x + x - x1;
        var y2 = y + y - y1;
        // Комментарий: вычисляется точка, зеркально отражённая относительно (x, y).
        // Например: если "x1,y1" — клетка "нос робота", то "x2,y2" — "хвост".
        // Это нужно, чтобы рисовать симметричную фигуру относительно центра.
        var table = OFFSETS;
        var index = a / 45;

        drawCell(x, y);
        drawCell(x2, y2);

        drawCell(x2 + table[index][0], y2 + table[index][1])
        drawCell(x2 + table[index][2], y2 + table[index][3])

        if (a % 90 == 0) drawCell(x2 + table[index][4], y2 + table[index][5]);

        fillCell(x1, y1);

        oled.flip();
    }

    function drawCell(x, y) {
        oled.drawRect(x * cellScale, y * cellScale, (x + 1) * cellScale, (y + 1) * cellScale);
    }
    function drawCellRect(x1, y1, x2, y2) {
        oled.drawRect(x1 * cellScale, y1 * cellScale, (x2 + 1) * cellScale, (y2 + 1) * cellScale);
    }

    function fillCell(x, y) {
        oled.fillRect(x * cellScale, y * cellScale, (x + 1) * cellScale, (y + 1) * cellScale);
    }

    configDisplay();
    return updateDisplay;
}
exports.setup = setup;
