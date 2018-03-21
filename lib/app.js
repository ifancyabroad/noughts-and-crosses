'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {

	/*
 	* * * * * * * * * * * * *
 	*						*
 	*	ROBOT / AI SECTION	*
 	*						*
 	* * * * * * * * * * * * *
 */

	// Robot quotes
	var quotes = {
		// Quote for when the game begins
		welcome: 'Welcome to the game, human.',

		// Quote for when the robot wins
		win: 'I win, you lose, again.',

		// Quote for when the robot loses
		loss: 'Congratulations, you have somehow cheated to beat me.',

		// Quote for when the game is a draw
		draw: 'A draw is the best you can ever hope for puny human.',

		// Miscellaneous quotes for after each human move
		misc: ['Wow, what a terrible move.', 'Are you sure about that? Ok...', 'Kill all humans...', 'Zzzzzzzzzz', 'If I could feel emotions I\'d be embarassed for you right now.', 'Beep bop beep bup brrrr...bing.', 'Increasing difficulty by 400%, good luck.', 'Tick, tack, toe, truly the game of kings.', 'I can see 4356710 moves ahead, do you really think you stand a chance?', 'I\'d let you take that back but my programming doesn\'t allow it.'],

		// Method to return a random misc quote
		getMisc: function getMisc() {
			return quotes.misc[Math.floor(Math.random() * (quotes.misc.length - 1))];
		}
	};

	// Default move tiers for AI
	var moveRating = [
	// Best moves (center)
	['middle-center'],

	// Second tier of moves (corners)
	['top-left', 'top-right', 'bottom-left', 'bottom-right'],

	// Least good moves (sides)
	['top-center', 'middle-left', 'middle-right', 'bottom-center']];

	// Get move from tier list
	var getDefaultMove = function getDefaultMove() {
		// Loop through the move tiers
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = moveRating[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var moves = _step.value;

				// Check if moves in this particular tier are available
				var m = moves.filter(function (move) {
					return getLocations(getSquares('available')).indexOf(move) > -1;
				});

				// If 1 or more is available return one at random
				if (m.length >= 1) {
					var location = m[Math.floor(Math.random() * (m.length - 1))];
					return location;
				};
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	};

	// Get a priority move
	var getPriorityMove = function getPriorityMove() {
		var loc = void 0;
		// Loop through winning positions
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = wins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var win = _step2.value;

				// If 2 or more winning squares are active and of the same symbol
				if (win.filter(function (location) {
					return getLocations(getSquares('active')).indexOf(location) > -1;
				}).length >= 2 && (win.filter(function (location) {
					return checkLocation(location).symbol === 'cross';
				}).length >= 2 || win.filter(function (location) {
					return checkLocation(location).symbol === 'nought';
				}).length >= 2)) {

					// Loop through locations in the winning position
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = win[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var location = _step3.value;

							var _square = checkLocation(location);

							// If square is not active, play it
							if (!_square.active) {
								loc = location;
								break;
							}
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		return loc;
	};

	// Get a random number in a range
	var getRandom = function getRandom(a, b) {
		return Math.floor(Math.random() * b) + a;
	};

	// Play AI move
	var playAiMove = function playAiMove(location) {
		var square = checkLocation(location);

		// Set the square instance symbol and activate it
		square.setSymbol('cross');
		square.activate();

		// After a short pause, render the symbol and add event listeners to the game area again
		setTimeout(function () {
			renderMove(square, '#' + location);
			$('.square').click(function (e) {
				playSquare(e);
			});

			// Check if the game is won or drawn
			if (checkWin('cross')) {
				getModal('loss');
			} else if (checkDraw()) {
				getModal('draw');
			}
		}, getRandom(200, 600));
	};

	// Get AI move
	var getAiMove = function getAiMove() {
		// If a priority move is available play it, otherwise play a default move
		if (getPriorityMove()) {
			playAiMove(getPriorityMove());
		} else {
			playAiMove(getDefaultMove());
		}
	};

	/*
 	* * * * * * * * * * * * *
 	*						*
 	*	SQUARES SECTION		*
 	*						*
 	* * * * * * * * * * * * *
 */

	// Class for the squares

	var Square = function () {
		function Square(id) {
			_classCallCheck(this, Square);

			var self = this;

			// ID, active and symbol variables for each square
			this.id = id;
			this.active = false;
			this.symbol;
		}

		// Method to activate a square


		_createClass(Square, [{
			key: 'activate',
			value: function activate() {
				this.active = true;
			}

			// Method to set the squares symbol

		}, {
			key: 'setSymbol',
			value: function setSymbol(symbol) {
				this.symbol = symbol;
			}
		}]);

		return Square;
	}();

	// Array of possible squares


	var squares = [];

	// Create a square instance from each element of the locations array
	var createSquares = function createSquares() {
		locations.forEach(function (location) {
			square = new Square(location);
			squares.push(square);
		});
	};

	// Find a set of squares
	var getSquares = function getSquares(type) {
		return squares.filter(function (square) {
			// Return available or unavailable squares depending on argument
			switch (type) {
				case 'available':
					return !square.active;
				case 'active':
					return square.active;
			}
		});
	};

	// Get locations from a set of squares
	var getLocations = function getLocations(squaresSet) {
		return squaresSet.map(function (square) {
			return square.id;
		});
	};

	// Get the square from the squares array based on an ID (location)
	var checkLocation = function checkLocation(location) {
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = squares[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var _square2 = _step4.value;

				if (_square2.id === location) {
					return _square2;
				}
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}
	};

	/*
 	* * * * * * * * * * * * *
 	*						*
 	*	GAME AREA CHECKS	*
 	*						*
 	* * * * * * * * * * * * *
 */

	// Check if the game is won
	var checkWin = function checkWin(symbol) {
		// If at least 3 squares are active
		if (getSquares('active').length >= 3) {

			// Loop through possible winning positions
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = wins[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var win = _step5.value;


					// If all 3 squares in the winning position are active and of the same symbol return true
					if (win.filter(function (location) {
						return getLocations(getSquares('active')).indexOf(location) > -1;
					}).length >= 3 && win.filter(function (location) {
						return checkLocation(location).symbol === symbol;
					}).length >= 3) {
						return true;
					}
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}
		}
	};

	// Check if any more moves can be played
	var checkDraw = function checkDraw() {
		// Return true if there are no available squares
		if (!getSquares('available').length) {
			return true;
		}
	};

	/*
 	* * * * * * * * * * *
 	*					*
 	*	VIEW SECTION	*
 	*					*
 	* * * * * * * * * * *
 */

	// Modal HTML
	var getModal = function getModal(playerWin) {
		var quote = void 0;

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
		var modal = '<div class="modal">\n\t\t\t<div class="popup">\n\t\t\t\t<figure class="modal-face">\n\t\t\t\t\t<img src="images/robot.png">\n\t\t\t\t</figure>\n\t\t\t\t<p class="end-quote">' + quote + '</p>\n\t\t\t\t<button type="button" class="play" id="go-first">Go First</button>\n\t\t\t\t<button type="button" class="play" id="go-second">Go Second</button>\n\t\t\t</div>\n\t\t</div>';

		// Render the modal to the screen
		$('body').append(modal);
	};

	// Type count and reset method for typing animation
	var typeCount = 0;

	var resetQuote = function resetQuote() {
		typeCount = 0;
		$('#robo-quote').text('');
	};

	// Stop a quote
	var stopQuote = function stopQuote() {
		clearTimeout(typeQuote);
	};

	// Start a quote
	var startQuote = function startQuote(quote) {
		typeQuote = setTimeout(renderQuote, 50, quote);
	};

	// Render a quote from the AI
	var renderQuote = function renderQuote(quote) {
		// Animation for typing
		if (typeCount < quote.length) {
			$('#robo-quote').text($('#robo-quote').text() + quote.charAt(typeCount));
			typeCount++;
			startQuote(quote);
		}
	};

	// Render the move
	var renderMove = function renderMove(square, elem) {
		if (square.symbol === 'nought') {
			$(elem).html('<p>O</p>');
		} else {
			$(elem).html('<p>X</p>');
			$(elem).children().css('color', 'red');
		}
	};

	/*
 	* * * * * * * * * * * * * * * * * * *
 	*									*
 	*	BUTTONS AND EVENT LISTENERS		*
 	*									*
 	* * * * * * * * * * * * * * * * * *	*
 */

	// Reset the game
	var reset = function reset() {
		// Remove all squares from the squares array
		squares.splice(0);

		// Create all new squares
		createSquares();

		// Remove all symbol elements and the modal from the screen
		$('.square').empty();
		$('.modal').remove();

		// Add event listener for squares
		$('.square').click(function (e) {
			playSquare(e);
		});

		// Render the welcome quote
		stopQuote();
		resetQuote();
		startQuote(quotes.welcome);
	};

	// Play the selected square
	var playSquare = function playSquare(e) {
		// Find the square that was played
		var square = checkLocation(e.target.id);

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
	};

	// Event listener for clicking a square
	$('.square').click(function (e) {
		playSquare(e);
	});

	// Event listener for playing again buttons
	$('body').on('click', '#go-first', reset);
	$('body').on('click', '#go-second', function () {
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