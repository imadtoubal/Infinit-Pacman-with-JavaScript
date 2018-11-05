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
