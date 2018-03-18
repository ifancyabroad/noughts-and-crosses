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

	// Default move tiers for AI
	const moveRating = [
		['middle-center'],
		['top-center', 'middle-left', 'middle-right', 'bottom-center'],
		['top-left', 'top-right', 'bottom-left', 'bottom-right']
	];

	// Robot quotes
	const quotes = {
		welcome: 'Welcome to the game, human',
		win: 'I win, you lose, again.',
		loss: 'Congratulations, you have somehow cheated to beat me.',
		misc: [
			'Wow, what a terrible move.',
			'Are you sure about that? Ok...',
			'Kill all humans...',
			'Zzzzzzzzzz'
		],
		getMisc: function() {
			return quotes.misc[Math.floor(Math.random() * (quotes.misc.length - 1))];
		}
	};

	// Modal HTML
	const getModal = function(playerWin) {
		let quote = playerWin ? quotes.loss : quotes.win;

		const modal = 
		`<div class="modal">
			<div class="popup">
				<figure class="modal-face">
					<img src="images/robot.png">
				</figure>
				<p class="end-quote">${quote}</p>
				<button type="button" class="play">Play Again</button>
			</div>
		</div>`

		$('body').append(modal);
	}

	// Array of possible squares
	const squares = [];

	// Create a square instance from each element of the array
	const createSquares = function() {
		locations.forEach(function(location) {
			square = new Square(location);
			squares.push(square);
		});
	}

	// Render a quote from robo
	const renderQuote = function(quote) {
		$('#robo-quote').text(quote);
	}

	// Render the move
	const renderMove = function(square, elem) {
		if (square.symbol === 'nought') {
			$(elem).html('<p>O</p>');
		} else {
			$(elem).html('<p>X</p>');
			$(elem).children().css('color', 'red');
		}
	}

	// Get move from tier list
	const getDefaultMove = function() {
		for (let moves of moveRating) {
			// Check if moves in this particular tier are available
			let m = moves.filter(function(move) {
				return getAvailableSquares().indexOf(move) > -1;
			});

			// If 1 or more is available, do this
			if (m.length >= 1) {
				let location = m[Math.floor(Math.random() * (m.length - 1))];
				return location;
			};
		}
	}

	// Get AI move
	const getPriorityMove = function() {
		let loc;
		for (let win of wins) {
			if ((win.filter(function(location) { return getActiveSquares().indexOf(location) > -1; }).length >= 2) 
				&& 
				((win.filter(function(location) { return checkLocation(location).symbol === 'cross'; }).length >= 2)
				||
				(win.filter(function(location) { return checkLocation(location).symbol === 'nought'; }).length >= 2))) {
				win.forEach(function(location) {
					let square = checkLocation(location);
					if (!square.active) {
						loc = location;
					}
				})
			}
		}
		return loc;
	}

	// Get AI move
	const getAiMove = function() {
		if (getPriorityMove()) {
			playAiMove(getPriorityMove());
		} else {
			playAiMove(getDefaultMove());
		}
	}

	// Play AI move
	const playAiMove = function(location) {
		let square = checkLocation(location);
		square.setSymbol('cross');
		square.activate();
		renderMove(square, '#' + location);
		if (checkWin('cross')) {
			getModal(false);
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
	const checkWin = function(symbol) {
		if (getActiveSquares().length >= 3) {
			for (let win of wins) {
				if ((win.filter(function(location) { return getActiveSquares().indexOf(location) > -1; }).length >= 3) 
					&& 
					(win.filter(function(location) { return checkLocation(location).symbol === symbol; }).length >= 3)) {
					return true;
				}
			}
		}
	}

	// Reset the game
	const reset = function() {
		squares.splice(0);
		createSquares();
		$('.square').empty();
		$('.modal').remove();
		renderQuote(quotes.welcome);
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
			if (checkWin(square.symbol)) {
				getModal(true);
			} else {
				renderQuote(quotes.getMisc());
				getAiMove();
			}
		}
	});

	// Reset to play again
	$('body').on('click', '.play', reset);

	//Go!
	createSquares();
	renderQuote(quotes.welcome);
});