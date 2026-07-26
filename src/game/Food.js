class Food {
    constructor(tileCount) {
        this.tileCount = tileCount;
        this.x = 5;
        this.y = 5;
    }

    respawn(snakeBody) {
        let valid = false;
        while (!valid) {
            this.x = Math.floor(Math.random() * this.tileCount);
            this.y = Math.floor(Math.random() * this.tileCount);
            valid = !snakeBody.some(segment => segment.x === this.x && segment.y === this.y);
        }
    }
}

export default Food;
