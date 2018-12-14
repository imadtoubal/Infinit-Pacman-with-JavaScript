let cols, rows;
let size = 20;
let grid = [];
let stack = [];
let coins = [];
let score = 0;
let scoreStr;
let frameRateStr;

let realTime = true;
let framerate = 60;
let frameCount = 0;
let updateFrequency = 20;

let path;
let current;
let goal;
let player;

let theme;
let pacman = true;
let verbose = false;
let exploredCells = [];
let mazeMap = false;
// AStar bestFirst hillClimbing
let search = 'AStar';

function preload() {

}

function setup() {
	// randomSeed(1);
	// debugger;
	createCanvas(480, 480);
	frameRate(framerate);
	cols = floor(width / size);
	rows = floor(height / size);

	theme = {
		background: color(51),
		walls: color(255),
		goal: color(0, 255, 255),
		player: color(0, 255, 255),
		path: color(0, 255, 255, 120),
		enemy: color(255)
	};
	// theme = {
	// 	background: color(255),
	// 	walls: color(0),
	// 	goal: color(0, 0, 0),
	// 	player: color(0, 0, 0),
	// 	path: color(0, 0, 255, 120),
	// 	enemy: color(0)
	// }
	if (pacman) {
		theme = {
			background: color(0),
			walls: color(0, 0, 255),
			goal: color(255, 255, 0),
			player: color(255, 255, 0),
			path: color(255, 184, 222, 120),
			enemy: color(255, 184, 222)
		}

	}

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			grid.push(new Cell(r, c));
			coins.push(true);
		}
	}

	current = grid[0];
	goal = grid[grid.length - 1];
	maze(true);
	if (!mazeMap) {
		// randomMap(true);
		randomMap(true);
	}
	enemy = new Enemy(0, 0);
	if (pacman) {
		player = new Player();
	}

	//score
	if (pacman) {
		scoreStr = createP("Score: " + score);
	}
	frameRateStr = createP("Framerate: " + frameRate());
	// noLoop();
}

function draw() {
	background(theme.background);
	if (verbose) {
		highlightCells(exploredCells);
	}

	if (pacman) {
		player.update();
		player.show();
		showCoins();
		scoreStr.html("Score: " + score);
	}
	let fr = floor(frameRate());
	frameRateStr.html('Framerate: ' + round(fr/5)*5);


	for (const cell of grid) {
		cell.show(size / 4, theme.walls);
	}
	for (const cell of grid) {
		cell.show(size / 4 - 2, theme.background);
	}

	enemy.step();
	enemy.show();

	// alert('imad');
	if (!pacman) {
		showGoal();
	}
	if (frameCount % updateFrequency == 0) {
		path = enemy.findPath(goal.r, goal.c, search);
		let newCell = path[1];
		if (newCell) {
			enemy.update(newCell);
		} else {
			enemy.dir = {
				x: 0,
				y: 0
			}
		}

	}
	if (realTime) {
		let r, c;
		if (pacman) {
			c = floor(min(player.x, width) / size);
			r = floor(min(player.y, height) / size);
		} else {
			c = floor(min(mouseX, width) / size);
			r = floor(min(mouseY, height) / size);
		}
		if (grid[getIndex(r, c)]) {
			goal = grid[getIndex(r, c)];
		}
	}
	frameCount = (frameCount + 1) % framerate;

	showPath(path);
	// displayHeuristics();
	// noLoop();
}


// Handeling events
function mousePressed() {
	let c = floor(mouseX / size);
	let r = floor(mouseY / size);
	goal = grid[getIndex(r, c)];
	// console.log(goal.cell);
}

function keyPressed() {
	// console.log(keyCode);
	if (keyCode === ESCAPE) {
		// console.log('yes')
		noLoop();
	} else {
		if (keyCode === LEFT_ARROW) {
			player.dir = { x: -1, y: 0 }
		} else if (keyCode === RIGHT_ARROW) {
			player.dir = { x: 1, y: 0 }
		} else if (keyCode === UP_ARROW) {
			player.dir = { x: 0, y: -1 }
		} else if (keyCode === DOWN_ARROW) {
			player.dir = { x: 0, y: 1 }
		}
	}
}