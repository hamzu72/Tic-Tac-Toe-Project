// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const cells = document.querySelectorAll('.cell');
    const statusText = document.querySelector('.status-text');
    const resetButton = document.querySelector('.reset-btn');

    // --- Game State Variables ---
    let currentPlayer = 'X'; // Start with player X
    let gameActive = true;   // Flag to indicate if the game is in progress
    // Represents the 3x3 grid, empty strings for empty cells
    let gameState = ["", "", "", "", "", "", "", "", ""];

    // --- Winning Combinations ---
    // An array of arrays, where each inner array is a winning line
    const winConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left
        [2, 4, 6]  // Diagonal from top-right
    ];

    // --- Functions ---

    /**
     * Updates the status display to show whose turn it is or the game result.
     * @returns {string} The message to be displayed.
     */
    const updateStatusDisplay = () => `It's ${currentPlayer}'s turn`;

    /**
     * Handles a click on a cell.
     * @param {Event} event - The click event from the cell.
     */
    function handleCellClick(event) {
        const clickedCell = event.target;
        const cellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        // If the cell is already played or the game is over, do nothing
        if (gameState[cellIndex] !== "" || !gameActive) {
            return;
        }

        // Process the move
        handleCellPlayed(clickedCell, cellIndex);
        // Check the result of the move
        handleResultValidation();
    }

    /**
     * Updates the game state and UI for a played cell.
     * @param {HTMLElement} clickedCell - The DOM element of the cell that was clicked.
     * @param {number} cellIndex - The index of the cell in the grid (0-8).
     */
    function handleCellPlayed(clickedCell, cellIndex) {
        gameState[cellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // Adds 'x' or 'o' class for styling
    }

    /**
     * Switches the current player from 'X' to 'O' or vice-versa.
     */
    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = updateStatusDisplay();
    }

    /**
     * Checks if the game has been won, is a draw, or should continue.
     */
    function handleResultValidation() {
        let roundWon = false;
        let winningCombination = [];

        for (let i = 0; i < winConditions.length; i++) {
            const winCondition = winConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue; // If any cell in the condition is empty, it's not a win
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCombination = winCondition;
                break; // A player has won
            }
        }

        if (roundWon) {
            statusText.textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            // Highlight the winning cells
            winningCombination.forEach(index => {
                cells[index].classList.add('win');
            });
            return;
        }

        // Check for a draw (if all cells are filled and no one has won)
        const roundDraw = !gameState.includes("");
        if (roundDraw) {
            statusText.textContent = `Game ended in a draw!`;
            gameActive = false;
            return;
        }

        // If the game is still active, switch to the next player
        handlePlayerChange();
    }

    /**
     * Resets the game to its initial state.
     */
    function handleResetGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusText.textContent = updateStatusDisplay();
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('x', 'o', 'win');
        });
    }

    // --- Event Listeners ---
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleResetGame);

    // --- Initial Game Setup ---
    statusText.textContent = updateStatusDisplay();
});