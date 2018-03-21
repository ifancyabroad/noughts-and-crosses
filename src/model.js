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