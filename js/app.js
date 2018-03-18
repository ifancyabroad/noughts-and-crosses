$(document).ready(function() {
	// Array of locations in the game area
	const locations = [
		'top-left',
		'top-center',
		'top-right',
		'middle-left',
		'middle-center',
		'middle-right',
		'bottom-left',
		'bottom-center',
		'bottom-right'
	];

	// Array of winning combinations
	const wins = [
		['top-left', 'top-center', 'top-right'],
		['middle-left', 'middle-center', 'middle-right'],
		['bottom-left', 'bottom-center', 'bottom-right'],
		['top-left', 'middle-left', 'bottom-left'],
		['top-center', 'middle-center', 'bottom-center'],
		['top-right', 'middle-right', 'bottom-right'],
		['top-left', 'middle-center', 'bottom-right'],
		['top-right', 'middle-center', 'bottom-left']
	];

	// Class for the squares
	class Square {
		constructor(id) {
			const self = this;

			this.id = id;
			this.active = false;
			this.symbol;
		}

		activate() {
			this.active = true;
		}

		setSymbol(symbol) {
			this.symbol = symbol;
		}
	}

	// Array of possible squares
	const squares = [];

	// Create a square instance from each element of the array
	locations.forEach(function(location) {
		square = new Square(location);
		squares.push(square);
	});

	// Default move tiers for AI
	const moveRating = [
		['middle-center'],
		['top-center', 'middle-left', 'middle-right', 'bottom-center'],
		['top-left', 'top-right', 'bottom-left', 'bottom-right']
	];

	// Render the move
	const renderMove = function(square, elem) {
		if (square.symbol === 'nought') {
			$(elem).text('O');
		} else {
			$(elem).text('X');
		}
	}

	// get AI move
	const getAiMove = function() {
		for (let moves of moveRating) {
			// Check if moves in this particular tier are available
			let m = moves.filter(function(move) {
				return getAvailableSquares().indexOf(move) > -1;
			});

			// If 1 or more is available, do this
			if (m.length >= 1) {
				let location = m[Math.floor(Math.random() * (m.length - 1))];
				let square = checkLocation(location);
				square.setSymbol('cross');
				square.activate();
				renderMove(square, '#' + location);
				break;
			};
		}
	}

	// Find available squares to play
	const getAvailableSquares = function() {
		return squares.map(function(square) {
			if (!square.active) {
				return square.id;
			}
		});
	}

	// Find squares that are currently active
	const getActiveSquares = function() {
		return squares.map(function(square) {
			if (square.active) {
				return square.id;
			}
		});
	}

	// Check location of the square clicked on
	const checkLocation = function(location) {
		for (let square of squares) {
			if (square.id === location) {
				return square;
			}
		}
	}

	// Check current game against the wins array
	const checkWin = function() {
		if (getActiveSquares().length >= 3) {
			for (let win of wins) {
				if (win.filter(function(location) {
					return getActiveSquares().indexOf(location) > -1;
				}).length >= 3) {
					console.log('Congratulations, you win!');
					break;
				};
			}
		}
	}

	// Event handler for clicking a square
	$('.square').click(function(e) {
		let square = checkLocation(e.target.id);
		if (square.active) {
			console.log('Position is already played, please try again!');
		} else {
			square.setSymbol('nought');
			square.activate();
			renderMove(square, e.target);
			checkWin();
			getAiMove();
		}
	});
});