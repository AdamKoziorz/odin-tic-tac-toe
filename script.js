// "Player" factory for Tic Tac Toe
const Player = (icon) => {
    this.icon = icon;

    const getIcon = () => {
        return icon;
    }

    return { getIcon };
};



// "Board" module for Tic Tac Toe
// Mapping of the view to indices
// 0 1 2
// 3 4 5
// 6 7 8
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const setCell = (type, index) => {
        board[index] = type;
    }

    const getCell = (index) => {
        return board[index];
    }

    return {setCell, getCell};
})();



// "Game Model" module for Tic Tac Toe
// This should be responsible for implementing the game logic
const gameModel = (() => {
    const playerOne = Player("X");
    const playerTwo = Player("O");
    let round = 1;
    let currentPlayer = playerOne;
    let isOver = false;

    const checkWin = (newIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
          ];
      
          return winConditions
            .filter((combination) => combination.includes(newIndex))
            .some((possibleCombination) =>
              possibleCombination.every(
                (index) => gameBoard.getCell(index) === currentPlayer.getIcon()
              )
            );
    }

    const playRound = (index) => {
        gameBoard.setCell(currentPlayer.getIcon(), index);
        if (checkWin(index)) {
            displayController.updateDialog(`Player ${currentPlayer.getIcon()} won!`);
            isOver = true;
        } else if (round === 9) {
            displayController.updateDialog("Draw!");
            isOver = true;
        } else {
            round++;
            currentPlayer = round % 2 === 0 ? playerTwo : playerOne;
            displayController.updateDialog(`Player ${currentPlayer.getIcon()}'s Turn`);
        }
    }

    const getIsOver = () => {
        return isOver;
    }

    return {checkWin, playRound, getIsOver};
})();



// "Display Controller" module for Tic Tac Toe
// This should be responsible for handling user interaction and output
const displayController = (() => {
    const cells = document.querySelectorAll(".game-cell");
    const dialog = document.getElementById("dialog");

    cells.forEach((cell =>
        cell.addEventListener("click", (e) => {
            if ((!gameModel.getIsOver()) && e.target.textContent === "") {
                gameModel.playRound(parseInt(e.target.dataset.index));
                updateGrid();
            }
    })));

    const updateGrid = () => {
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = gameBoard.getCell(i);
        }
    }

    const updateDialog = (message) => {
        dialog.textContent = message;
    }

    return {updateDialog};
})();
