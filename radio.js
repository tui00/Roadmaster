// === Параметры ===
function setup(forwardPin, backwardPin, leftPin, rightPin, inputRef, needUpdateRef) {

    setWatch(update, forwardPin, { edge: 0, repeat: true });
    setWatch(update, backwardPin, { edge: 0, repeat: true });
    setWatch(update, leftPin, { edge: 0, repeat: true });
    setWatch(update, rightPin, { edge: 0, repeat: true });

    function update() {
        global[needUpdateRef] = true;
        global[inputRef] = readPins();
    }

    // === Основная функция обновления пульта ===
    function readPins() {
        return {
            drive: !!forwardPin.read(),
            reverse: !!backwardPin.read(),
            left: !!leftPin.read(),
            right: !!rightPin.read(),
        }
    }
}
exports.setup = setup;
