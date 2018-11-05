
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
