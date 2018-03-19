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
		welcome: 'Welcome to the game, human.',
		win: 'I win, you lose, again.',
		loss: 'Congratulations, you have somehow cheated to beat me.',
		draw: 'A draw is the best you can ever hope for puny human.',
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
		getMisc: function() {
			return quotes.misc[Math.floor(Math.random() * (quotes.misc.length - 1))];
		}
	};

	// Default move tiers for AI
	const moveRating = [
		['middle-center'],
		['top-left', 'top-right', 'bottom-left', 'bottom-right'],
		['top-center', 'middle-left', 'middle-right', 'bottom-center']
	];

	// Get move from tier list
	const getDefaultMove = function() {
		for (let moves of moveRating) {
			// Check if moves in this particular tier are available
			let m = moves.filter(function(move) {
				return getLocations(getSquares('available')).indexOf(move) > -1;
			});

			// If 1 or more is available, do this
			if (m.length >= 1) {
				let location = m[Math.floor(Math.random() * (m.length - 1))];
				return location;
			};
		}
	}

	// Get a priority move
	const getPriorityMove = function() {
		let loc;
		for (let win of wins) {
			if ((win.filter(function(location) { return getLocations(getSquares('active')).indexOf(location) > -1; }).length >= 2) 
				&& 
				((win.filter(function(location) { return checkLocation(location).symbol === 'cross'; }).length >= 2)
				||
				(win.filter(function(location) { return checkLocation(location).symbol === 'nought'; }).length >= 2))) {
				for (let location of win) {
					let square = checkLocation(location);
					if (!square.active) {
						loc = location;
						break;
					}
				}
			}
		}
		return loc;
	}

	// Play AI move
	const playAiMove = function(location) {
		let square = checkLocation(location);
		square.setSymbol('cross');
		square.activate();
		renderMove(square, '#' + location);
		if (checkWin('cross')) {
			getModal('loss');
		} else if (checkDraw()) {
			getModal('draw');
		}
	}

	// Get AI move
	const getAiMove = function() {
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

	// Create a square instance from each element of the locations array
	const createSquares = function() {
		locations.forEach(function(location) {
			square = new Square(location);
			squares.push(square);
		});
	}

	// Find a set of squares
	const getSquares = function(type) {
		return squares.filter(function(square) {
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

	// Check location of a square clicked on
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

	// Check current game against the wins array
	const checkWin = function(symbol) {
		if (getSquares('active').length >= 3) {
			for (let win of wins) {
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

	/*
		* * * * * * * * * * * * * * * * * * *
		*									*
		*	BUTTONS AND EVENT LISTENERS		*
		*									*
		* * * * * * * * * * * * * * * * * *	*
	*/

	// Reset the game
	const reset = function() {
		squares.splice(0);
		createSquares();
		$('.square').empty();
		$('.modal').remove();
		renderQuote(quotes.welcome);
	}

	// Event listener for clicking a square
	$('.square').click(function(e) {
		let square = checkLocation(e.target.id);
		if (!square || square.active) {
			console.log('Position is already played, please try again!');
		} else {
			square.setSymbol('nought');
			square.activate();
			renderMove(square, e.target);
			if (checkWin(square.symbol)) {
				getModal('win');
			} else if (checkDraw()) {
				getModal('draw');
			} else {
				renderQuote(quotes.getMisc());
				getAiMove();
			}
		}
	});

	// Event listener for reset button
	$('body').on('click', '.play', reset);

	 /*
		* * * * * * * * * * * * * * * * * * *
		*									*
		*	FUNCTIONS TO RUN FIRST TIME		*
		*									*
		* * * * * * * * * * * * * * * * * *	*
	*/

	//Go!
	createSquares();
	renderQuote(quotes.welcome);
});