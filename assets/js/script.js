let quizData = [];
let displayQuestion = [];
fetch("question.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  })
  .then((data) => {
    quizData = data;
    console.log("Quiz questions fetched successfully:", quizData);
    document.getElementById("start-btn").addEventListener("click", startQuiz);
  })
  .catch((error) => {
    console.error("Error fetching quiz questions:", error);
  });

let currentQuestion = 0;
let score = 0;
let attemptCount =0, correctCount=0;
let difficultyLevel = "easy";
const timePerQuestion = 20;
let timerInterval;
let correctOption;
const xmark = document.getElementById("cross");
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const qSection = document.querySelector(".Q-section");
const qCounter = document.querySelector("#Q-counter");
const feedbackElement = document.getElementById("feedback");
document.getElementById("start-btn").addEventListener("click", startQuiz);
function startQuiz() {
  difficultyLevel = document.getElementById("difficulty").value;
  const filteredQuestions = quizData.filter(
    (question) => question.difficulty === difficultyLevel
  );
  qSection.style.display = "block";
  shuffleArray(filteredQuestions);
  score = 0;
  currentQuestion = 0;
  correctCount =0;
  attemptCount =0;
  displayQuestion = filteredQuestions;
  loadQuestion();
  quizContainer.style.display = "block";
  quizContainer.style.top = "0px";
}

function shuffleArray(array) {
  let size = array.length;
  for (let i = size - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadQuestion() {
  const currentQuizData = displayQuestion[currentQuestion];
  questionElement.innerText = currentQuizData.question;
  optionsElement.innerHTML = "";
  startTimer();
  qCounter.innerText = `Question ${currentQuestion+1}/25`;
  currentQuizData.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.innerText = option;
    correctOption = optionElement;
    optionElement.addEventListener("click", () => checkAnswer(index));
    optionsElement.appendChild(optionElement);
  });
}
let progressBar = document.querySelector(".progress-bar");
function checkAnswer(selectedOption) {
  stopTimer();
  const currentQuizData = displayQuestion[currentQuestion];
  const options = optionsElement.querySelectorAll(".option");
  if (selectedOption === -1) {
    setTimeout(() => {
      feedbackElement.style.bottom = "-40px";
    }, 2000);
    feedbackElement.style.bottom = "60px";
  } else if (
    currentQuizData.options[selectedOption] === currentQuizData.correctAnswer
  ) {
    options[selectedOption].classList.add("correct");
    score++;
    attemptCount++;
    correctCount++;
  } else {
    options[selectedOption].classList.add("wrong");
    attemptCount++;
  }

  currentQuestion++;
  progressBar.style.display = "block";

  setTimeout(() => {
    progressBar.style.display = "none";
    if (currentQuestion < displayQuestion.length) {
      loadQuestion();
    } else {
      endQuiz();
    }
  }, 2000);
}
const scoreField = document.getElementById("score");
const qAttempted = document.getElementById("attempted");
const qCorrect = document.getElementById("correct");
const qIncorrect = document.getElementById("incorrect");
const percent = document.getElementById("percentage");
function endQuiz() {
    qSection.style.display = "none";
    optionsElement.style.display = "none";
    document.querySelector(".quiz-complete").style.display ="block";
    scoreField.innerText = `Score: ${score}`;
    qAttempted.innerText = `Attempted Questions: ${attemptCount}`
    qCorrect.innerText = `Correct Answers: ${correctCount}`;
    qIncorrect.innerText = `Incorrect Answers: ${25 - correctCount}`;
    percent.innerText = `You Percentage: ${(correctCount/25)*100}%`;
}

function startTimer() {
  let timeLeft = timePerQuestion;
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.classList.add("timer");
  qSection.appendChild(timerElement);

  timerInterval = setInterval(() => {
    timerElement.innerText = `${timeLeft} seconds left`;
    timeLeft--;
    if (timeLeft < 10) {
      timerElement.classList.add("timer-red");
    }
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerElement.classList.remove("timer-red");
      checkAnswer(-1);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").remove();
}
xmark.addEventListener("click", () => {
  quizContainer.style.top = "-650px";
  stopTimer();
});
