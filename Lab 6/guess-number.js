/* ==========================================================================
   CSF3133 Lab Module 6 - Section 6.11.1 Guess a Number (page 71)
   Math.random() gives 0 up to but not including 1; multiplying by 10 and
   flooring keeps the secret number in the range 1-10.
   ========================================================================== */

function playGame() {
    // Generate a random integer between 1 and 10
    const randomNumber = Math.floor(Math.random() * 10) + 1;

    // Prompt the user to guess the number
    const userGuess = parseInt(prompt("Guess a number between 1 and 10:"), 10);

    // Validate the user's input
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
        alert("Please enter a valid number between 1 and 10.");
        return;
    }

    // Check if the guess is correct
    if (userGuess === randomNumber) {
        alert("Good Work! You guessed it right.");
    } else {
        alert(`Not matched. The correct number was ${randomNumber}.`);
    }
}
