/* ==========================================================================
   CSF3133 Lab Exercise 6 (Additional) - Problem A
   Rock, Paper, Scissors against the computer.

     startGame()        - takes the name, stamps the start time, opens the game
     getComputerChoice()- random pick from an array
     playRound()        - decides one round, updates pictures, colour, score,
                          the results array and the history table
     showSummary()      - for loop over the results array, Math.round() the
                          win percentage
     resetGame()        - back to zero, history and messages cleared
   ========================================================================== */

// --- State ---------------------------------------------------------------- //
const CHOICES = ["rock", "paper", "scissors"];

let playerName = "";
let gameStarted = false;
let roundNumber = 0;
let wins = 0;
let losses = 0;
let draws = 0;
let results = [];              // one "Win" / "Lose" / "Draw" per round

// --- Elements ------------------------------------------------------------- //
const nameInput = document.getElementById("playerName");
const welcome = document.getElementById("welcome");
const resultText = document.getElementById("result");
const summaryText = document.getElementById("summary");
const playerImg = document.getElementById("playerImg");
const computerImg = document.getElementById("computerImg");
const historyBody = document.getElementById("historyBody");
const winsLabel = document.getElementById("wins");
const lossesLabel = document.getElementById("losses");
const drawsLabel = document.getElementById("draws");
const startTime = document.getElementById("startTime");

/* Start the game: a name is required, and the clock starts ticking. */
function startGame() {
    const name = nameInput.value.trim();

    // Empty name: stop and say so.
    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    playerName = name;
    gameStarted = true;

    welcome.innerHTML = "Welcome, <strong>" + playerName + "</strong>!";
    startTime.textContent = "Game started: " + Date();
    resultText.textContent = "";
    resultText.style.color = "";
}

/* The computer picks at random: 0, 1 or 2 from Math.random(). */
function getComputerChoice() {
    const index = Math.floor(Math.random() * 3);
    return CHOICES[index];
}

/* Play one round against the computer. */
function playRound(playerChoice) {
    // The game has to be opened first.
    if (!gameStarted) {
        alert("Click Start Game first.");
        return;
    }

    const computerChoice = getComputerChoice();
    roundNumber += 1;

    // Work out the winner: rock beats scissors, scissors beats paper,
    // paper beats rock.
    let outcome;
    if (playerChoice === computerChoice) {
        outcome = "Draw";
        draws += 1;
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "scissors" && computerChoice === "paper") ||
        (playerChoice === "paper" && computerChoice === "rock")
    ) {
        outcome = "Win";
        wins += 1;
    } else {
        outcome = "Lose";
        losses += 1;
    }

    // Show both pictures.
    playerImg.src = playerChoice + ".png";
    playerImg.alt = "Your choice: " + playerChoice;
    computerImg.src = computerChoice + ".png";
    computerImg.alt = "Computer choice: " + computerChoice;

    // Announce the result, in a colour that says which way it went.
    if (outcome === "Win") {
        resultText.textContent = playerName + ": " + playerChoice + " beats " +
            computerChoice + ". You win!";
        resultText.style.color = "green";
    } else if (outcome === "Lose") {
        resultText.textContent = "Computer: " + computerChoice + " beats " +
            playerChoice + ". You lose.";
        resultText.style.color = "red";
    } else {
        resultText.textContent = "Both chose " + playerChoice + ". It is a draw.";
        resultText.style.color = "grey";
    }

    // Scoreboard, results array and history table.
    winsLabel.textContent = String(wins);
    lossesLabel.textContent = String(losses);
    drawsLabel.textContent = String(draws);
    results.push(outcome);

    historyBody.innerHTML += "<tr><td>" + roundNumber + "</td><td>" + playerChoice +
        "</td><td>" + computerChoice + "</td><td>" + outcome + "</td></tr>";
}

/* Count the wins with a for loop and report the percentage. */
function showSummary() {
    if (results.length === 0) {
        summaryText.textContent = "No rounds played yet.";
        return;
    }

    let won = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i] === "Win") {
            won += 1;
        }
    }

    const percentage = Math.round((won / results.length) * 100);
    summaryText.textContent = "You played " + results.length +
        " rounds and won " + percentage + "%.";
}

/* Start again from nothing. */
function resetGame() {
    gameStarted = false;
    playerName = "";
    roundNumber = 0;
    wins = 0;
    losses = 0;
    draws = 0;
    results = [];

    nameInput.value = "";
    welcome.innerHTML = "";
    resultText.textContent = "";
    resultText.style.color = "";
    summaryText.textContent = "";
    startTime.textContent = "";

    winsLabel.textContent = "0";
    lossesLabel.textContent = "0";
    drawsLabel.textContent = "0";

    // Clear the body of the table, leaving the header row alone.
    historyBody.innerHTML = "";

    playerImg.src = "rock.png";
    playerImg.alt = "Player choice";
    computerImg.src = "rock.png";
    computerImg.alt = "Computer choice";
}
