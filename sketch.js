let mice = [];
let touchCount = 0;
let comboCount = 0;
let lastTouchTime = 0;
let touchRadius = 50;
let mouseCount = 5;
let bgm;
let touchSound;
let ComboSound; 
// 効果音用の変数
let ratImg;
let specialEffect = false;
let effectDuration = 2000; // 演出の持続時間（ミリ秒）
let effectStartTime = 0;

function preload() {
    ratImg = loadImage('Images/48813.png');
    bgm = loadSound('BGM/BGM.mp3');
    touchSound = loadSound('SE/SE_Gun.mp3');
    ComboSound = loadSound('SE/SE_comdo.mp3');  // 効果音の読み込み
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < mouseCount; i++) {
        mice.push(new Mouse());
    }

    bgm.loop();
    bgm.setVolume(0.2);
}

function draw() {
    if (specialEffect && millis() - effectStartTime < effectDuration) {
        // コンボ演出中は背景色を変更
        background(255, 223, 0); // 黄色背景
        fill(255, 0, 0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text("コンボ すごい！", width / 2, height / 2); // 特別メッセージ
    } else {
        // 通常状態
        background(245, 245, 220);
    }

    for (let i = 0; i < mice.length; i++) {
        mice[i].move();
        mice[i].display();
    }

    fill(0);
    textSize(32);
    text("Touch Count: " + touchCount, 10, 40);
    text("Combo Count: " + comboCount, 10, 80);
}

class Mouse {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
        this.speedX = random(2, 5);
        this.speedY = random(2, 5);
        this.maxSpeed = 5;
        this.acceleration = 0.05;
        this.angle = random(TWO_PI);
        this.turnChance = 0.01;
    }
    move() {
        if (random() < this.turnChance) {
            this.angle += random(-PI / 4, PI / 4);
        }

        this.speedX += cos(this.angle) * this.acceleration;
        this.speedY += sin(this.angle) * this.acceleration;

        let speed = dist(0, 0, this.speedX, this.speedY);
        if (speed > this.maxSpeed) {
            this.speedX = (this.speedX / speed) * this.maxSpeed;
            this.speedY = (this.speedY / speed) * this.maxSpeed;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // 画面外に出ないように制限
        if (this.x < 0) {
            this.x = 0; 
            this.speedX *= -1; // 反転
        }
        if (this.x > width) {
            this.x = width; 
            this.speedX *= -1; // 反転
        }
        if (this.y < 0) {
            this.y = 0; 
            this.speedY *= -1; // 反転
        }
        if (this.y > height) {
            this.y = height; 
            this.speedY *= -1; // 反転
        }
    }

    display() {
        image(ratImg, this.x, this.y, 50, 50);
    }

    isTouched(mx, my) {
        let d = dist(mx, my, this.x, this.y);
        return d < touchRadius;
    }
}

function mousePressed() {
    for (let i = 0; i < mice.length; i++) {
        if (mice[i].isTouched(mouseX, mouseY)) {
            touchCount++;

            let currentTime = millis();
            if (currentTime - lastTouchTime < 1000) {
                comboCount++;
            } else {
                comboCount = 1;
            }

            lastTouchTime = currentTime;

            // ネズミの位置をランダムに変更
            mice[i].reset(); // 位置と速度をリセット

            // コンボ数が5を超えたら特別な演出を開始
            if (comboCount > 5 && !specialEffect) {
                specialEffect = true;
                effectStartTime = millis();
                ComboSound.play();
            }
            if (touchSound.isLoaded()) {
                touchSound.setVolume(0.5);
                touchSound.play();  // 効果音再生
            } else {
                console.error("音がロードされていません");
            }

 
        }
    }
}
