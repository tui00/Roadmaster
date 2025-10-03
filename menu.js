// === Параметры ===
function show(
    upPin,
    downPin,
    rightPin,

    updateInterval,

    headerFontSize,
    textFontSize,

    cars,
    carsPerPage,

    currentCarRef,
    needUpdateRef
) {
    // === Запуск и иницилизация дисплея ===
    var oled = require("SSD1306").connect(I2C1);

    oled.clear();
    oled.flip();

    var needUpdate = true;
    var curr = 0;
    var page = 0;

    const addToCurr = num => {
        return () => {
            curr = (curr + num + cars.length) % cars.length;
            page = Math.floor(curr / carsPerPage);
            needUpdate = true;
        }
    };

    var upId = setWatch(addToCurr(-1), upPin, { edge: -1, repeat: true });
    var downId = setWatch(addToCurr(1), downPin, { edge: -1, repeat: true });
    setWatch(() => {
        clearWatch(upId);
        clearWatch(downId);

        global[currentCarRef] = cars[curr];

        global[needUpdateRef] = true;
    }, rightPin, { edge: -1, repeat: false });

    // == Основной цикл меню ===
    function updateMenu() {
        if (needUpdate) {
            oled.clear();

            oled.setFontVector(headerFontSize);
            oled.drawString("Choose car:", 2, 2);

            oled.setFontVector(textFontSize);
            oled.drawString((curr + 1) + "/" + (cars.length - 1), 2, headerFontSize)

            cars.forEach((car, index) => {
                if (Math.floor(index / carsPerPage) == page && index != cars.length - 1) {
                    oled.drawString((curr == index ? ">  " : (index + 1) + ". ") + car[5], 2, (2 + headerFontSize + textFontSize) + ((index - page * carsPerPage) * textFontSize));
                }
            });

            oled.flip();
            needUpdate = false;
        }
    }

    // ---
    setInterval(updateMenu, updateInterval);
}
exports.show = show;
