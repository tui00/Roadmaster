// === Пины для пульта ===
const UP_PIN = D5;
const DOWN_PIN = D18;
const LEFT_PIN = D19;
const RIGHT_PIN = D23;

// === Параметры дисплея и физики ===
const UPS = 60; // Updates per second
// -
const CELL_SCALE = 3;

// !!! Дальше то что лучше не трогать !!!

// === Доступные машины ===
const CARS = {
    YANDEX_SCOOTER: [1.5, 0.5, 0.15, 0.25, 0.2, "Yandex Scooter"],
    FORMULA_1: [8, 3, 1.2, 1.5, 0.05, "Formula 1"],
    KIA_SPORTAGE: [3.5, 1.5, 0.25, 0.35, 0.12, "Kia Sportage"],
    TOYOTA_CRETA: [3, 1, 0.2, 0.3, 0.15, "Toyota Creta"],
    VOLKSWAGEN_POLO: [2, 1, 0.2, 0.3, 0.1, "Volkswagen Polo"],

    NO_CAR: [0, 0, 0, 0, 0, "This is a bug!"], // Посхалочка
};

// === Текущяя машина
var currentCar = CARS.NO_CAR;

// === Параметры машины ===
const maxDriveSpeed = () => currentCar[0];
const maxReverseSpeed = () => currentCar[1];
// -
const accelStep = () => currentCar[2];
const breakStep = () => currentCar[3];
const neutralStep = () => currentCar[4];
// -
const rotationStep = 45;
// -
const speedChangeInterval = 100;

// === Меню ===
const MENU_UPDATE_INTERVAL = 255;
const MENU_HEADER_FONT_SIZE = 16;
const MENU_TEXT_FONT_SIZE = 8
const MENU_CARS_PER_PAGE = 4;

// === Програма ===
// Требуется обнавление?
var needUpdate = false;

// Установка пинов
[
    UP_PIN,
    DOWN_PIN,
    LEFT_PIN,
    RIGHT_PIN
].forEach((pin) => pin.mode("input"));
I2C1.setup({ scl: D21, sda: D22 });

// Положение и направление игрока
var x = 2;
var y = 2;
var a = 45; // a -- angle
var speed = 0;

function startMenuAndGame() {
    // Запуск меню
    require("./menu").show(
        UP_PIN,
        DOWN_PIN,
        RIGHT_PIN,
        MENU_UPDATE_INTERVAL,
        MENU_HEADER_FONT_SIZE,
        MENU_TEXT_FONT_SIZE,
        Object.values(CARS),
        MENU_CARS_PER_PAGE,
        "currentCar",
        "needUpdate"
    );

    function startGame() {
        // Настройка пульта
        var radio = require("./radio").setup(UP_PIN, DOWN_PIN, LEFT_PIN, RIGHT_PIN, "needUpdate");
        // Настройка машины
        var controller = require("./controller").setup(
            maxDriveSpeed(),
            maxReverseSpeed(),

            accelStep(),
            breakStep(),
            neutralStep(),

            rotationStep,

            speedChangeInterval,

            "speed",
            "needUpdate"
        );
        // Настройка дисплея
        var display = require("./display").setup(CELL_SCALE);

        // Цикл програмы
        setInterval(() => {
            if (needUpdate) {
                var input = radio(); // Считываем ввод

                var res = controller(x, y, a, input); // Вычисляем новые параметры игрока
                x = res.x; // Устанавливаем их
                y = res.y;
                a = res.a;

                display(x, y, a); // Выводим все на экран

                needUpdate = input.drive || input.reverse || input.left || input.right;
            }
        }, 1000 / UPS);// 1000 / UPS -- 1 сек / кол-во обнавлений в секунду
    }

    var id = setInterval(() => {
        if (needUpdate) {
            clearInterval(id);
            startGame();
        }
    }, 1000);
}

startMenuAndGame();
