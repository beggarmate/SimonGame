const gameButtons = document.body.querySelector(".game__buttons");
const startGameButtons = document.body.querySelector(".start__button");
const restartGameButtons = document.body.querySelector(".restart__button");
const round = document.body.querySelector(".game__round");
const scoreElement = document.body.querySelector(".score__value");
const lossBox = document.body.querySelector(".loss__box");
const modalWindow = document.body.querySelector(".modal__window");
const returnGameInterfaseButton = document.body.querySelector(
  ".return-game-interfase__button"
);
const lossMessage = document.body.querySelector(".loss__message-value");

const systemAnswer = [];
const userAnswer = [];
const timeouts = [];

const clearSystemButtonsTimeouts = () => {
  timeouts.forEach((timeout) => clearTimeout(timeout));
  timeouts.length = 0;
};

const showLossMeassage = () => {
  lossMessage.textContent = `Очков набрано: ${scoreElement.textContent}`;
  modalWindow.classList.remove("display-none");
  lossBox.classList.remove("display-none");
};

const removeLossMessage = () => {
  modalWindow.classList.add("display-none");
  lossBox.classList.add("display-none");
};

returnGameInterfaseButton.addEventListener("mouseup", removeLossMessage);

const soundPaths = {
  1: "https://beggarmate.github.io/SimonGame/sound/zvuk-notyi-do-vtoraya-oktava.mp3",
  2: "https://beggarmate.github.io/SimonGame/sound/zvuk-notyi-fa-vtoraya-oktava.mp3",
  3: "https://beggarmate.github.io/SimonGame/sound/zvuk-notyi-lya-pervaya-oktava.mp3",
  4: "https://beggarmate.github.io/SimonGame/sound/zvuk-notyi-mi-pervaya-oktava.mp3",
};

const resetData = () => {
  clearSystemButtonsTimeouts();
  systemAnswer.length = 0;
  userAnswer.length = 0;
  scoreElement.textContent = 0;
  removePointerForButton();
};

const gameOver = () => {
  showLossMeassage();
  resetData();
  round.removeEventListener("click", roundEvent);
};

const roundWin = () => {
  round.removeEventListener("click", roundEvent);
  scoreElement.textContent = +scoreElement.textContent + 1;
  userAnswer.length = 0;
  setTimeout(gameProcess, 1000);
  removePointerForButton();
};

const numberButtonPressedUser = (button) => {
  if (button.className.includes("round__button")) {
    return +button.dataset.id;
  }
};

const userPressedButtonIsValid = () => {
  for (let i = 0; i < userAnswer.length; i++) {
    if (userAnswer[i] !== systemAnswer[i]) return false;
  }
  return true;
};

const numberButtonUserPressed = () => {
  if (userAnswer.length === systemAnswer.length) return true;
  return false;
};

const roundEvent = (event) => {
  const { target } = event;
  selectButtonHighlighter(numberButtonPressedUser(target));
  userAnswer.push(numberButtonPressedUser(target));
  if (!userPressedButtonIsValid()) {
    console.log("проиграл");
    gameOver();
  }
  if (numberButtonUserPressed() && userAnswer.length != 0) {
    console.log("ура");
    roundWin();
  }
};

const createRoundEvent = () => {
  createPointerForButton();
  round.addEventListener("click", roundEvent);
};

const allRoundButtons = document.querySelectorAll(".round__button");
const createPointerForButton = () => {
  allRoundButtons.forEach((elem) => {
    elem.classList.add("round__button-hover");
  });
};
const removePointerForButton = () => {
  allRoundButtons.forEach((elem) => {
    elem.classList.remove("round__button-hover");
  });
};

const swapButtonStartRestart = () => {
  startGameButtons.classList.add("display-none");
  restartGameButtons.classList.remove("display-none");
};

const createRandomNumber = () => {
  let randomNumber = Math.random().toFixed(2);
  return randomNumber;
};

const fortuneChooseButton = (number) => {
  if (number <= 0.25) {
    systemAnswer.push(1);
  }
  if (number > 0.25 && number <= 0.5) {
    systemAnswer.push(2);
  }
  if (number > 0.5 && number <= 0.75) {
    systemAnswer.push(3);
  }
  if (number > 0.75) {
    systemAnswer.push(4);
  }
};

const selectButtonHighlighter = (numberButton) => {
  const button = document.querySelector(`.round__button${numberButton}`);
  const sound = new Audio(soundPaths[numberButton]);
  let delay = 250;
  setTimeout(() => {
    button.classList.toggle("round__button-activited");
    sound.play();
  }, delay);
  setTimeout(() => {
    button.classList.toggle("round__button-activited");
  }, delay + 250);
};

const systemPressedButton = () => {
  clearSystemButtonsTimeouts();
  let delay = 1000;
  systemAnswer.forEach((item) => {
    const timeout = setTimeout(() => {
      selectButtonHighlighter(item);
    }, delay);
    timeouts.push(timeout);
    delay += 450;
  });
  setTimeout(createRoundEvent, delay);
};

const gameProcess = () => {
  swapButtonStartRestart();
  fortuneChooseButton(createRandomNumber());
  systemPressedButton();
};

const startGame = (event) => {
  const { target } = event;
  if (target === restartGameButtons) {
    resetData();
  }
  gameProcess();
};
gameButtons.addEventListener("mouseup", startGame);
