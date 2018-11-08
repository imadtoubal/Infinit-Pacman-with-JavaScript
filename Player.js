function Player() {
	this.x = goal.c * size + size / 2;
	this.y = goal.r * size + size / 2;
	this.s = (size / updateFrequency);
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
		let currentIndex = getIndex(round((this.y - size / 2) / size), round((this.x - size / 2) / size))
		let currentCell = grid[currentIndex];
		let nextCell = grid[getIndex(round((this.y - size / 2) / size) + this.dir.y, round((this.x - size / 2) / size) + this.dir.x)];
		// let nextCellCoordinates = {
		// 	x: nextCell.c * size + size / 2,
		// 	y: nextCell.r * size + size / 2
		// }

		if (!areNeighbors(currentCell, nextCell)) {
			// console.log(!areNeighbors(currentCell, nextCell));
			this.dir.x = 0;
			this.dir.y = 0;
			
		}
		
		// Get the coin
		if(coins[currentIndex]) {
			score ++;
			coins[currentIndex] =false;
		}

		this.x += this.dir.x * this.s;
		this.y += this.dir.y * this.s;

		if (!((this.x - (size / 2)) > 0 && (this.x - size / 2) < width - size)) {
			this.dir.x = 0;
		}
		if (!((this.y - size / 2) > 0 && (this.y - size / 2) < height - size)) {
			this.dir.y = 0;
		}

		if(this.dir.x == 0) {
			this.x = currentCell.c * size + size / 2;
		}
		if(this.dir.y == 0) {
			this.y = currentCell.r * size + size / 2;
		}
	}

}
