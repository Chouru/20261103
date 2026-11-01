// 守宮飼養小達人 - 完整修復版 (包含嘶嘶氣音與完整語法)

let screen = "start"; // 畫面狀態: start, quiz, result
let currentQ = 0;
let score = 0;
let selectedOption = null;
let isAnswered = false;
let records = [];

let currentOptions = [];
let correctIndex = 0;
let hissNoise = null;
let hissTimeout = null;

const QUESTIONS = [
  {
    type: "anim",
    q: "動畫中顯示飼養箱的加溫熱區，請問守宮最適宜的加溫墊溫度應該設定在幾度？",
    options: ["31°C ~ 33°C", "20°C ~ 22°C", "40°C ~ 42°C", "不需要加溫"],
    answer: "31°C ~ 33°C",
    explain: "守宮需要適當的腸道消化熱能，熱區維持在 31°C–33°C 能幫助消化與代謝。"
  },
  {
    type: "anim",
    q: "動畫中守宮正在捕食，請問下列哪一種底材最安全、最不易造成守宮腸阻塞？",
    options: ["廚房紙巾", "細沙", "小顆粒碎石", "貓砂"],
    answer: "廚房紙巾",
    explain: "廚房紙巾乾淨安全且方便清理，能完全避免守宮捕食時誤食細沙導致腸阻塞。"
  },
  {
    type: "anim",
    q: "請問下列何者最適合做為守宮健康的主食？",
    options: ["杜比亞蟑螂或蟋蟀", "吃剩下的水果皮", "狗狗吃的乾飼料", "煮熟的白米飯"],
    answer: "杜比亞蟑螂或蟋蟀",
    explain: "守宮是純肉食性爬蟲類，主要以杜比亞蟑螂、蟋蟀等活體昆蟲為主食。"
  },
  {
    type: "anim",
    q: "動畫中守宮全身發白並開始用嘴撕啃身體，請問這時守宮是在做什麼？",
    options: ["正在正常脫皮並吃掉舊皮", "生病發霉變色", "身體太乾要洗澡", "受到外傷皮膚剝落"],
    answer: "正在正常脫皮並吃掉舊皮",
    explain: "守宮脫皮前身體會變白，脫皮時會自己撕下並吃掉舊皮以回收營養，這是正常現象。"
  },
  {
    type: "sound",
    q: "守宮在受到驚嚇或感受到威脅時，會發出像這樣的防禦聲音，請問這是什麼反應？",
    options: ["發出短促威嚇聲（嘶嘶聲）並張大嘴巴", "高興地搖尾巴跳舞", "翻肚皮睡覺", "學貓咪喵喵叫"],
    answer: "發出短促威嚇聲（嘶嘶聲）並張大嘴巴",
    explain: "守宮在極度緊張或受到威脅時會發出警告叫聲（嘶嘶聲），此時應給予安靜環境讓牠休息。"
  },
  {
    type: "anim",
    q: "動畫中飼主在餵食昆蟲前做了什麼動作？（昆蟲沾滿白色粉末）",
    options: ["沾上鈣粉與綜合維生素粉", "幫昆蟲洗澡泡水", "塗上甜甜的蜂蜜", "撒上麵粉增加熱量"],
    answer: "沾上鈣粉與綜合維生素粉",
    explain: "餵食前將昆蟲沾上鈣粉（Dusting）能補足人工飼養缺乏的營養，有效預防骨骼病變。"
  }
];

function setup() {
  createCanvas(800, 650);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240, 245, 240);
  
  if (screen === "start") {
    drawStartScreen();
  } else if (screen === "quiz") {
    drawQuizScreen();
  } else if (screen === "result") {
    drawResultScreen();
  }
}

function loadQuestion() {
  let q = QUESTIONS[currentQ];
  currentOptions = [...q.options];
  
  for (let i = currentOptions.length - 1; i > 0; i--) {
    let j = Math.floor(random(i + 1));
    let temp = currentOptions[i];
    currentOptions[i] = currentOptions[j];
    currentOptions[j] = temp;
  }
  correctIndex = currentOptions.indexOf(q.answer);

  if (q.type === "sound") {
    playGeckoHissSound();
  }
}

