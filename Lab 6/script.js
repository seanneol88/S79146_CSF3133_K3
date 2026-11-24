/* ==========================================================================
   CSF3133 Lab Module 6 - Section 6.12 Lab Exercise 6
   Quiz application logic for index.html.

   The exercise asks for seven pieces, all present below:
     questions       - the array of questions, options and correct answers
     shuffleQuestions() - Fisher-Yates so each run is in a different order
     startTimer()    - a per-question countdown
     displayQuestion()  - draws the current question and its options
     checkAnswer()   - marks the answer and adds to the score
     nextQuestion()  - moves on, resetting the timer
     startQuiz()     - wires the three together and shows the first question
   ========================================================================== */

const SECONDS_PER_QUESTION = 15;

const questions = [
    {
        question: "Which element should wrap a page's main navigation links?",
        options: ["<div>", "<nav>", "<section>", "<aside>"],
        answer: 1
    },
    {
        question: "Which property removes the bullets from an unordered list?",
        options: ["list-style-image", "list-style-type", "text-decoration", "border-style"],
        answer: 1
    },
    {
        question: "Which attribute links an external style sheet to a page?",
        options: ["src", "href", "action", "rel"],
        answer: 1
    },
    {
        question: "Which method finds one element by its id?",
        options: ["querySelectorAll()", "getElementById()", "getElementsByTagName()", "innerHTML()"],
        answer: 1
    },
    {
        question: "What does Math.floor(Math.random() * 10) + 1 return?",
        options: ["A number from 0 to 10", "A number from 1 to 10", "A number from 1 to 11", "A decimal from 0 to 1"],
        answer: 1
    },
    {
        question: "Which event fires when a form is about to be sent?",
        options: ["click", "submit", "change", "contextmenu"],
        answer: 1
    },
    {
        question: "Which table value joins neighbouring cell borders into one line?",
        options: ["separate", "collapse", "none", "hidden"],
        answer: 1
    },
    {
        question: "Which element belongs in the head of an HTML file to hold JavaScript?",
        options: ["<style>", "<script>", "<meta>", "<link>"],
        answer: 1
    },
    {
        question: "Which selector matches every paragraph inside a section?",
        options: ["section > p", "section p", "p + section", "#section p"],
        answer: 1
    },
    {
        question: "Which CSS unit is relative to the root element's font size?",
        options: ["px", "em", "rem", "pt"],
        answer: 2
    }
];

// --- State --------------------------------------------------------------- //
let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let timeLeft = 0;
let timerId = null;
let answered = false;

// --- Elements ------------------------------------------------------------ //
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const answerForm = document.getElementById("answerForm");
const optionsBox = document.getElementById("options");
const questionHeading = document.getElementById("question");
const feedback = document.getElementById("feedback");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const timerBadge = document.getElementById("timer");
const scoreBadge = document.getElementById("scoreBadge");
const scoreLabel = document.getElementById("score");
const totalLabel = document.getElementById("total");
const resultLine = document.getElementById("resultLine");
const resultComment = document.getElementById("resultComment");

/* Shuffle a copy of the questions so no two attempts run in the same order. */
function shuffleQuestions(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const swap = copy[i];
        copy[i] = copy[j];
        copy[j] = swap;
    }
    return copy;
}

/* Reset the countdown for the question now on screen. */
function startTimer() {
    stopTimer();
    timeLeft = SECONDS_PER_QUESTION;
    paintTimer();
    timerId = window.setInterval(function () {
        timeLeft -= 1;
        paintTimer();
        if (timeLeft <= 0) {
            stopTimer();
            timeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }
}

function paintTimer() {
    timerBadge.textContent = "Time left: " + timeLeft + "s";
    if (timeLeft <= 5) {
        timerBadge.classList.add("low");
    } else {
        timerBadge.classList.remove("low");
    }
}

/* Draw the question at currentIndex and its answer options. */
function displayQuestion() {
    answered = false;
    const item = quizQuestions[currentIndex];

    progress.textContent = "Question " + (currentIndex + 1) + " of " + quizQuestions.length;
    questionHeading.textContent = item.question;

    optionsBox.innerHTML = "";
    item.options.forEach(function (text, index) {
        const label = document.createElement("label");
        label.className = "option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "option";
        radio.value = String(index);

        const span = document.createElement("span");
        span.textContent = text;

        label.appendChild(radio);
        label.appendChild(span);
        optionsBox.appendChild(label);
    });

    feedback.textContent = "";
    feedback.className = "feedback";
    submitBtn.disabled = false;
    nextBtn.hidden = true;

    startTimer();
}

/* Compare the chosen radio with the stored answer and score it. */
function checkAnswer() {
    if (answered) {
        return;
    }

    const chosen = document.querySelector("input[name='option']:checked");
    if (!chosen) {
        feedback.textContent = "Choose one of the options first.";
        feedback.className = "feedback info";
        return;
    }

    answered = true;
    stopTimer();
    submitBtn.disabled = true;
    nextBtn.hidden = false;

    const item = quizQuestions[currentIndex];
    const picked = Number(chosen.value);

    if (picked === item.answer) {
        score += 1;
        feedback.textContent = "Correct — " + item.options[item.answer] + " is right.";
        feedback.className = "feedback correct";
    } else {
        feedback.textContent = "Not quite. The answer is " + item.options[item.answer] + ".";
        feedback.className = "feedback wrong";
    }

    updateScore();
}

/* Running out of time counts as a wrong answer and reveals the correct one. */
function timeUp() {
    if (answered) {
        return;
    }

    answered = true;
    submitBtn.disabled = true;
    nextBtn.hidden = false;

    const item = quizQuestions[currentIndex];
    feedback.textContent = "Time's up. The answer is " + item.options[item.answer] + ".";
    feedback.className = "feedback wrong";
}

/* Move to the next question, or finish the quiz. */
function nextQuestion() {
    currentIndex += 1;

    if (currentIndex >= quizQuestions.length) {
        finishQuiz();
        return;
    }

    displayQuestion();
}

function updateScore() {
    scoreLabel.textContent = String(score);
    scoreBadge.textContent = "Score: " + score;
}

function finishQuiz() {
    stopTimer();
    quizScreen.hidden = true;
    resultScreen.hidden = false;

    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);
    resultLine.textContent = "You scored " + score + " out of " + total + " (" + percentage + "%).";

    if (percentage === 100) {
        resultComment.textContent = "A clean sweep — every answer correct.";
    } else if (percentage >= 70) {
        resultComment.textContent = "Strong work. Replay for a different question order.";
    } else if (percentage >= 40) {
        resultComment.textContent = "A fair start; the chapters on selectors and events are worth another read.";
    } else {
        resultComment.textContent = "Plenty of room to improve — try again now that you have seen the answers.";
    }
}

/* Shuffle, reset the counters, then show the first question. */
function startQuiz() {
    quizQuestions = shuffleQuestions(questions);
    currentIndex = 0;
    score = 0;

    startScreen.hidden = true;
    resultScreen.hidden = true;
    quizScreen.hidden = false;

    totalLabel.textContent = String(quizQuestions.length);
    updateScore();
    displayQuestion();
}

// --- Wiring -------------------------------------------------------------- //
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);

answerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkAnswer();
});
