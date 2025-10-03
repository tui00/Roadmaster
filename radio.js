// === Параметры ===
function setup(forwardPin, backwardPin, leftPin, rightPin, needUpdateRef) {

    setWatch(update, forwardPin, { edge: 0, repeat: true });
    setWatch(update, backwardPin, { edge: 0, repeat: true });
    setWatch(update, leftPin, { edge: 0, repeat: true });
    setWatch(update, rightPin, { edge: 0, repeat: true });

    function update() {
        global[needUpdateRef] = true;
    }

    // === Основной цикл обнавления пульта ===
    function readPins() {
        return {
            drive: !!forwardPin.read(),
            reverse: !!backwardPin.read(),
            left: !!leftPin.read(),
            right: !!rightPin.read(),
        }
    }

    return readPins;
}
exports.setup = setup;
