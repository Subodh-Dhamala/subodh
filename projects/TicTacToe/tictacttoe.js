let currentPlayer = 'X';
let arr = Array(9).fill(null);
let gameOver = false;

function checkWinner() {
    if (
        (arr[0] === arr[1] && arr[1] === arr[2] && arr[0] !== null) ||
        (arr[3] === arr[4] && arr[4] === arr[5] && arr[3] !== null) ||
        (arr[6] === arr[7] && arr[7] === arr[8] && arr[6] !== null) ||
        (arr[0] === arr[3] && arr[3] === arr[6] && arr[0] !== null) ||
        (arr[1] === arr[4] && arr[4] === arr[7] && arr[1] !== null) ||
        (arr[2] === arr[5] && arr[5] === arr[8] && arr[2] !== null) ||
        (arr[0] === arr[4] && arr[4] === arr[8] && arr[0] !== null) ||
        (arr[2] === arr[4] && arr[4] === arr[6] && arr[2] !== null)
    ) {
        alert(`Winner is ${currentPlayer}`);
        gameOver = true;
        return;
    }

    if (!arr.includes(null)) {
        alert("It's a draw!");
        gameOver = true;
    }
}

function handleClick(el) {
    const id = el.id;
    if (arr[id] !== null || gameOver) return;
    arr[id] = currentPlayer;
    el.innerText = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function resetGame() {
    arr = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    document.querySelectorAll('.column').forEach(cell => cell.innerText = '');
}
