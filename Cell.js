class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.wall = random() < .3;
        this.neighbors = [];
    }

    show() {
        noStroke();
        if (this.wall) {
            fill(51);
            ellipse(this.c * w + w / 2, this.r * w + w / 2, w);
        }
        if (this.goal) {
            fill(0,255, 12);
            ellipse(this.c * w + w / 2, this.r * w + w / 2, w);
        }
    }

    makeGoal() {
        this.goal = true;
        this.wall = false;
    }

    makeStart() {
        this.wall = false;
    }

    getNeighbors() {
        
    }

}