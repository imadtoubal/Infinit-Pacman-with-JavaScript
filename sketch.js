let cols, rows;
let size = 30;
let grid = [];
let stack = [];


let realTime = true;
let framerate = 30;
let frameCount = 0;
let updateFrequency = 8;

let path;
let current;
let goal;
let player;

let theme;
let pacman = false;
let verbose = true;
let exploredCells = [];


function setup() {
	createCanvas(720, 600);
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
	}
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
		}
	}

	current = grid[0];
	goal = grid[grid.length - 1];
	maze(true);
	randomMap(true);
	enemy = new Enemy(0, 0);
	if(pacman) {
		player = new Player();
	}
}

function draw() {
	background(theme.background);
	highlightCells(exploredCells);

	if(pacman) {
		player.update();
		player.show();
	}

	for (const cell of grid) {
		cell.show(size / 4, theme.walls);
	}
	for (const cell of grid) {
		cell.show(size / 4 - 2, theme.background);
	}

	enemy.step();
	enemy.show();
	// alert('imad');
	if(!pacman) {
		showGoal();
	}
	if (frameCount % updateFrequency == 0) {
		path = enemy.findPath(goal.r, goal.c);
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
		if(pacman) {
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
	// noLoop();
}

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
	} else if (keyCode === LEFT_ARROW) {
		player.dir = { x: -1, y: 0 }
	} else if (keyCode === RIGHT_ARROW) {
		player.dir = { x: 1, y: 0 }
	} else if (keyCode === UP_ARROW) {
		player.dir = { x: 0, y: -1 }
	} else if (keyCode === DOWN_ARROW) {
		player.dir = { x: 0, y: 1 }
	}
}

function showGoal() {
	fill(theme.goal);
	noStroke();
	ellipse(goal.c * size + size / 2, goal.r * size + size / 2, size / 2);
}

function Cell(r, c) {
	this.c = c;
	this.r = r;
	this.walls = [true, true, true, true];
	this.visited = false;
	this.neighbors = [];
	this.cost = 0;

	this.show = function (s, c) {
		// debugger;
		let w = size;
		let x = this.c * w;
		let y = this.r * w;

		stroke(c);
		// strokeCap(PROJECT);
		strokeWeight(s);

		// top
		if (this.walls[0])
			line(x, y, x + w, y);

		// right
		if (this.walls[1])
			line(x + w, y, x + w, y + w);

		// bottom
		if (this.walls[2])
			line(x, y + w, x + w, y + w);

		// left
		if (this.walls[3])
			line(x, y, x, y + w);

	}

	this.checkNeighbors = function () {
		let neighbors = [];

		let top = grid[getIndex(this.r - 1, this.c)];
		let right = grid[getIndex(this.r, this.c + 1)];
		let bottom = grid[getIndex(this.r + 1, this.c)];
		let left = grid[getIndex(this.r, this.c - 1)];

		(top && !top.visited) && neighbors.push(top);
		(right && !right.visited) && neighbors.push(right);
		(bottom && !bottom.visited) && neighbors.push(bottom);
		(left && !left.visited) && neighbors.push(left);

		let rIndex = floor(random() * neighbors.length);
		n = neighbors[rIndex];
		if (n) {
			let alreadyNeigbor = false;
			for (const neighbor of this.neighbors) {
				if (n == neighbor) {
					alreadyNeigbor = true;
				}
			}
			if (!alreadyNeigbor) {
				this.neighbors.push(n);
				n.neighbors.push(this);
			}
		}
		return n;
	}

}

