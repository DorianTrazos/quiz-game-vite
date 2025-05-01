import { QUESTIONS } from '../constants/questions';
import '../scss/styles.scss';
import {
  answersElement,
  gameContainerElement,
  optionsContainerElement,
  questionElement,
  rangeElement,
  rangeLabelElement,
  startGameButton,
  themeMessageElement,
  themesElement,
  timeElement
} from './dom';

let gameAnswers = [];
let userAnswers = [];
let currentQuestion = 0;
let intervalId = null;
const selectedTime = 60;

let totalAnswers = rangeElement.value;

const showGameContainer = () => {
  optionsContainerElement.classList.add('hide');
  startGameButton.classList.add('hide');
  // homeCardElement.classList.add('hide');
  gameContainerElement.classList.remove('hide');
};

const setTimer = () => {
  let remainingTime = selectedTime;
  timeElement.textContent = remainingTime;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    remainingTime--;
    timeElement.textContent = remainingTime;
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      currentQuestion++;
      printQuestion();
    }
  }, 1000);
  showGameContainer();
};

const printQuestion = () => {
  questionElement.textContent = gameAnswers[currentQuestion].question;
  [...answersElement.children]
    .sort(() => Math.random() - 0.5)
    .forEach((answer, index) => {
      const currentAnswer = gameAnswers[currentQuestion].options[index];
      answer.textContent = currentAnswer;
      answer.dataset.answer = currentAnswer;
    });

  setTimer();
};

const changeRangeLabel = event => {
  totalAnswers = event.target.value;
  rangeLabelElement.textContent = totalAnswers;
};

const getGameAnswers = () => {
  gameAnswers = [];
  const categorySelected = themesElement.querySelectorAll('.category-input:checked');
  const allQuestionsFromCategories = [];
  categorySelected.forEach(input => {
    allQuestionsFromCategories.push(...QUESTIONS[input.value]);
  });

  while (gameAnswers.length < totalAnswers) {
    const randomNumber = Math.floor(Math.random() * allQuestionsFromCategories.length);

    if (!gameAnswers.includes(allQuestionsFromCategories[randomNumber])) {
      gameAnswers.push(allQuestionsFromCategories[randomNumber]);
    }
  }
  console.log(gameAnswers);
  printQuestion();
};

const setStartButtonState = () => {
  const categorySelected = [...themesElement.querySelectorAll('.category-input:checked')];
  const areCategoriesSelected = categorySelected.some(input => input.checked);
  if (areCategoriesSelected) {
    themeMessageElement.textContent = '';
  } else {
    themeMessageElement.textContent = 'Selecciona al menos un tema';
  }
  startGameButton.disabled = !areCategoriesSelected;
};

const checkCorrectAnswer = event => {
  const correctAnswer = gameAnswers[currentQuestion].answer;
  const userAnswer = event.target.dataset.answer;

  userAnswers.push(userAnswer);

  if (correctAnswer === userAnswer) {
    console.log('OK');
  } else {
    console.log('ERROR');
  }

  if (currentQuestion === gameAnswers.length - 2) {
    console.log('LAST QUESTION');
  }
  currentQuestion++;
  printQuestion();
};

rangeElement.addEventListener('input', changeRangeLabel);
startGameButton.addEventListener('click', getGameAnswers);
themesElement.addEventListener('change', setStartButtonState);
answersElement.addEventListener('click', checkCorrectAnswer);
