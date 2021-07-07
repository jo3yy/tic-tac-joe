let board
let player1 = null
let player2 = null
let ai = null
let ai2 = null
let pvp = null
let currentPlayer = null

const winningCombo = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]
const cells = Array.from(document.querySelectorAll('.cell'))


function playerVsPlayer() {
	player1 = 'X'
	player2 = 'O'
	currentPlayer = 'X'
	ai = null
	ai2 = null
	pvp = true
	startGame()
}

function playerVsAi() {
	player1 = 'X'
	ai = 'O'
	currentPlayer = null
	player2 = null
	ai2 = null
	pvp = false
	startGame()
}

function startGame() {
	document.querySelector('.endgame').style.display = 'none' //remove modal to restart game
	board = Array.from(Array(9).keys())

	cells.map((cell) => {
		cell.innerText = ''
		cell.style.removeProperty('background-color')
		cell.addEventListener('click', turnClick, false)
	})
}

function turnClick(e) {
	if (typeof(board[e.target.id]) == 'number') {

		//player vs player
		if (pvp == true) {
			turn(e.target.id, currentPlayer)
			currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1
		} 
		//player vs ai
		if (pvp == false && player1) {
			turn(e.target.id, player1)
		}

		if (!checkDraw() && (pvp == false)) {
			turn(bestSpot(), ai)
		}
	}
}

function turn(cellId, playerType) {
	board[cellId] = playerType
	document.getElementById(cellId).innerText = playerType

	let gameWon = checkWin(board, playerType)

	if (gameWon) {
		gameOver(gameWon)
	}
}

function checkWin(board, playerType) {
	let plays = board.reduce((acc, el, indx) => 
    (el === playerType) ? acc.concat(indx) : acc, []
  )
  let gameWon = null

  for (let [index, combo] of winningCombo.entries()) {
    if (combo.every(el => plays.indexOf(el) > -1)) {
      gameWon = {
        index: index, 
        player: playerType
      }
      break
    }
  }
	return gameWon
}

function gameOver(gameWon) {
  for (let index of winningCombo[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
      gameWon.player === player1 ? 'blue' : 'red'
  }
  cells.map((cell) => {
    cell.removeEventListener('click', turnClick, false)
  })
	declareWinner(gameWon.player == player1 ? `${player1}'S Wins` : `${gameWon.player}'S Wins`)
}

function declareWinner(whoWon) {
	document.querySelector('.endgame').style.display = 'block'
	document.querySelector('.endgame .text').innerText = whoWon
}


function emptySquares() {
	return board.filter(el => typeof(el) == 'number') 
}


function bestSpot() {
	return minimax(board, ai).index
}


function checkDraw() {
	if (emptySquares().length == 0) {
		cells.map(cell => {
			cell.style.backgroundColor = 'green'
			cell.removeEventListener('click', turnClick, false)
		})
		declareWinner('Tie Game')
		return true
	}
	return false
 }

//minimax was a complete copy
//https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
function minimax(newBoard, player) {
	let availSpots = emptySquares();

	if (checkWin(newBoard, player1)) {
		return { score: -10 };
	} else if (checkWin(newBoard, ai)) {
		return { score: 10 };
	} else if (availSpots.length === 0) {
		return { score: 0 };
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == ai) {
			var result = minimax(newBoard, player1);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, ai);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player === ai) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}