// === Параметры ===
function setup(
    maxDriveSpeed,
    maxReverseSpeed,

    accelStep,
    breakStep,
    neutralStep,

    rotationStep,

    speedChangeInterval,

    needUpdateRef
) {
    var drive = false; // Мы едем прямо?
    var reverse = false; // Мы едем задним ходом?
    var speed = 0; // Наша скорость

    // === Цикл обнавления скорости ===
    setInterval(() => {
        if (drive && speed < maxDriveSpeed) {
            global[needUpdateRef] = true;
            if (speed >= 1e-12) {
                speed += accelStep; // Ускоряемся
            } else {
                speed += breakStep; // Тормозим
            }
        } else if (reverse && -speed < maxReverseSpeed) {
            global[needUpdateRef] = true;

            if (speed <= -1e-12) {
                speed -= accelStep; // Ускоряемся
            } else {
                speed -= breakStep; // Тормозим
            }
        }
        if (Math.abs(speed) > 1e-12 && !drive && !reverse) {
            global[needUpdateRef] = true;
            if (speed > 1e-12) speed -= neutralStep; // Останавливаемя, если не едем
            if (speed < -1e-12) speed += neutralStep;
        }
    }, speedChangeInterval);

    // == Основной цикл контроллера ===
    function updatePlayer(x, y, a, input) {
        var radians = a * (Math.PI / 180);

        drive = input.drive;
        reverse = input.reverse;
        var left = input.left;
        var right = input.right;

        var dx = (Math.cos(radians)) * speed;
        var dy = (Math.sin(radians)) * speed;

        if (Math.abs(speed) > 1e-12) {
            x += dx;
            y += dy;
        }

        if (left) a -= rotationStep;
        if (right) a += rotationStep;

        a = (a + (360)) % 360;

        return { x: x, y: y, a: a };
    }

    // ---
    return updatePlayer;
}
exports.setup = setup;
