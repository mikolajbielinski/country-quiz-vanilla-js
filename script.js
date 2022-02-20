"use strict";
import { getRandomNumber } from "./helper.js";

const appEl = document.querySelector(".app-container");

const state = {
  data: [],
  correctAnswer: "",
  currentRandomAnswerNumber: 0,
  currentQuestion: 0,
  currentBadAnswers: [0, 1, 2],
  answerStreak: 0,
  questions: ["is the capital of?", "Which country does this flag belong to?"],
  answerLetters: ["A", "B", "C", "D"],
};

const init = () => {
  fetchData();
  handleClicks();
};

const handleClicks = () => {
  appEl.addEventListener("click", (ev) => {
    if (ev.target.closest(".app-try-again-btn")) {
      newGame();
      return;
    }

    if (!ev.target.closest(".app-answer-container")) return;

    checkAnswer(ev.target.closest(".app-answer-container"));
  });
};

const checkAnswer = (answerEl) => {
  const answer = answerEl.querySelector(".app-answer-text").textContent;

  if (answer === state.correctAnswer) {
    answerEl.classList.add("correct-answer");
    goodAnswer();
    return;
  }
  answerEl.classList.add("incorrect-answer");
  badAnswer();
};

const badAnswer = () => {
  const elements = [...document.querySelectorAll(".app-answer-container")];
  elements.forEach((element) => {
    const elText = element.querySelector(".app-answer-text").textContent;
    if (elText === state.correctAnswer) element.classList.add("correct-answer");
  });

  appEl.insertAdjacentHTML(
    "beforeend",
    `<button class="app-next-btn">Next</button>`
  );
  document.querySelector(".app-next-btn").addEventListener("click", () => {
    const markup = ` <div class="results-container">
    <p class="app-result-text">Results</p>
    <p class="app-results-text">
      You got <span class="app-results-number">${state.answerStreak}</span> correct answers
    </p>
    <button class="app-try-again-btn">Try again</button>
  </div>`;
    appEl.innerHTML = "";
    generateAppItems(markup);
  });
};

const goodAnswer = () => {
  appEl.insertAdjacentHTML(
    "beforeend",
    `<button class="app-next-btn">Next</button>`
  );
  document.querySelector(".app-next-btn").addEventListener("click", () => {
    state.answerStreak++;
    appEl.innerHTML = "";
    createRandomData();
  });
};

const newGame = () => {
  state.answerStreak = 0;
  appEl.innerHTML = "";
  createRandomData();
};

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//GENERATE QUESTIONS AND ANSWERS
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

const getRandomQuestion = () => {
  state.currentQuestion = getRandomNumber(0, 2);
};

const getRandomAnswer = () => {
  const ranNum = getRandomNumber(0, 250);
  state.currentRandomAnswerNumber = ranNum;
  state.correctAnswer = state.data[ranNum].name.common;
};

const getRandomBadAnswers = () => {
  state.currentBadAnswers.forEach((_, index) => {
    state.currentBadAnswers[index] = getRandomNumber(0, 250);
    if (state.currentBadAnswers[index] === state.currentRandomAnswerNumber)
      getRandomBadAnswers();
  });
  if (
    state.currentBadAnswers.some(
      (val, i) => state.currentBadAnswers.indexOf(val) !== i
    )
  )
    getRandomBadAnswers();
};

const fetchData = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  state.data = await response.json();
  createRandomData();
};

const createRandomData = () => {
  getRandomQuestion();
  getRandomAnswer();
  getRandomBadAnswers();
  createQuestion();
  createAnswers();
};

const createQuestion = () => {
  if (state.currentQuestion === 0) {
    const markup = `<p class="app-question">${
      state.data[state.currentRandomAnswerNumber].capital[0]
    } ${state.questions[state.currentQuestion]}</p>`;
    generateAppItems(markup);
  }

  if (state.currentQuestion === 1) {
    const markup = `<img src="${
      state.data[state.currentRandomAnswerNumber].flags.png
    }" alt="some flag" class="app-flag" /><p class="app-question">${
      state.questions[state.currentQuestion]
    }</p>`;
    generateAppItems(markup);
  }
};

const generateAppItems = (markup) => {
  appEl.insertAdjacentHTML("beforeend", markup);
};

const createAnswers = () => {
  const arrAnswers = state.currentBadAnswers.map((value) => {
    return state.data[value].name.common;
  });
  arrAnswers.push(state.data[state.currentRandomAnswerNumber].name.common);
  const answersShuffled = arrAnswers.sort((a, b) => 0.5 - Math.random());

  const markup = state.answerLetters
    .map((letter, index) => {
      return `
    <div class="app-answer-container">
      <p class="app-answer-letter">${letter}</p>
      <p class="app-answer-text">${answersShuffled[index]}</p>
    </div>
  `;
    })
    .join("");
  generateAppItems(markup);
};

init();
