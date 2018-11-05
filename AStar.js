class AStar {
    constructor(grid, start, end) {
        this.grid = grid;
        this.start = start;
        this.end = end;

        this.currentNode = start;

        this.openSet = [start];
        this.closedSet = [];

    }

    getNeighbors() {
        let c = this.currentNode.c;
        let r = this.currentNode.r;
        let neighbors = [];

        if (this.grid[r - 1]) {
            neighbors.push()
        }

        if (this.grid[r][c - 1]) {

        }

        if (this.grid[r + 1]) {

        }

        if (this.grid[r][c + 1]) {

        }
    }

    heuristic(a) {
        return max(
            abs(a.i - this.goal.i),
            abs(a.j - this.goal.j)
        );
    }
    removeFromArray(arr, elt) {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

    step() {
        
    }

}