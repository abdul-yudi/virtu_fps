window.addEventListener('load', function () {
  var score = 0;
  var timerDefault = 30;
  var timer = timerDefault;
  var timerInterval;
  var liveEnemy = 2;
  var targetDisappear = 3000;
  var winScore = 1000;
  var targetTimeout;
  var section1 = window.innerHeight / 2;
  var section2 = window.innerHeight * 2;
  var section3 = window.innerHeight * 3;
  var section4 = window.innerHeight * 4;
  var section5 = window.innerHeight * 5;
  var scrolled = false;
  var quitGame = false;

  // Dom
  var timerEl = document.querySelector('.timer strong');
  var scoreEl = document.querySelector('.score strong');
  var popUpStart = new bootstrap.Modal(document.getElementById('welcome_screen'));
  var popUpWin = new bootstrap.Modal(document.getElementById('win_screen'));
  var popUpLose = new bootstrap.Modal(document.getElementById('lose_screen'));
  var popUpStartEl = document.getElementById('welcome_screen');
  var popUpWinEl = document.getElementById('win_screen');
  var popUpLoseEl = document.getElementById('lose_screen');
  var infoEnemey = document.querySelector('.info-enemy');
  var scene = document.querySelector('a-scene');
  var canvas = document.querySelector('.a-canvas');
  var infoGood = document.querySelector('.info-good');
  var btnQuit = document.querySelector('.quit');
  var gun = document.getElementById('gun');
  var camera = document.getElementById('camera');

  // Back to default scroll
  window.scrollTo(0, 0);
  document.body.style.overflow.y = 'auto';

  // Generate random array number
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var arr = [];
    var generated = Math.floor(Math.random() * (max - min + 1)) + min;
    arr.push(generated)
    return arr;
  }

  // Generate target
  function generateTarget(){
    clearTimeout(targetTimeout);
    removeAllTarget();
    liveEnemy = 2;
    
    if(score === winScore) return;
    if(timer === 0) return;
    if(quitGame) return;

    var itemsX = getRandomInt(-10, 10);
    var itemsY = getRandomInt(1, 7);
    var items2X = getRandomInt(-10, 10);
    var items2Y = getRandomInt(1, 7);

    // Create enemy 1
    itemsX.map(function(posX){
      itemsY.map(function(posY){
        var targetEl1 = document.createElement('a-ring');
        var targetEl1Inside = document.createElement('a-ring');
        targetEl1.setAttribute('id', 'target2');
        targetEl1.setAttribute('class', 'target');
        targetEl1.setAttribute('radius-outer', '0.6');
        targetEl1.setAttribute('radius-inner', '0.3');
        targetEl1.setAttribute('position', {x: posX, y:posY, z: '-3.2'});
        targetEl1.setAttribute('color', 'gray');
        targetEl1.setAttribute('ammo-body', {type: 'static', emitCollisionEvents: true});
        targetEl1.setAttribute('ammo-shape', {type: 'sphere'});
        targetEl1.setAttribute('look-at', '#camera');
        targetEl1Inside.setAttribute('radius-outer', '0.3');
        targetEl1Inside.setAttribute('radius-inner', '0.001');
        targetEl1Inside.setAttribute('color', 'red');
        targetEl1.appendChild(targetEl1Inside)
        scene.appendChild(targetEl1)

        targetEl1.addEventListener("collidestart", function(e){
          hitTarget(targetEl1, e);
        });
      });
    });

    // Create enemy 2
    items2X.map(function(pos2X){
      items2Y.map(function(pos2Y){
        var targetEl2 = document.createElement('a-ring');
        var targetEl2Inside = document.createElement('a-ring');
        targetEl2.setAttribute('id', 'target2');
        targetEl2.setAttribute('class', 'target');
        targetEl2.setAttribute('radius-outer', '0.6');
        targetEl2.setAttribute('radius-inner', '0.3');
        targetEl2.setAttribute('position', {x: pos2X, y:pos2Y, z: '-3.2'});
        targetEl2.setAttribute('color', 'gray');
        targetEl2.setAttribute('ammo-body', {type: 'static', emitCollisionEvents: true});
        targetEl2.setAttribute('ammo-shape', {type: 'sphere'});
        targetEl2.setAttribute('look-at', '#camera');
        targetEl2Inside.setAttribute('radius-outer', '0.3');
        targetEl2Inside.setAttribute('radius-inner', '0.001');
        targetEl2Inside.setAttribute('color', 'red');
        targetEl2.appendChild(targetEl2Inside)
        scene.appendChild(targetEl2)

        targetEl2.addEventListener("collidestart", function(e){
          hitTarget(targetEl2, e);
        });
      });
    });

    // Enemey dissapear
    targetTimeout = setTimeout(() => {
      generateTarget();
    }, targetDisappear);

    // Show enemy info
    infoEnemey.style.display = 'block';
    var timOutInfoEnemy = setTimeout(() => {
      infoEnemey.style.display = 'none';
      clearTimeout(timOutInfoEnemy);
    }, 1000);
  }

  function removeAllTarget(){
    if(document.querySelectorAll('.target') !== []){
      document.querySelectorAll('.target').forEach(el => {
        el.remove();
      });
    }
  }

  // Win
  function win(){
    clearInterval(timerInterval);
    popUpWin.show();
    removeAllTarget();
  }
  
  // Time out
  function timeOut(){
    removeAllTarget();
    popUpLose.show();
  }

  // Timer
  function setTimer() {
    if (timer > 0) {
      timer--;
      timerEl.innerHTML = timer;
    } else {
      timeOut();
    }
  };
    
  // Initial game
  function initGame(){
    clearInterval(timerInterval);
    timer = timerDefault;
    timerEl.innerHTML = timer;
    timerInterval = setInterval(setTimer, 1000);
    score = 0;
    scoreEl.innerHTML = score.toLocaleString('id');
    generateTarget();
  };

  // Reset game
  function resetGame(){
    initGame();
  }

  // Add score
  function hitTarget(elem, collider){
    if(collider.detail.targetEl.getAttribute('mixin') === 'bullet'){
      elem.setAttribute('color', 'black');
      collider.detail.targetEl.remove();
      if(!elem.classList.contains('dead-target')){
        elem.classList.add('dead-target');
        score += 100;
        liveEnemy -= 1;
        scoreEl.innerHTML = score.toLocaleString('id');
      }

      if(liveEnemy === 0){
        clearTimeout(timeOutGenerate);
        var timeOutGenerate = setTimeout(function(){
          generateTarget();
        }, 300);
        
        infoGood.style.display = 'block';
        var timeOutInfoGood = setTimeout(() => {
          infoGood.style.display = 'none';
          clearTimeout(timeOutInfoGood);
        }, 1000);
      }

      if(score === winScore){
        win();
      }
    }
  }

  // Function animate scroll
  function scrollAnimate({'x': fromX, 'y': fromY, 'z': fromZ}, {'x': toX, 'y': toY, 'z': toZ}, section) {
      section;
      var diffX = toX - fromX;
      var diffY = toY - fromY;
      var diffZ = toZ - fromZ;
      return {
        'x': fromX + document.documentElement.scrollTop / section * diffX,
        'y': fromY + document.documentElement.scrollTop / section * diffY,
        'z': fromZ + document.documentElement.scrollTop / section * diffZ
      }
  };

  // Function quit
  function quit(){
    document.querySelectorAll('.board').forEach(function(el){
      el.style.display = 'none';
    });
    quitGame = true;
    clearInterval(timerInterval);
    document.body.style.overflow.y = 'auto';
    canvas.style.pointerEvents = 'unset';
    btnQuit.style.display = 'none';
    scrolled = false;
  }

  // Animation gun
  function animationGun(){
    // page 1
    if(document.documentElement.scrollTop >= 0 && document.documentElement.scrollTop < section1){
      scrolled = true;
      gun.setAttribute('rotation', scrollAnimate({'x': 0, 'y': -90, 'z': 0}, {'x': 0, 'y': -90, 'z': 0}, section1));
      gun.setAttribute('position', scrollAnimate({'x': -0.25, 'y': 0.05, 'z': -3.54}, {'x': -0.25, 'y': 0.05, 'z': -3.54}, section1));
      
      document.querySelector('.info-page-1').style.display = 'block';
      document.querySelector('.info-page-2').style.display = 'none';
      document.querySelector('.info-page-3').style.display = 'none';
      document.querySelector('.info-page-4').style.display = 'none';
      document.body.style.overflow.y = 'auto';
      btnQuit.style.display = 'none';

      popUpStart.hide();
    }

    // page 2
    if(document.documentElement.scrollTop >= section1 && document.documentElement.scrollTop < section2){
      scrolled = true;
      gun.setAttribute('rotation', scrollAnimate({'x': 0, 'y': -90, 'z': 0}, {'x': 6, 'y': -148, 'z': 0}, section2));
      gun.setAttribute('position', scrollAnimate({'x': -0.25, 'y': 0.05, 'z': -3.54}, {'x': -0.9, 'y': -0.2, 'z': -2}, section2));

      document.querySelector('.info-page-1').style.display = 'none';
      document.querySelector('.info-page-2').style.display = 'block';
      document.querySelector('.info-page-3').style.display = 'none';
      document.querySelector('.info-page-4').style.display = 'none';
      document.body.style.overflow.y = 'auto';
      btnQuit.style.display = 'none';
      
      popUpStart.hide();
    }

    // page 3
    if(document.documentElement.scrollTop >= section2 && document.documentElement.scrollTop < section3){
      scrolled = true;
      gun.setAttribute('rotation', scrollAnimate({'x': 6, 'y': -148, 'z': 0}, {'x': 0, 'y': -140, 'z': 0}, section3));
      gun.setAttribute('position', scrollAnimate({'x': -0.9, 'y': -0.2, 'z': -2}, {'x': 0, 'y': 1, 'z': -1}, section3));

      document.querySelector('.info-page-1').style.display = 'none';
      document.querySelector('.info-page-2').style.display = 'none';
      document.querySelector('.info-page-3').style.display = 'block';
      document.querySelector('.info-page-4').style.display = 'none';
      document.body.style.overflow.y = 'auto';
      btnQuit.style.display = 'none';

      popUpStart.hide();
    }

    // page 4
    if(document.documentElement.scrollTop >= section3 && document.documentElement.scrollTop < section4){
      scrolled = true;
      gun.setAttribute('rotation', scrollAnimate({'x': 0, 'y': -140, 'z': 0}, {'x': 2.3, 'y': -360, 'z': 0}, section4));
      gun.setAttribute('position', scrollAnimate({'x': 0, 'y': 1, 'z': 0}, {'x': 0, 'y': -0.8, 'z': 0}, section4));

      document.querySelector('.info-page-1').style.display = 'none';
      document.querySelector('.info-page-2').style.display = 'none';
      document.querySelector('.info-page-3').style.display = 'none';
      document.querySelector('.info-page-4').style.display = 'block';

      document.body.style.overflow.y = 'auto';
      btnQuit.style.display = 'none';
      popUpStart.hide();
    }

    // play
    if(document.documentElement.scrollTop >= section4){
      gun.setAttribute('rotation', scrollAnimate({'x': 2.3, 'y': -360, 'z': 0}, {'x': 2.3, 'y': -360, 'z': 0}, section5));
      gun.setAttribute('position', scrollAnimate({'x': 0, 'y': -0.8, 'z': 0}, {'x': 0, 'y': -0.8, 'z': 0}, section5));

      document.querySelectorAll('.info-page').forEach(function(el){
        el.style.display = 'none';
      })

      if(gun.getAttribute('rotation').y < -359 && scrolled){
        document.body.style.overflow = 'hidden';
        document.querySelectorAll('.board').forEach(function(el){
          el.style.display = 'block';
          btnQuit.style.display = 'block';
        });
        popUpStart.show();
      }
    }
  }

  // Start animate gun
  animationGun();

  // Start animate gun on scroll
  window.addEventListener("scroll", function(){
    animationGun();
  });

  // Lose popup hide
  popUpLoseEl.addEventListener('hidden.bs.modal', function(){
    resetGame();
  });

  // Win popup hide
  popUpWinEl.addEventListener('hidden.bs.modal', function(){
    resetGame();
  });

  // Start popup hide
  popUpStartEl.addEventListener('hidden.bs.modal', function(){
    quitGame = false;
    canvas.style.pointerEvents = 'unset';
    initGame();
  });

  // Quit
  btnQuit.addEventListener('click', function(){
    quit();
  });
  
  // Remove fps mouse on mobile
  if(window.navigator.maxTouchPoints > 0){
    camera.removeAttribute('fps-look-controls');
  }
});
