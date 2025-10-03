const FORWARD_PIN = D5;
const BACKWARD_PIN = D18;
const LEFT_PIN = D19;
const RIGHT_PIN = D23;

const FPS = 30;

const CELL_SCALE = 5;

var driveSpeed = 2;
var reverseSpeed = 1;

var needUpdate = true;

var x = 2;
var y = 2;
var a = 135;

// Setup
[
    FORWARD_PIN,
    BACKWARD_PIN,
    LEFT_PIN,
    RIGHT_PIN
].forEach((pin) => pin.mode("input"));

var radio = require("./radio").setup(FORWARD_PIN, BACKWARD_PIN, LEFT_PIN, RIGHT_PIN, "needUpdate");
var controller = require("./controller").setup(driveSpeed, reverseSpeed, "needUpdate");
var display = require("./display").setup(CELL_SCALE);
setInterval(() => {
    if (needUpdate) {
        var input = radio();

        var res = controller(x, y, a, input);
        x = res.x;
        y = res.y;
        a = res.a;

        display(x, y, a);

        needUpdate = input.drive || input.reverse || input.left || input.right;
    }
}, 1000 / FPS);
