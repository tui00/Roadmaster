// Controller
function setup(baseSpeed) {
    const trigSign = v => Math.abs(v) < 1e-12 ? 0 : Math.sign(v);
    // Комментарий: функция устраняет «дрожание» из-за неточных вычислений.
    // Если значение почти ноль (например, cos(90°) = 6.12e-17), оно обнуляется.
    // Иначе возвращается знак (+1 или -1). Это делает движение дискретным.

    function updatePlayer(x, y, a, input) {
        var radians = (a - 90) * (Math.PI / 180);
        // Комментарий: угол "a" хранится в градусах, но для cos/sin нужны радианы.
        // Смещение на -90° нужно, чтобы "0°" в логике программы совпадало с осью Y,
        // а не X, как в стандартной математике.

        var drive = input.drive;
        var reverse = input.reverse;
        var left = input.left;
        var right = input.right;

        var speedX = (trigSign(Math.cos(radians)) * baseSpeed);
        var speedY = (trigSign(Math.sin(radians)) * baseSpeed);

        if (drive) {
            x += speedX;
            y += speedY;
        } else if (reverse) {
            x -= speedX;
            y -= speedY;
        }
        if (left) a -= 45;
        if (right) a += 45;

        a = (a + (360)) % 360;

        return { x: x, y: y, a: a };
    }

    return updatePlayer;
}
exports.setup = setup;
