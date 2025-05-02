import { QUESTIONS } from '../constants/questions';
import '../scss/styles.scss';
import {
  answersElement,
  correctAnswersElement,
  gameContainerElement,
  optionsContainerElement,
  outTimeAnswersElement,
  questionElement,
  rangeElement,
  rangeLabelElement,
  resultsElement,
  startGameButton,
  themeMessageElement,
  themesElement,
  timeElement,
  timeSelectionElement,
  wrongAnswersElement
} from './dom';

let gameQuestions = [];
let userAnswers = [];
let currentQuestion = 0;
let intervalId = null;
let selectedTime = 20;
let totalAnswers = rangeElement.value;

const clearGameState = () => {
  gameQuestions = [];
  userAnswers = [];
  currentQuestion = 0;
};

const createAnswerObject = (userAnswer, isCorrect) => ({
  userAnswer,
  isCorrect
});

const showResults = () => {
  const fragment = document.createDocumentFragment();

  gameQuestions.forEach((question, index) => {
    const userResponse = userAnswers[index];
    const answerContainer = document.createElement('div');
    const questionEl = document.createElement('p');
    questionEl.textContent = question.question;

    const correctAnswerEl = document.createElement('p');
    correctAnswerEl.textContent = `Respuesta correcta: ${question.answer}`;

    const userAnswerEl = document.createElement('p');
    userAnswerEl.textContent = userResponse?.userAnswer ?? '';

    answerContainer.append(questionEl, correctAnswerEl, userAnswerEl);

    if (!userResponse) {
      outTimeAnswersElement.append(answerContainer);
    } else if (userResponse.isCorrect) {
      correctAnswersElement.append(answerContainer);
    } else {
      wrongAnswersElement.append(answerContainer);
    }
  });
};

const showResultsContainer = () => {
  clearInterval(intervalId);
  gameContainerElement.classList.add('hide');
  optionsContainerElement.classList.add('hide');
  startGameButton.classList.add('hide');
  resultsElement.classList.remove('hide');
  showResults();
};

const showGameContainer = () => {
  optionsContainerElement.classList.add('hide');
  resultsElement.classList.add('hide');
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
      handleNoAnswer();
    }
  }, 1000);
};

const handleNoAnswer = () => {
  userAnswers.push(null);
  advanceToNextQuestion();
};

const advanceToNextQuestion = () => {
  currentQuestion++;
  if (currentQuestion >= gameQuestions.length) {
    showResultsContainer();
  } else {
    printQuestion();
  }
};

const printQuestion = () => {
  const current = gameQuestions[currentQuestion];
  questionElement.textContent = current.question;

  const shuffledOptions = [...current.options].sort(() => Math.random() - 0.5);
  [...answersElement.children].forEach((element, index) => {
    const option = shuffledOptions[index];
    element.textContent = option;
    element.dataset.answer = option;
  });

  setTimer();
};

const changeRangeLabel = event => {
  totalAnswers = event.target.value;
  rangeLabelElement.textContent = totalAnswers;
};

const setTimeSelected = event => {
  selectedTime = event?.target?.value || timeSelectionElement.querySelector('input:checked').value;
};

const getGameAnswers = () => {
  clearGameState();

  const selectedCategories = [...themesElement.querySelectorAll('.category-input:checked')];
  const allQuestions = selectedCategories.flatMap(input => QUESTIONS[input.value]);

  while (gameQuestions.length < totalAnswers) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const question = allQuestions[randomIndex];

    if (!gameQuestions.includes(question)) {
      gameQuestions.push(question);
    }
  }

  // Ocultar botón de jugar al iniciar el juego
  startGameButton.classList.add('hide');

  printQuestion();
  showGameContainer();
};

const setStartButtonState = () => {
  const categoriesChecked = [...themesElement.querySelectorAll('.category-input:checked')];
  const isValid = categoriesChecked.length > 0;

  themeMessageElement.textContent = isValid ? '' : 'Selecciona al menos un tema';
  startGameButton.disabled = !isValid;
};

const checkCorrectAnswer = event => {
  if (!event.target.dataset.answer) return;

  clearInterval(intervalId);

  const userAnswer = event.target.dataset.answer;
  const correctAnswer = gameQuestions[currentQuestion].answer;
  const isCorrect = userAnswer === correctAnswer;

  userAnswers.push(createAnswerObject(userAnswer, isCorrect));
  advanceToNextQuestion();
};

// EVENT LISTENERS
rangeElement.addEventListener('input', changeRangeLabel);
startGameButton.addEventListener('click', getGameAnswers);
themesElement.addEventListener('change', setStartButtonState);
timeSelectionElement.addEventListener('change', setTimeSelected);
answersElement.addEventListener('click', checkCorrectAnswer);