function drawStartScreen() {
  fill(30, 80, 50);
  textSize(36);
  text("🦎 守宮飼養小達人 🦎", width / 2, 150);
  
  fill(80);
  textSize(18);
  text("總共有 6 道題目，馬上來挑戰吧！", width / 2, 240);
  
  fill(40, 140, 90);
  rect(width / 2 - 100, 360, 200, 60, 10);
  fill(255);
  textSize(22);
  text("開始測驗", width / 2, 390);
}

function drawQuizScreen() {
  let q = QUESTIONS[currentQ];
  
  drawMediaAnimation(q.type);
  
  fill(50);
  textSize(16);
  text(`第 ${currentQ + 1} / ${QUESTIONS.length} 題 (${q.type === 'anim' ? '🎬 動畫題' : '🔊 聲音題'})`, width / 2, 220);
  
  textSize(20);
  fill(20);
  text(q.q, 100, 250, 600, 50);
  
  for (let i = 0; i < currentOptions.length; i++) {
    let y = 310 + i * 55;
    
    if (isAnswered) {
      if (currentOptions[i] === q.answer) {
        fill(60, 180, 90);
      } else if (currentOptions[i] === selectedOption) {
        fill(220, 80, 80);
      } else {
        fill(200);
      }
    } else {
      fill(255);
      stroke(150);
      strokeWeight(2);
    }
    
    rect(100, y, 600, 45, 8);
    noStroke();
    
    fill(isAnswered && (currentOptions[i] === q.answer || currentOptions[i] === selectedOption) ? 255 : 50);
    textSize(16);
    text(currentOptions[i], width / 2, y + 22.5);
  }
  
  if (isAnswered) {
    fill(50, 80, 120);
    textSize(15);
    text(q.explain, 100, 545, 600, 40);
    
    fill(40, 120, 200);
    rect(width / 2 - 80, 575, 160, 40, 8);
    fill(255);
    textSize(17);
    text(currentQ < QUESTIONS.length - 1 ? "下一題" : "看成績", width / 2, 595);
  }
}

function drawMediaAnimation(type) {
  push();
  fill(230, 235, 230);
  stroke(180);
  rect(100, 40, 600, 160, 8);
  noStroke();

  if (type === "anim") {
    fill(50);
    textSize(14);
    text("【飼養箱環境動態模擬：守宮日常活動】", width / 2, 60);
    
    let alphaVal = map(sin(frameCount * 0.1), -1, 1, 100, 200);
    fill(255, 120, 50, alphaVal);
    rect(130, 85, 220, 90, 6);
    fill(255);
    textSize(12);
    text("32°C 加溫熱區", 240, 130);
    
    fill(150, 200, 220);
    rect(370, 85, 300, 90, 6);
    fill(50);
    text("涼爽區", 520, 130);
    
    let geckoX = 220 + sin(frameCount * 0.04) * 80;
    let geckoY = 130;
    
    push();
    translate(geckoX, geckoY);
    
    stroke(180, 140, 90);
    strokeWeight(6);
    noFill();
    beginShape();
    vertex(-15, 0);
    bezierVertex(-35, -10, -45, 15, -60, 5);
    endShape();
    
    noStroke();
    fill(220, 180, 120);
    ellipse(0, 0, 42, 24);
    
    fill(120, 80, 40);
    ellipse(-8, -4, 6, 4);
    ellipse(4, 3, 7, 5);
    ellipse(-2, 5, 5, 3);
    
    fill(230, 190, 130);
    ellipse(25, 0, 22, 18);
    
    fill(50);
    ellipse(28, -4, 4, 6);
    ellipse(28, 4, 4, 6);
    
    fill(210, 170, 110);
    ellipse(10, -12, 12, 6);
    ellipse(10, 12, 12, 6);
    ellipse(-10, -12, 12, 6);
    ellipse(-10, 12, 12, 6);
    
    pop();

  } else {
    fill(50);
    textSize(14);
    text("🔊 【守宮嘶嘶聲模擬播放中】 點擊此區域可重播", width / 2, 60);
    
    stroke(180, 60, 60);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let x = 150; x <= 650; x += 6) {
      let y = 135 + random(-15, 15) * sin(frameCount * 0.5);
      vertex(x, y);
    }
    endShape();
    noStroke();
    
    fill(180, 60, 60);
    textSize(18);
    text("💨 嘶··· 嘶···（模擬音）", width / 2, 170);
  }
  pop();
}

