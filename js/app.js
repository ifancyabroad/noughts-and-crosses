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

	// Array of possible squares
	const squares = [];

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

	// Create a square instance from each element of the array
	locations.forEach(function(location) {
		square = new Square(location);
		squares.push(square);
	});

	// Check location of the square clicked on
	const checkLocation = function(location) {
		for (let square of squares) {
			if (square.id === location) {
				return square;
			}
		}
	}

	const checkWin = function() {
		let activeSquares = [];

		squares.forEach(function(square) {
			if (square.active === true) {
				activeSquares.push(square.id);
			}
		});

		if (activeSquares.length >= 3) {
			for (let win of wins) {
				if (win.filter(function(location) {
					return activeSquares.indexOf(location) > -1;
				}).length >= 3) {
					console.log('Congratulations, you win!');
					break;
				};
			}
		}

	}

	// Event handler for clicking a square
	$('.square').click(function(e) {
		$(e.target).css('background-color', 'red');
		let square = checkLocation(e.target.id);
		square.activate();
		square.setSymbol('nought');
		checkWin();
	});
});