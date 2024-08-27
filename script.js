const statusDisplay = document.getElementById('status');
const bingoBoard = document.getElementById('bingoBoard');
let gameActive = true;
let currentPlayer = "Player";
let gameMode = null;
let difficulty = null;

const bingoSize = 5;
let playerBoard = [];
let aiBoard = [];
let markedNumbers = [];

function setMode(mode, diff = null) {
    gameMode = mode;
    difficulty = diff;
    resetGame();
}

function generateBoard() {
    const board = [];
    for (let i = 0; i < bingoSize; i++) {
        const row = [];
        for (let j = 0; j < bingoSize; j++) {
            row.push({
                number: Math.floor(Math.random() * 75) + 1,
                marked: false
            });
        }
        board.push(row);
    }
    return board;
}

function renderBoard(board, boardElement) {
    boardElement.innerHTML = '';
    for (let i = 0; i < bingoSize; i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('bingo-row');
        for (let j = 0; j < bingoSize; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('bingo-cell');
            cellElement.innerHTML = board[i][j].number;
            if (board[i][j].marked) {
                cellElement.classList.add('marked');
            }
            cellElement.addEventListener('click', () => handleCellClick(i, j, board));
            rowElement.appendChild(cellElement);
        }
        boardElement.appendChild(rowElement);
    }
}

function handleCellClick(row, col, board) {
    if (gameMode === 'local' && currentPlayer === "Player" || gameMode === 'ai' && currentPlayer === "Player") {
        board[row][col].marked = true;
        renderBoard(playerBoard, bingoBoard);
        checkWin(playerBoard, 'Player');
        handlePlayerChange(); 
    }
}




function handlePlayerChange() {
    currentPlayer = currentPlayer === "Player" ? "AI" : "Player";
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    if (gameMode === 'ai' && currentPlayer === "AI") {
        setTimeout(aiPlay, 500);
    }
}


function aiPlay() {
    if (difficulty === 'easy') 
        { 
        aiEasy();
    } else if (difficulty === 'medium') {
        aiMedium();
    } else if (difficulty === 'hard') {
        aiHard();
    }
    renderBoard(aiBoard, bingoBoard);
    checkWin(aiBoard, 'AI');
    handlePlayerChange();
}

function aiEasy() {
    const row = Math.floor(Math.random() * bingoSize);
    const col = Math.floor(Math.random() * bingoSize);
    aiBoard[row][col].marked = true;
}

function aiMedium() {
    // Mark any cell if the AI has a chance to win
    for (let i = 0; i < bingoSize; i++) {
        for (let j = 0; j < bingoSize; j++) {
            if (!aiBoard[i][j].marked) {
                aiBoard[i][j].marked = true;
                if (checkWin(aiBoard, 'AI')) {
                    return;
                }
                aiBoard[i][j].marked = false;
            }
        }
    }
    // Otherwise, play randomly
    aiEasy();
}

function aiHard() {
    // Implement a more sophisticated AI strategy here
    aiMedium();
}

function checkWin(board, player) {
    for (let i = 0; i < bingoSize; i++) {
        if (board[i].every(cell => cell.marked) || board.every(row => row[i].marked)) {
            statusDisplay.innerHTML = `${player} wins!`;
            gameActive = false;
            return;
        }
    }
    if (board.every((row, i) => row[i].marked) || board.every((row, i) => row[bingoSize - i - 1].marked)) {
        statusDisplay.innerHTML = `${player} wins!`;
        gameActive = false;
    }
}

function resetGame() {
    gameActive = true;
    currentPlayer = "Player";
    playerBoard = generateBoard();
    aiBoard = generateBoard();
    statusDisplay.innerHTML = `It's ${currentPlayer}'s turn`;
    renderBoard(playerBoard, bingoBoard);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

resetGame();
