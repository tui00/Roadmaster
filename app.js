// === Пины для пульта ===
const FORWARD_PIN = D5;
const BACKWARD_PIN = D18;
const LEFT_PIN = D19;
const RIGHT_PIN = D23;

// === Параметры дисплея и физики ===
const UPS = 60; // Updates per second
// -
const CELL_SCALE = 4;

// === Текущяя машина
const currentCar = () => CARS.VOLKSWAGEN_POLO;


// !!! Дальше то что лучше не трогать !!!

// === Доступные машины ===
const CARS = {
  YANDEX_SCOOTER: {
    maxDriveSpeed: 1.5,
    maxReverseSpeed: 0.5,
    accelStep: 0.15,
    breakStep: 0.25,
    neutralStep: 0.2,
  },

  FORMULA_1: {
    maxDriveSpeed: 8,
    maxReverseSpeed: 3,
    accelStep: 1.2,
    breakStep: 1.5,
    neutralStep: 0.05,
  },

  KIA_SPORTAGE: {
    maxDriveSpeed: 3.5,
    maxReverseSpeed: 1.5,
    accelStep: 0.25,
    breakStep: 0.35,
    neutralStep: 0.12,
  },

  TOYOTA_CRETA: {
    maxDriveSpeed: 3,
    maxReverseSpeed: 1,
    accelStep: 0.2,
    breakStep: 0.3,
    neutralStep: 0.15,
  },

  VOLKSWAGEN_POLO: {
    maxDriveSpeed: 2,
    maxReverseSpeed: 1,
    accelStep: 0.2,
    breakStep: 0.3,
    neutralStep: 0.1,
  }
};
// === Параметры машины ===
const maxDriveSpeed = currentCar().maxDriveSpeed;
const maxReverseSpeed = currentCar().maxReverseSpeed;
// -
const accelStep = currentCar().accelStep;
const breakStep = currentCar().breakStep;
const neutralStep = currentCar().neutralStep;
// -
const rotationStep = 45;
// -
const speedChangeInterval = 100;

// === Програма ===
// Требуется обнавление?
var needUpdate = true;

// Положение и направление игрока
var x = 2;
var y = 2;
var a = 45; // a -- angle

// Установка пинов в режим ввода
[
    FORWARD_PIN,
    BACKWARD_PIN,
    LEFT_PIN,
    RIGHT_PIN
].forEach((pin) => pin.mode("input"));

// Настройка пульта
var radio = require("./radio").setup(FORWARD_PIN, BACKWARD_PIN, LEFT_PIN, RIGHT_PIN, "needUpdate");
// Настройка машины
var controller = require("./controller").setup(
    maxDriveSpeed,
    maxReverseSpeed,

    accelStep,
    breakStep,
    neutralStep,
    
    rotationStep,
    
    speedChangeInterval,

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
}, 1000 / UPS); // 1000 / UPS -- 1 сек / кол-во обнавлений в секунду
