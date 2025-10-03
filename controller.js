// Controller
function setup(driveSpeed, reverseSpeed, needUpdateRef) {
    var drive = false;
    var reverse = false;
    var speed = 0;

    const trigSign = v => Math.abs(v) < 1e-12 ? 0 : Math.sign(v);
    // Комментарий: функция устраняет «дрожание» из-за неточных вычислений.
    // Если значение почти ноль (например, cos(90°) = 6.12e-17), оно обнуляется.
    // Иначе возвращается знак (+1 или -1). Это делает движение дискретным.

    function config() {
        setInterval(() => {
            if (drive && speed < driveSpeed) {
                speed++;
            } else if (reverse && -speed < reverseSpeed) {
                speed--;
            }
            if (speed != 0 && !drive && !reverse) {
                global[needUpdateRef] = true;
                if (speed > 0) speed--;
                if (speed < 0) speed++;
            }
        }, 500);
    }

    function updatePlayer(x, y, a, input) {
        var radians = (a - 90) * (Math.PI / 180);
        // Комментарий: угол "a" хранится в градусах, но для cos/sin нужны радианы.
        // Смещение на -90° нужно, чтобы "0°" в логике программы совпадало с осью Y,
        // а не X, как в стандартной математике.

        drive = input.drive;
        reverse = input.reverse;
        var left = input.left;
        var right = input.right;

        var dx = (trigSign(Math.cos(radians)) * speed);
        var dy = (trigSign(Math.sin(radians)) * speed);

        if (drive || reverse || speed != 0) {
            x += dx;
            y += dy;
        }

        if (left) a -= 45;
        if (right) a += 45;

        a = (a + (360)) % 360;

        return { x: x, y: y, a: a };
    }

    config();
    return updatePlayer;
}
exports.setup = setup;
