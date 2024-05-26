const popupModal = document.querySelector(".popup");
const popupOverlay = document.querySelector(".pop-overlay");
const game = document.querySelector(".game");
const playButton = document.querySelector(".game .homepage .play");
const pausedOverlay = document.querySelector(".pause-overlay");
const homepage = document.querySelector(".game .homepage");
const body = document.querySelector(".body");
const infoIcon = document.querySelector(".info.icon");
const scoreWrapper = document.querySelector(".game .scoreWrapper");
const score = document.querySelector(".game .scoreItem .score");
const cardItems = document.querySelectorAll(".cards .card-item");
const textItems = document.querySelectorAll(
  ".match-cards .match-card-wrapper .match-card"
);
const cardsText = document.querySelectorAll(".cards .card-item .text");
const successModal = document.querySelector(".success-wrapper");
const arrows = document.querySelectorAll(".game .body .arrow");
const pauseButton = document.querySelector(".game .pause.icon");
const iconsArr = [...arrows, pauseButton];
let theTimer = 0,
animationCounter = 0,
 counter = 0,
 isRunning = false,
 textCounter = 0,
 wrongAnswers = 0;
const animateInfo = () => {
  infoIcon.classList.add("show");
  infoIcon.addEventListener("animationend", () => {
    setTimeout(() => {
      infoIcon.classList.remove("show");
      infoIcon.classList.add("hide");
    }, 1000);
  });
};
infoIcon.addEventListener("click", () => {
  infoIcon.classList.remove("hide");
  animateInfo();
});
const animateNext = (i) => {
  cardItems[i].style.visibility = "visible";
  cardItems[i].classList.add("show");
  cardItems[i].addEventListener("animationend", () => {
    if (cardItems[i].classList.contains("show")) {
      cardItems[i].classList.remove("show");
      if (animationCounter === cardItems.length - 1) {
        //animate text
        animateMatchCard();
      } else {
        animationCounter++;
        animateNext(animationCounter);
      }
    }
  });
};

function animateMatchCard() {

  textItems[textCounter].style.visibility = "visible";
  textItems[textCounter].classList.add("show");
  
  textItems[textCounter].addEventListener("animationend", () => {
    if (textItems[textCounter].classList.contains("show")) {
      textItems[textCounter].classList.remove("show");
      if (textCounter < textItems.length - 1) {
        textCounter++;
        animateMatchCard();
      } 
    }
  });
}

playButton.addEventListener("touchstart", () => {
  console.log('start');
  openFullscreen();
  document.querySelector("#start-audio").play();
  game.style.backgroundImage = "url(./media/images/bg2.png)";
  homepage.classList.add("hide");
  homepage.addEventListener("animationend", () => {
    homepage.classList.remove("hide");
    homepage.style.visibility = "hidden";
    scoreWrapper.style.visibility = "visible";
    score.textContent = `0/${textItems.length}`;
    body.classList.add("show");
    pauseButton.style.visibility = "visible";
    animateNext(animationCounter);
  });
  if (!isRunning) {
    startTimer();
  } else {
    stopTimer();
  }
});


pauseButton.addEventListener("touchstart", () => {
  const hiddenIcon = pauseButton.querySelector("i.hide");
  const shownIcon = pauseButton.querySelector("i:not(.hide)");
  hiddenIcon.classList.remove("hide");
  shownIcon.classList.add("hide");
  pausedOverlay.classList.toggle("hide");
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

textItems.forEach((textItem) => {
  textItem.addEventListener("touchstart", (event) => {
    event.stopPropagation();
    event.target.dataset.dragging = true;
    event.dataTransfer.setData("id", textItem.dataset.index);
    document.getElementById("start-audio").play();
  });
  textItem.addEventListener("drag", (event) => {
    textItem.style.opacity = "0";
  });
  textItem.addEventListener("touchend", (event) => {
    textItem.style.opacity = "1";
  });
});

cardsText.forEach((cardItem) => {
  cardItem.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  cardItem.addEventListener("drop", (event) => {
    event.preventDefault();
    const index = cardItem.dataset.index;
    const textId = event.dataTransfer.getData("id");
    const text = document.querySelector(
      `.match-cards .match-card-wrapper .match-card[data-index="${textId}"]`
    );
    if (index === textId) {
      cardItem.style.color = "inherit";
      const textContent = text.textContent;
      counter += 1;
      document.querySelector(
        ".score"
      ).textContent = `${counter}/${textItems.length}`;
      document
      .querySelector(":root")
      .style.setProperty("--width", `${(100 / textItems.length) * counter}%`);
      cardItem.textContent = textContent;
      cardItem.classList.add("active")
      cardItem.classList.add("animate");
      cardItem.addEventListener("animationend", () => {
        cardItem.classList.remove("animate");
      });
      text.style.visibility = "hidden";
      const audio = document.querySelector("#correct-audio");
      audio.play();
      audio.addEventListener("ended", () => {
        if (counter === cardsText.length) {

          const text = document.querySelector(".text-card .score-text");
          text.textContent = `${counter}/${cardsText.length}`;
          text.setAttribute("text", `${counter}/${cardsText.length}`);
          successModal.style.visibility = "visible";
          successModal.classList.add("show");
          overlay.classList.add("show");
          document.querySelector(`audio[id="success"]`).play();
        }
      });
    } else {
      wrongAnswers++;
      document.querySelector("#wrong-audio").play();
      text.classList.add("vibrate");
      text.addEventListener("animationend", () => {
        if (text.classList.contains("vibrate")) {
          text.classList.remove("vibrate");
        }
      });
    }
  });
});

const hideItems = () => {
  iconsArr.forEach((item) => {
    item.style.opacity = 0;
  });
};
let timer;
const resetTimer = () => {
  clearTimeout(timer);
  iconsArr.forEach((item) => {
    item.style.opacity = 1;
  });
  timer = setTimeout(hideItems, 3000);
};

document.addEventListener("mousemove", resetTimer);
document.addEventListener("touchstart", resetTimer);
const checkScreen = () => {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const isMobile = window.innerWidth < 768 && isPortrait;
  return isMobile;
};
window.addEventListener("load", () => {
  const is_mobile = checkScreen();
  if (is_mobile) {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  } else {
    game.style.visibility = "visible";
  }
  animateInfo();
});
document.addEventListener("contextmenu", function (event) {
  var target = event.target;
  if (target.tagName === "IMG") {
    event.preventDefault();
  }
  return false;
});
window.addEventListener("orientationchange", function () {
  const is_mobile = checkScreen();
  if (window.orientation === 90 || window.orientation === -90) {
    if (is_mobile) {
      game.style.visibility = "visible";
      popupModal.style.visibility = "hidden";
      popupOverlay.style.visibility = "hidden";
    } else {
      popupModal.style.visibility = "visible";
      popupOverlay.style.visibility = "visible";
    }
  } else {
    popupModal.style.visibility = "visible";
    popupOverlay.style.visibility = "visible";
  }
});


var elem = document.body;

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function startTimer() {
  if (!isRunning) {
    timerInterval = setInterval(function () {
      theTimer++;
      console.log("the timer is work....");
      console.log(theTimer);
    }, 1000);
    isRunning = true;
  }
}



function stopTimer() {
  clearInterval(timerInterval);
  console.log("the timer is stopped....");
  isRunning = false;
}


function loadScript(src){
  var script = document.querySelector(".script");
  console.log(script);
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function checkScript(){
  if('ontouchstart' in window){
    loadScript('./JS/mobil.js');
    console.log("mobil");
  }else{
    loadScript('./JS/script.js');
    console.log('computer');
  }
}
checkScript();