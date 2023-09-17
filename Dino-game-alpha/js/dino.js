const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score; //현재 점수
let scoreText; //현재 점수 텍스트
let highscore; //최고 점수
let highscoreText; //최고 점수 텍스트
let dino; //공룡
let gravity; // 중력값
let obstacles = []; //장애물
let gameSpeed; // 게임 속도
let keys = {}; // 키 값
let hp = 100;

let tempSeoul = 0;
//이벤트 리스너 추가
document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

const getJSON = function(url, callback){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json'
  xhr.onload = function() {
    const status = xhr.status;
    if(status === 200){
      callback(null, xhr.response);
    }
    else{
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

getJSON('https://api.openweathermap.org/data/2.5/weather?q=%20seoul&appid=475f32616c3a7d7421e40edcde2c0227&units=metric'
,
function(err, data){
  if(err !== null){
    alert('예상치 못한 오류 발생.' + err);
  }
  else{
    tempSeoul = data.main.temp;
    alert(`현재
      온도는 ${data.main.temp}°
      풍속은 ${data.wind.speed}m/s
      습도는 ${data.main.humidity}%
      입니다.

      오늘의
        최고기온은 ${data.main.temp_max}°
        최저기온은 ${data.main.temp_min}°
      입니다.`)
  }
});

var current = new Date(); //현재 시간을 가진 Date객체 생성
if(current.getHours() >= 6 && current.getHours() <= 17) //만약 접속 시간때가 낮이면
  document.body.style.backgroundColor = "violet";
else //밤이면
/*
  document.body.style.background = "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('BG-image/7.jpg')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  */
    // 밤인 경우 다른 HTML 파일 내용을 가져와서 표시
    window.location.href = "Night-Dino.html";






class Text{
  constructor(t, x, y, a, c, s){
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw(){
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }

}

class Obstacle{
  constructor(x, y, w, h, c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
    this.isBird = false;
  }

  Update(){
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw(){
    var img = new Image()
    if(this.isBird == true){
      img.src = 'bird.png'
      ctx.drawImage(img,this.x, this.y, this.w, this.h);
    }
    else{
      img.src = 'catus.png'
      ctx.drawImage(img,this.x, this.y, this.w, this.h)
    }
  }
}

class Dino {
    constructor (x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;
  
      this.dy = 0; //점프를 위한 
      this.jumpForce = 15; //
      this.originalHeight = h; //숙이기 전 높이
      this.grounded = false; //땅에 있는지 판단
      this.jumpTimer =0 ; // 점프 시간 체크를 위한 타이머 추가
    }

    Draw(){
        var img = new Image()
        if((keys['ShiftLeft'] || keys['KeyS']) && this.grounded){
          img.src = 'dino_down.png'
          ctx.drawImage(img,this.x, this.y, this.w, this.h)
        }
        else{
          if(tempSeoul<15){
          img.src = 'ena.png'
        ctx.drawImage(img,this.x, this.y, this.w, this.h);
      }
      else{
        img.src = 'dino_up.png'
        ctx.drawImage(img,this.x, this.y, this.w, this.h);
      }
    }
  }

    Jump () { //점프함수 추가
        if (this.grounded && this.jumpTimer == 0) {  //땅에 있는지 && 타이머 =0 
          this.jumpTimer = 1;
          this.dy = -this.jumpForce; 
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
          this.jumpTimer++;
          this.dy = -this.jumpForce - (this.jumpTimer / 50); //갈수록 빠르게 떨어지는 것 구현
        }
    }

    Animate () {
        // 키 입력 
        if (keys['Space'] || keys['KeyW']) { // 스페이스바 or 키보드 W 입력시
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }
    
        if ((keys['ShiftLeft'] || keys['KeyS']) && this.grounded) {  // 왼쉬프트 or 키보드 S 입력시
            this.y += this.h/2 
            this.h = this.originalHeight / 2; //h를 절반으로 줄여서 숙인 것과 같은 효과
        } else {
            this.h = this.originalHeight;
        }
    
        this.y += this.dy; //위치 변경

        //중력적용
        if (this.y + this.h < canvas.height) { //공중에 떠 있을 때
          this.dy += gravity; // 중력만큼 dy++
          this.grounded = false; 
        } else {
          this.dy = 0; 
          this.grounded = true;
          this.y = canvas.height - this.h; //바닥에 딱 붙어 있게 해줌
        }

        this.Draw();
      }
  }

  function init() {
    obstacles = [];
    score = 0;
    spawnTimer = initialSpawnTimer;
    gameSpeed = 3;
    hp = 100;

    window.localStorage.setItem('highscore', highscore);
    alert("저런! 게임오버!");
  }

function SpawnObstacle(){
  let size = RandomIntRange(20, 70);
  let type = RandomIntRange(0, 1);
  let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4')

  if(type == 1){
    obstacle.y -= dino.originalHeight - 10;
    obstacle.isBird = true;
  }
  obstacles.push(obstacle);
}

function RandomIntRange (min, max){
  return Math.round(Math.random() * (max - min) + min);
}

function Start () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    ctx.font = "20px sans-serif";
  
    gameSpeed = 3;
    gravity = 1;
  
    score = 0;
    highscore = 0;
    
  if(localStorage.getItem('highscore')){
    highscore = localStorage.getItem('highscore');
  }

    dino = new Dino(25,canvas.height-150,50,50,"pink");
    scoreText = new Text("Score: " + score, 25, 25, "left", "#ffffff", "20")
    hpText = new Text("HP : " + hp, 25,50, "left","red","20")
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#ffffff", "20");

    requestAnimationFrame(Update); 
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update () {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dino.Animate(); 

    spawnTimer--;
    if(spawnTimer <= 0){
      SpawnObstacle();
      console.log(obstacles);
      spawnTimer = initialSpawnTimer - gameSpeed * 8;

      if(spawnTimer < 60){
        spawnTimer = 60;
      }
    }

    for(let i = 0; i<obstacles.length; i++){
      let o = obstacles[i];

      if(o.x + o.w < 0){
        obstacles.splice(i, 1);
      }
      if(
        dino.x < o.x + o.w &&
        dino.x + dino.w > o.x &&
        dino.y < o.y + o.h &&
        dino.y + dino.h > o.y
      ){
        hp --;
        if(hp <= 0){
            init();
        }
      }
      o.Update();
    }
    score++;
    scoreText.t = "Score: " + score;
    scoreText.Draw();
    hpText.t = "HP : " + hp;
    hpText.Draw();

    if(score > highscore){
      highscore = score;
      highscoreText.t = "Highscore: " + highscore;
    }

    highscoreText.Draw();

    gameSpeed += 0.003;
}  
Start();