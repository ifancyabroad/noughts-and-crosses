$(document).ready(function() {

	/*
		* * * * * * * * * * * * *
		*						*
		*	ROBOT / AI SECTION	*
		*						*
		* * * * * * * * * * * * *
	*/

	// Robot quotes
	const quotes = {
		// Quote for when the game begins
		welcome: 'Welcome to the game, human.',

		// Quote for when the robot wins
		win: 'I win, you lose, again.',

		// Quote for when the robot loses
		loss: 'Congratulations, you have somehow cheated to beat me.',

		// Quote for when the game is a draw
		draw: 'A draw is the best you can ever hope for puny human.',

		// Miscellaneous quotes for after each human move
		misc: [
			'Wow, what a terrible move.',
			'Are you sure about that? Ok...',
			'Kill all humans...',
			'Zzzzzzzzzz',
			'If I could feel emotions I\'d be embarassed for you right now.',
			'Beep bop beep bup brrrr...bing.',
			'Increasing difficulty by 400%, good luck.',
			'Tick, tack, toe, truly the game of kings.',
			'I can see 4356710 moves ahead, do you really think you stand a chance?',
			'I\'d let you take that back but my programming doesn\'t allow it.'
		],

		// Method to return a random misc quote
		getMisc: function() {
			return quotes.misc[Math.floor(Math.random() * (quotes.misc.length - 1))];
		}
	};

	// Default move tiers for AI
	const moveRating = [
		// Best moves (center)
		['middle-center'],

		// Second tier of moves (corners)
		['top-left', 'top-right', 'bottom-left', 'bottom-right'],

		// Least good moves (sides)
		['top-center', 'middle-left', 'middle-right', 'bottom-center']
	];

	// Get move from tier list
	const getDefaultMove = function() {
		// Loop through the move tiers
		for (let moves of moveRating) {
			// Check if moves in this particular tier are available
			let m = moves.filter(function(move) {
				return getLocations(getSquares('available')).indexOf(move) > -1;
			});

			// If 1 or more is available return one at random
			if (m.length >= 1) {
				let location = m[Math.floor(Math.random() * (m.length - 1))];
				return location;
			};
		}
	}

	// Get a priority move
	const getPriorityMove = function() {
		let loc;
		// Loop through winning positions
		for (let win of wins) {
			// If 2 or more winning squares are active and of the same symbol
			if ((win.filter(function(location) { return getLocations(getSquares('active')).indexOf(location) > -1; }).length >= 2) 
				&& 
				((win.filter(function(location) { return checkLocation(location).symbol === 'cross'; }).length >= 2)
				||
				(win.filter(function(location) { return checkLocation(location).symbol === 'nought'; }).length >= 2))) {

				// Loop through locations in the winning position
				for (let location of win) {
					let square = checkLocation(location);

					// If square is not active, play it
					if (!square.active) {
						loc = location;
						break;
					}
				}
			}
		}
		return loc;
	}

	// Get a random number in a range
	const getRandom = function(a, b) {
		return Math.floor(Math.random() * b) + a;
	}

	// Play AI move
	const playAiMove = function(location) {
		let square = checkLocation(location);

		// Set the square instance symbol and activate it
		square.setSymbol('cross');
		square.activate();

		// After a short pause, render the symbol and add event listeners to the game area again
		setTimeout(function() {
			renderMove(square, '#' + location);
			$('.square').click(function(e) { 
				playSquare(e);
			});

			// Check if the game is won or drawn
			if (checkWin('cross')) {
				getModal('loss');
			} else if (checkDraw()) {
				getModal('draw');
			}
		}, getRandom(200, 600));
	}

	// Get AI move
	const getAiMove = function() {
		// If a priority move is available play it, otherwise play a default move
		if (getPriorityMove()) {
			playAiMove(getPriorityMove());
		} else {
			playAiMove(getDefaultMove());
		}
	}

	/*
		* * * * * * * * * * * * *
		*						*
		*	SQUARES SECTION		*
		*						*
		* * * * * * * * * * * * *
	*/ 

	// Class for the squares
	class Square {
		constructor(id) {
			const self = this;

			// ID, active and symbol variables for each square
			this.id = id;
			this.active = false;
			this.symbol;
		}

		// Method to activate a square
		activate() {
			this.active = true;
		}

		// Method to set the squares symbol
		setSymbol(symbol) {
			this.symbol = symbol;
		}
	}

	// Array of possible squares
	const squares = [];

	// Create a square instance from each element of the locations array
	const createSquares = function() {
		locations.forEach(function(location) {
			let square = new Square(location);
			squares.push(square);
		});
	}

	// Find a set of squares
	const getSquares = function(type) {
		return squares.filter(function(square) {
			// Return available or unavailable squares depending on argument
			switch (type) {
				case 'available':
					return !square.active;
				case 'active':
					return square.active;
			}
		});
	}

	// Get locations from a set of squares
	const getLocations = function(squaresSet) {
		return squaresSet.map(function(square) {
			return square.id;
		});
	}

	// Get the square from the squares array based on an ID (location)
	const checkLocation = function(location) {
		for (let square of squares) {
			if (square.id === location) {
				return square;
			}
		}
	}

	/*
		* * * * * * * * * * * * *
		*						*
		*	GAME AREA CHECKS	*
		*						*
		* * * * * * * * * * * * *
	*/

	// Check if the game is won
	const checkWin = function(symbol) {
		// If at least 3 squares are active
		if (getSquares('active').length >= 3) {

			// Loop through possible winning positions
			for (let win of wins) {

				// If all 3 squares in the winning position are active and of the same symbol return true
				if ((win.filter(function(location) { return getLocations(getSquares('active')).indexOf(location) > -1; }).length >= 3) 
					&& 
					(win.filter(function(location) { return checkLocation(location).symbol === symbol; }).length >= 3)) {
					return true;
				}
			}
		}
	}

	// Check if any more moves can be played
	const checkDraw = function() {
		// Return true if there are no available squares
		if (!getSquares('available').length) {
			return true;
		}
	}

	/*
		* * * * * * * * * * *
		*					*
		*	VIEW SECTION	*
		*					*
		* * * * * * * * * * *
	*/

	// Modal HTML
	const getModal = function(playerWin) {
		let quote;

		// Get a quote depending on the result
		switch (playerWin) {
			case 'win':
				quote = quotes.loss;
				break;
			case 'loss':
				quote = quotes.win;
				break;
			case 'draw':
				quote = quotes.draw;
				break;
		}

		// HTML for the end game modal
		const modal = 
		`<div class="modal">
			<div class="popup">
				<figure class="modal-face">
					<img src="images/robot.png">
				</figure>
				<p class="end-quote">${quote}</p>
				<button type="button" class="play" id="go-first">Go First</button>
				<button type="button" class="play" id="go-second">Go Second</button>
			</div>
		</div>`

		// Render the modal to the screen
		$('body').append(modal);
	}

	// Type count and reset method for typing animation
	let typeCount = 0

	const resetQuote = function() {
		typeCount = 0;
		$('#robo-quote').text('');
	}

	// Variable for typing animation
	let typeQuote;

	// Stop a quote
	const stopQuote = function() {
		clearTimeout(typeQuote);
	}

	// Start a quote
	const startQuote = function(quote) {
		typeQuote = setTimeout(renderQuote, 50, quote);
	}

	// Render a quote from the AI
	const renderQuote = function(quote) {
		// Animation for typing
		if (typeCount < quote.length) {
			$('#robo-quote').text($('#robo-quote').text() + quote.charAt(typeCount));
			typeCount++;
			startQuote(quote);
		}
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

	/*
		* * * * * * * * * * * * * * * * * * *
		*									*
		*	BUTTONS AND EVENT LISTENERS		*
		*									*
		* * * * * * * * * * * * * * * * * *	*
	*/

	// Reset the game
	const reset = function() {
		// Remove all squares from the squares array
		squares.splice(0);

		// Create all new squares
		createSquares();

		// Remove all symbol elements and the modal from the screen
		$('.square').empty();
		$('.modal').remove();

		// Add event listener for squares
		$('.square').click(function(e) {
			playSquare(e);
		});

		// Render the welcome quote
		stopQuote();
		resetQuote();
		startQuote(quotes.welcome);
	}

	// Play the selected square
	const playSquare = function(e) {
		// Find the square that was played
		let square = checkLocation(e.target.id);

		// Log this message to the console if the square is not available
		if (!square || square.active) {
			console.log('Position is already played, please try again!');
		} else {
			// Remove event listeners from the game area until AI has moved
			$('.square').off();

			// Set the square symbol and activate
			square.setSymbol('nought');
			square.activate();

			// Render to the screen
			renderMove(square, e.target);

			// Check if the game is won or drawn
			if (checkWin(square.symbol)) {
				getModal('win');
			} else if (checkDraw()) {
				getModal('draw');
			} else {
				// Render a new AI quote and get the AI response if the game is not over
				stopQuote();
				resetQuote();
				startQuote(quotes.getMisc());
				getAiMove();
			}
		}
	}

	// Event listener for clicking a square
	$('.square').click(function(e) {
		playSquare(e);
	});

	// Event listener for playing again buttons
	$('body').on('click', '#go-first', reset);
	$('body').on('click', '#go-second', function() {
		reset();
		$('.square').off();
		getAiMove();
	});

	 /*
		* * * * * * * * * * * * * * * * * * *
		*									*
		*	FUNCTIONS TO RUN FIRST TIME		*
		*									*
		* * * * * * * * * * * * * * * * * *	*
	*/

	//Go!
	createSquares();
	startQuote(quotes.welcome);
});