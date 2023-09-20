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
  xhr.open('GET',url,true);
  xhr.responseType = 'json';
  xhr.onload = function(){
    const status = xhr.status;
    if(status == 200){
      callback(null,xhr.response);
    }
    else{
      callback(status,xhr.response);
    }
  };
  xhr.send();
};



getJSON('https://api.openweathermap.org/data/2.5/weather?q=%20seoul&appid=475f32616c3a7d7421e40edcde2c0227&units=metric', function(err, data) {
  if (err !== null) {
    alert('예상치 못한 오류 발생.' + err);
  } else {
    const risingT = data.sys.sunrise;
    const setingT = data.sys.sunset;
    let Now = new Date()
    const hourNow = Now.getHours();
    const minNow = Now.getMinutes();
    let a = Date.parse(Now);
    if(a >= risingT && a < setingT){
      alert("입장 시각 : " + hourNow +"시 " + minNow +"분 ");
      window.location.href = 'Day-Dino.html';
    }
    else{
      alert("입장 시각 : " + hourNow +"시 " + minNow +"분 ");
      window.location.href = 'Night-Dino.html';
    }
  }
});
