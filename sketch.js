let mice = [];
let touchCount = 0;
let comboCount = 0;
let lastTouchTime = 0;
let touchRadius = 200;
let mouseCount = 3;
let bgm;
let touchSound;
let ComboSound; 
// 効果音用の変数
let ratImg;
let specialEffect = false;
let effectDuration = 2000; // 演出の持続時間（ミリ秒）
let effectStartTime = 0;
let startFrame = 0;
let holdFrames = 60;
let isHolding = false;  // 命令保持の状態

function preload() {
    ratImg = loadImage('48813.png');
    bgm = loadSound('BGM.mp3');
    touchSound = loadSound('SE_Gun.mp3');
    ComboSound = loadSound('SE_comdo.mp3');  // 効果音の読み込み
}

function setup() {
    createCanvas(windowWidth, windowHeight);

            // タッチスクロール防止
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    });

    // for (let i = 0; i < mouseCount; i++) {
    //     mice.push(new Mouse());
    // }

    mice.push(new Mouse());

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
        this.stopDuration = 5; // 停止状態を持続するフレーム数（60フレーム）
        this.stopFrames = 0;    // 停止を維持するフレーム数をカウント
    }

    reset() {
        this.x = random(width);
        this.y = random(height);
        this.speedX = random(2, 5);
        this.speedY = random(2, 5);
        this.maxSpeed = 30;
        this.acceleration = 3;
        this.angle = random(TWO_PI);
        this.turnChance = 0.3;
        this.stopChance = 0.03;
    }
    move() {
        if (random() < this.turnChance) {
            this.angle += random(-PI / 4, PI / 4);
        }
        if (this.stopFrames > 0) {
            // 停止状態がまだ続いている間
            this.stopFrames--;
            this.speedX = 0;
            this.speedY = 0;
        }

        if (random() < this.stopChance) {
          
            this.stopFrames = this.stopDuration;
            
        }

        this.speedX += cos(this.angle) * this.acceleration*random();
        this.speedY += sin(this.angle) * this.acceleration*random();

        let speed = dist(0, 0, this.speedX, this.speedY);
        if (speed > this.maxSpeed) {
            this.speedX = (this.speedX / speed) * this.maxSpeed;
            this.speedY = (this.speedY / speed) * this.maxSpeed;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // 画面外に出ないように制限
        if (this.x < 75) {
            this.x = 75; 
            this.speedX *= -2; // 反転
        }
        if (this.x > width-75) {
            this.x = width-75; 
            this.speedX *= -2; // 反転
        }
        if (this.y < 100) {
            this.y = 100; 
            this.speedY *= -2; // 反転
        }
        if (this.y > height-100) {
            this.y = height-100; 
            this.speedY *= -2; // 反転
        }
    }

    display() {
        // 画像を進行方向に回転させる
        // 進行方向を速度ベクトルから計算
        let angle = atan2(this.speedY, this.speedX); // speedX, speedYから角度を算出
        push(); // 現在の状態を保存
        translate(this.x + 75, this.y + 100); // 画像の中心に移動
        rotate(angle-PI/2); // 進行方向に回転
        image(ratImg, -75, -50, 150, 200); // 画像を描画（中心が (x, y) になるように）
        pop(); // 保存した状態を復元
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
            if (currentTime - lastTouchTime < 3000) {
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
