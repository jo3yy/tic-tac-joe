//state
let board
let player1 = null
let player2 = null
let currentPlayer = null
let pvp = null
let aiOnly = null
let autoRun

const winningCombo = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
]

function clearState() {
	board
	player1 = null
	player2 = null
	player2 = null
	currentPlayer = null
	pvp = null
	player2Only = null
	autoRun
}

function gameMode(e) {
	e.preventDefault()
	pvp = null
	aiOnly = null

	player1 = 'X'
	player2 = 'O'

	let marker = document.getElementById('x').checked
	marker = marker ? 'X' : 'O'

	if (marker !== player1) {
		player1 = 'O'
		player2 = 'X'
	} 
	currentPlayer = player1

	const mode = document.getElementsByClassName('gamemode-control')[0].options.selectedIndex

	if (mode === 0) {
		pvp = true
		startGame()
	} else if (mode === 1) {
		pvp = false
		startGame()
	} else {
		aiOnly = true
		startGame()
	}
}

//start of game
const cells = Array.from(document.querySelectorAll('.cell')) //get all table data

function startGame() {
	document.querySelector('.endgame').style.display = 'none' //for when u restart the game
	board = Array.from(Array(9).keys()) //makes an array of num 0-9

	cells.forEach((cell) => {
		cell.innerText = ''
		cell.style.removeProperty('background-color')
		cell.addEventListener('click', turnClick, false)
	})

	if (aiOnly) {
		turnClick()
	}
}

function turnClick(square) {
	// player vs player
	if (pvp === true) {
		turn(square.target.id, currentPlayer)
		currentPlayer = currentPlayer === player1 ? player2 : player1
		square.target.removeEventListener('click', turnClick)
		if (!checkWin(board, currentPlayer) && !checkWin()) turn(bestSpot(), currentPlayer);

	}
	//player vs player2
	if (pvp === false) {
		turn(square.target.id, currentPlayer)
		currentPlayer = currentPlayer === player1 ? player2 : player1
		square.target.removeEventListener('click', turnClick)
	}
	//player2 vs player2
	if (aiOnly) {
		//use setInterval to have the player2 not finish the game in .0001 of a second :)
		autoRun = setInterval(() => {
			turn(bestSpot(), currentPlayer)
			currentPlayer = currentPlayer === player1 ? player2 : player1
		}, 500)
	}

	if (!checkDraw() && (pvp === null || pvp === false)) {
		turn(bestSpot(), currentPlayer)
		currentPlayer = currentPlayer === player1 ? player2 : player1
	}
}

function turn(squareId, playerType) {
	if (squareId !== undefined) {
		//prevent loop when game finishes
		board[squareId] = playerType //places X/O into the board[whereUserClicked(0-9)]
		document.getElementById(squareId).innerText = playerType
	}

	let gameWon = checkWin(board, playerType)
	const turnsRemainding = emptySquares().length === 0


	///
	if (turnsRemainding) {
		checkDraw()
		clearInterval(autoRun)
	}
	///
	if (gameWon) {
		gameOver(gameWon)
	}
}

function checkWin(board, playerType) {
	//goes through the board, and check each element in array
	//and puts the index of the X/O's into plays
	let plays = board.reduce(
		(acc, el, indx) => (el === playerType) ? acc.concat(indx) : acc, []
	)

	let gameWon = null

	for (let [index, combo] of winningCombo.entries()) {
		//checks 'plays' matches any of the elements in winningCombo
		if (combo.every((el) => plays.indexOf(el) > -1)) {
			gameWon = {
				index: index,
				player: playerType,
			}
			break
		}
	}
	return gameWon
}

function emptySquares() {
	return board.filter((el) => typeof el === 'number')
}

function bestSpot() {
	return minimax(board, currentPlayer).index
}

function checkDraw() {
	if (emptySquares().length === 0) {
		cells.forEach((cell) => {
			cell.style.backgroundColor = 'green'
			cell.removeEventListener('click', turnClick)
		})
		declareWinner('Tie Game')
		return true
	}
	return false
}

function gameOver(gameWon) {
	for (let index of winningCombo[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player === player1 ? 'blue' : 'red'
	}

	cells.forEach((cell) => {
		cell.removeEventListener('click', turnClick)
	})

	declareWinner(
		gameWon.player === player1
			? `${player1}'S Wins`
			: `${gameWon.player}'S Wins`
	)
}

function declareWinner(whoWon) {
	document.querySelector('.endgame').style.display = 'block'
	document.querySelector('.endgame .text').innerText = whoWon
}

//minimax was a complete copy
//https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
function minimax(newBoard, player) {
	let availSpots = emptySquares(newBoard)

	if (checkWin(newBoard, player1)) {
		return { score: -10 }
	} else if (checkWin(newBoard, player2)) {
		return { score: 10 }
	} else if (availSpots.length === 0) {
		return { score: 0 }
	}
	var moves = []
	for (var i = 0; i < availSpots.length; i++) {
		var move = {}
		move.index = newBoard[availSpots[i]]
		newBoard[availSpots[i]] = player

		if (player === player2) {
			var result = minimax(newBoard, player1)
			move.score = result.score
		} else {
			var result = minimax(newBoard, player2)
			move.score = result.score
		}
		newBoard[availSpots[i]] = move.index
		moves.push(move)
	}

	var bestMove
	if (player === player2) {
		var bestScore = -10000
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score
				bestMove = i
			}
		}
	} else {
		var bestScore = 10000
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score
				bestMove = i
			}
		}
	}
	return moves[bestMove]
}
