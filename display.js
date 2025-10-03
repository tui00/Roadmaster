// Display
function setup(cellScale) {
    I2C1.setup({ scl: D21, sda: D22 });
    var oled = require("SSD1306").connect(I2C1);

    function rotate(points, deg) {
        const c = Math.cos(deg * Math.PI / 180), s = Math.sin(deg * Math.PI / 180);
        return points.map(e => [e[0] * c - e[1] * s, e[0] * s + e[1] * c]);
    };

    const ARROW = [
        [1, 0], // head
        [0, 0], // body
        [-1, 0], // tall
        [-2, 0], // tall2
        [-2, -1.4], // left wing
        [-2, 1.4], // right wing
    ];

    function configDisplay() {
        oled.clear();
        oled.flip();
        oled.setFontVector(16);
    }

    function updateDisplay(x, y, a) {
        oled.clear();

        rotate(ARROW, a).forEach((p, i) => {
            const x1 = x + Math.round(p[0]);
            const y1 = y + Math.round(p[1]);
            if (i == 0) fillCell(x1, y1);
            else drawCell(x1, y1);
        });

        oled.flip();
    }

    function drawCell(x, y) {
        oled.drawRect(x * cellScale, y * cellScale, (x + 1) * cellScale, (y + 1) * cellScale);
    }

    function fillCell(x, y) {
        oled.fillRect(x * cellScale, y * cellScale, (x + 1) * cellScale, (y + 1) * cellScale);
    }

    configDisplay();
    return updateDisplay;
}
exports.setup = setup;
