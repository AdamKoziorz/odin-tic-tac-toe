// "Player" factory for Tic Tac Toe
const Player = (icon) => {
    this.icon = icon;
    let wins = 0;

    const getIcon = () => {
        return icon;
    }

    const getWins = () => {
        return wins;
    }

    const incrementWins = () => {
        wins++;
    }

    return { getIcon, getWins, incrementWins };
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

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    return {setCell, getCell, resetBoard};
})();



// "Game Model" module for Tic Tac Toe
// This should be responsible for implementing the game logic
const gameModel = (() => {
    const _playerOne = Player("X");
    const _playerTwo = Player("O");
    let _round = 1;
    let _currentPlayer = _playerOne;
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
                (index) => gameBoard.getCell(index) === _currentPlayer.getIcon()
              )
            );
    }

    const playRound = (index) => {
        gameBoard.setCell(_currentPlayer.getIcon(), index);
        if (checkWin(index)) {
            displayController.updateDialog(`Player ${_currentPlayer.getIcon()} won!`);
            _currentPlayer.incrementWins();
            displayController.updateScore(_currentPlayer.getWins(), _currentPlayer.getIcon());
            isOver = true;
        } else if (_round === 9) {
            displayController.updateDialog("Draw!");
            isOver = true;
        } else {
            _round++;
            _currentPlayer = _round % 2 === 0 ? _playerTwo : _playerOne;
            displayController.updateDialog(`Player ${_currentPlayer.getIcon()}'s Turn`);
        }
    }

    const resetGame = () => {
        isOver = false;
        _round = 1;
        _currentPlayer = _playerOne;
        gameBoard.resetBoard();
        displayController.updateGrid();
        displayController.updateDialog(`Player ${_currentPlayer.getIcon()}'s Turn`);
    }

    const getIsOver = () => {
        return isOver;
    }

    return {checkWin, playRound, resetGame, getIsOver};
})();



// "Display Controller" module for Tic Tac Toe
// This should be responsible for handling user interaction and output
const displayController = (() => {
    const _cells = document.querySelectorAll(".game-cell");
    const _dialog = document.getElementById("dialog");
    const _resetBtn = document.getElementById("restart-btn");
    const _xScore = document.getElementById("x-score");
    const _oScore = document.getElementById("o-score");

    _cells.forEach((cell =>
        cell.addEventListener("click", (e) => {
            if ((!gameModel.getIsOver()) && e.target.textContent === "") {
                gameModel.playRound(parseInt(e.target.dataset.index));
                updateGrid();
            }
    })));

    _resetBtn.addEventListener("click", gameModel.resetGame);

    const updateGrid = () => {
        for (let i = 0; i < _cells.length; i++) {
            _cells[i].textContent = gameBoard.getCell(i);
        }
    }

    const updateDialog = (message) => {
        _dialog.textContent = message;
    }

    const updateScore = (score, icon) => {
        if (icon == "X") {
            _xScore.textContent = score;
        } else if (icon == "O") {
            _oScore.textContent = score;
        }
    }

    return {updateGrid, updateDialog, updateScore};
})();
