function showGoal() {
	fill(theme.goal);
	noStroke();
	ellipse(goal.c * size + size / 2, goal.r * size + size / 2, size / 2);
}

function showCoins() {
	for (const i in coins) {
		// console.log('make it rain');
		if (coins[i] === true) {
			noStroke();
			fill(theme.player);
			ellipse(grid[i].c * size + size / 2, grid[i].r * size + size / 2, size / 6);
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
		fill(0, 255, 255, 60);
		rect(x, y, size, size);
	}
}

function areNeighbors(c1, c2) {
	if (c1 && c2) {
		for (const n of c1.neighbors) {
			if (n == c2)
				return true;
		}
	}
	return false;
}