function Enemy(r, c) {
	this.r = r;
	this.c = c;
	this.prevr = r;
	this.prevc = c;
	this.x = c * size;
	this.y = r * size;
	this.dir = {
		x: 0,
		y: 0
	}

	this.cell = grid[getIndex(r, c)];

	this.update = function (cell) {
		// debugger;
		this.dir = getDirection(this, cell);
		this.cell = cell;
		this.prevr = this.r;
		this.prevc = this.c;
		this.r = cell.r;
		this.c = cell.c;
		this.x = this.prevc * size;
		this.y = this.prevr * size;
	}

	this.step = function () {
		if (this.dir) {
			// console.log('step');
			this.x = this.x + this.dir.x * size / updateFrequency;
			this.y = this.y + this.dir.y * size / updateFrequency;
			// console.log(this.dir);
			// console.log(this.dir.x * (updateFrequency / framerate) * size);
		}
	}

	this.findPath = function (r, c) {
		// debugger;
		let openList = [this.cell];
		let closedList = [];
		let goalCell = grid[getIndex(r, c)];
		let currentCell;
		let path = [];
		let visited = [];
		for (const i in grid) {
			visited.push(false);
			grid[i].cost = Infinity;
			grid[i].heuristic = Infinity;
			grid[i].parent = undefined;
		}
		this.cell.cost = 0;
		// alert(openList.length);
		// let closedList = [];
		while (openList.length > 0) {

			openList.sort((x, y) => y.f - x.f);
			// console.log(openList);
			// debugger;
			currentCell = openList.pop();

			if (currentCell == goalCell) {
				break;
			}

			closedList.push(currentCell);
			// visited[getIndex(currentCell.r, currentCell.c)] = true;

			// debugger;
			for (const n of currentCell.neighbors) {
				if (closedList.includes(n))
					continue;

				n.heuristic = manhattanDistance(n, goalCell);
				let newCost = currentCell.cost + 1;

				if (!openList.includes(n)) {
					// n.parent = currentCell;
					openList.push(n);
				} else if (newCost >= n.cost) {
					continue;
				}
				n.parent = currentCell;
				n.cost = newCost;
				n.f = n.cost + n.heuristic;
			}

			// console.log(openList);

		}
		while (currentCell) {
			path.unshift(currentCell);
			currentCell = currentCell.parent;
		}
		exploredCells = closedList;
		// alert('hoorey')
		// console.log(path);
		return path;

	}

	this.show = function () {
		fill(theme.enemy);
		noStroke();
		ellipse(this.x + size / 2, this.y + size / 2, size * 0.5);
	}
}

function Player() {
	this.x = goal.c * size + size / 2;
	this.y = goal.r * size + size / 2;
	this.s = (framerate / updateFrequency) * 1.5;
	this.dir = {
		x: 0,
		y: 0
	}
	this.show = function () {
		fill(theme.player);
		noStroke()
		ellipse(this.x, this.y, size / 2);
	}
	this.update = function () {

		this.x += this.dir.x * this.s;
		this.y += this.dir.y * this.s;
		
		if (!((this.x - (size / 2)) > 0 && (this.x - size / 2) < width - size)) {
			this.dir.x = 0;
		} 
		if(!((this.y - size / 2) > 0 && (this.y - size / 2) < height - size)) {
			this.dir.y = 0;
		}

	}

}

function randomMap() {
	for (const cell of grid) {
		let n = cell.checkNeighbors();
		if (n)
			removeWalls(cell, n);

	}
}

function maze(instant) {
	if (instant) {
		while (true) {
			current.visited = true;
			let next = current.checkNeighbors();
			if (next) {
				stack.push(current);
				removeWalls(current, next);
				current = next;
			} else if (stack.length > 0) {
				current = stack.pop();
			} else {
				// noLoop();
				for (const cell of grid) {
					cell.visited = false;
				}
				break;
			}
		}

	} else {
		current.visited = true;
		let next = current.checkNeighbors();
		if (next) {
			stack.push(current);
			removeWalls(current, next);
			current = next;
		} else if (stack.length > 0) {
			current = stack.pop();
		} else {
			for (const cell of grid) {
				cell.visited = false;
			}
			// noLoop();
		}
	}

}

function getIndex(r, c) {
	if (c > cols - 1 || r > rows - 1 || r < 0 || c < 0)
		return -1;
	return c + cols * r;
}

function removeWalls(a, b) {
	let x = a.c - b.c;
	let y = a.r - b.r;

	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	}
	if (x === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	}

	if (y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	}
	else if (y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}


}

function manhattanDistance(c1, c2) {
	return abs(c1.c - c2.c) + abs(c1.r - c2.r)
}

function showPath(path) {
	strokeWeight(size / 8);
	stroke(theme.path);
	beginShape();
	noFill();
	for (const cell of path) {
		// fill(0, 255, 0);
		vertex(cell.c * size + size / 2, cell.r * size + size / 2);
	}
	endShape();
}

function getDirection(c1, c2) {
	let x = c2.c - c1.c;
	let y = c2.r - c1.r;
	return { x, y };
}

function highlightCells(cells) {
	for (const cell of cells) {
		let x = cell.c * size;
		let y = cell.r * size;
		noStroke();
		fill(0,255, 255, 60);
		rect(x, y, size, size);
	}
}