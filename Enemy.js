
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
	this.findPath = function (r, c, algorithm) {
		console.time(algorithm);
		answer = this[algorithm](r, c);
		console.timeEnd(algorithm);
		return answer;
	}

	this.DFS = function (r, c) {
		let goalCell = grid[getIndex(r, c)];
		let currentCell = this.cell;
		for (const cell of grid) {
			cell.visited = false;
		}
		let path = [];
		let current = this.depthFirst(goalCell, currentCell);
		while (current) {
			path.unshift(current);
			current = current.parent;
		}
		return path;
	}

	this.depthFirst = function (goal, cell) {
		cell.visited = true;
		if (cell == goal) {
			return cell;
		}
		for (const n of cell.neighbors) {
			n.parent = cell;
			if (!n.visited) {
				return this.depthFirst(goal, n);
			}
		}


	}

	this.AStar = function (r, c) {
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

	this.bestFirst = function (r, c) {
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
				n.f = n.heuristic;
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

	this.hillClimbing = function (r, c) {
		// currentNode = startNode;
		let goalCell = grid[getIndex(r, c)];
		let currentCell = this.cell;
		if(currentCell == goalCell) {
			return [currentCell, currentCell];
		}
		currentCell.heuristic = manhattanDistance(currentCell, goalCell);
		let bestHeuristic = currentCell.heuristic;
		let nextCell;

		for (const n of currentCell.neighbors) {
			n.heuristic = manhattanDistance(n, goalCell);
			if (n.heuristic < bestHeuristic) {
				nextCell = n;
				bestHeuristic = n.heuristic;
			}

		}
		if (bestHeuristic >= currentCell.heuristic) {
			nextCell = currentCell;
		}
		// console.log('yes');
		return [currentCell, nextCell];
	}

	this.show = function () {
		fill(theme.enemy);
		noStroke();
		ellipse(this.x + size / 2, this.y + size / 2, size * 0.5);
	}
}