class Snake {
    constructor(gridSize = 20) {
        this.gridSize = gridSize;
        this.reset();
    }

    reset() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.growPending = false;
    }

    setDirection(newDir) {
        const opposites = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
        if (opposites[newDir] !== this.direction) {
            this.nextDirection = newDir;
        }
    }

    update() {
        this.direction = this.nextDirection;
        const head = { ...this.body[0] };

        switch (this.direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
        }

        this.body.unshift(head);

        if (this.growPending) {
            this.growPending = false;
        } else {
            this.body.pop();
        }
    }

    grow() {
        this.growPending = true;
    }

    checkSelfCollision() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) return true;
        }
        return false;
    }

    checkWallCollision(tileCount) {
        const head = this.body[0];
        return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
    }
}

export default Snake;
