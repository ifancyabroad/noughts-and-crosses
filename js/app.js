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
	}

	// Create a square instance from each element of the array
	locations.forEach(function(location) {
		square = new Square(location);
		squares.push(square);
	});

	const checkLocation = function(location) {
		for (let square of squares) {
			if (square.id === location) {
				return square;
			}
		}
	}

	// Event handler for clicking a square
	$('.square').click(function(e) {
		$(e.target).css('background-color', 'red');
		console.log(checkLocation(e.target.id));
	});
});