function drawResultScreen() {
  fill(30, 80, 50);
  textSize(36);
  text("測驗結果", width / 2, 150);

  fill(50);
  textSize(24);
  text(`答對 ${score} / ${QUESTIONS.length} 題`, width / 2, 240);

  fill(80);
  textSize(18);
  let message = score === QUESTIONS.length
    ? "太棒了！你是守宮飼養小達人！"
    : score >= QUESTIONS.length / 2
      ? "做得不錯！再多了解一些守宮知識吧。"
      : "再接再厲，多學習正確的守宮飼養知識！";
  text(message, width / 2, 300);

  fill(40, 140, 90);
  rect(width / 2 - 100, 380, 200, 60, 10);
  fill(255);
  textSize(22);
  text("重新測驗", width / 2, 410);
}

function mousePressed() {
  if (screen === "start") {
    if (mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100 &&
        mouseY >= 360 && mouseY <= 420) {
      currentQ = 0;
      score = 0;
      records = [];
      selectedOption = null;
      isAnswered = false;
      screen = "quiz";
      loadQuestion();
    }
    return;
  }

  if (screen === "quiz") {
    let q = QUESTIONS[currentQ];

    if (q.type === "sound" &&
        mouseX >= 100 && mouseX <= 700 &&
        mouseY >= 40 && mouseY <= 200) {
      playGeckoHissSound();
      return;
    }

    if (!isAnswered) {
      for (let i = 0; i < currentOptions.length; i++) {
        let optionY = 310 + i * 55;
        if (mouseX >= 100 && mouseX <= 700 &&
            mouseY >= optionY && mouseY <= optionY + 45) {
          selectedOption = currentOptions[i];
          isAnswered = true;
          let isCorrect = selectedOption === q.answer;
          if (isCorrect) {
            score++;
          }
          playAnswerSound(isCorrect);
          records.push({ question: q.q, selectedOption, isCorrect });
          return;
        }
      }
      return;
    }

    if (mouseX >= width / 2 - 80 && mouseX <= width / 2 + 80 &&
        mouseY >= 575 && mouseY <= 615) {
      if (currentQ < QUESTIONS.length - 1) {
        currentQ++;
        selectedOption = null;
        isAnswered = false;
        loadQuestion();
      } else {
        screen = "result";
      }
    }
    return;
  }

  if (screen === "result" &&
      mouseX >= width / 2 - 100 && mouseX <= width / 2 + 100 &&
      mouseY >= 380 && mouseY <= 440) {
    currentQ = 0;
    score = 0;
    records = [];
    selectedOption = null;
    isAnswered = false;
    screen = "start";
  }
}

function playAnswerSound(isCorrect) {
  userStartAudio();

  let oscillator = new p5.Oscillator("sine");
  oscillator.amp(0);
  oscillator.start();
  oscillator.freq(isCorrect ? 660 : 330);
  oscillator.amp(0.2, 0.02);

  setTimeout(() => {
    oscillator.freq(isCorrect ? 880 : 220);
  }, 120);
  setTimeout(() => {
    oscillator.amp(0, 0.1);
  }, 240);
  setTimeout(() => {
    oscillator.stop();
  }, 400);
}

function playGeckoHissSound() {
  userStartAudio();

  if (hissTimeout !== null) {
    clearTimeout(hissTimeout);
    hissTimeout = null;
  }
  if (hissNoise !== null) {
    hissNoise.stop();
  }

  hissNoise = new p5.Noise("white");
  hissNoise.start();
  hissNoise.amp(0, 0);
  hissNoise.amp(0.18, 0.03);
  hissTimeout = setTimeout(() => {
    hissNoise.amp(0, 0.12);
    hissTimeout = setTimeout(() => {
      hissNoise.stop();
      hissNoise = null;
      hissTimeout = null;
    }, 180);
  }, 140);
}