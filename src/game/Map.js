import Snake from './Snake.js';
import Food from './Food.js';
import eventManager from '../core/EventManager.js';

class GameMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.tileCount = 20;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.snake = new Snake(this.tileCount);
        this.food = new Food(this.tileCount);

        this.score = 0;
        this.isGameOver = false;
        this.gameInterval = null;
        this.gameSpeed = 120;

        this.initControls();
    }

    resizeCanvas() {
        const size = Math.min(window.innerWidth * 0.9, 360);
        this.canvas.width = size;
        this.canvas.height = size;
        this.tileSize = size / this.tileCount;
    }

    initControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') this.snake.setDirection('UP');
            if (e.key === 'ArrowDown' || e.key === 's') this.snake.setDirection('DOWN');
            if (e.key === 'ArrowLeft' || e.key === 'a') this.snake.setDirection('LEFT');
            if (e.key === 'ArrowRight' || e.key === 'd') this.snake.setDirection('RIGHT');
        });

        const bindBtn = (id, dir) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => this.snake.setDirection(dir));
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.snake.setDirection(dir);
                });
            }
        };

        bindBtn('btn-up', 'UP');
        bindBtn('btn-down', 'DOWN');
        bindBtn('btn-left', 'LEFT');
        bindBtn('btn-right', 'RIGHT');
    }

    start() {
        this.score = 0;
        this.isGameOver = false;
        this.snake.reset();
        this.food.respawn(this.snake.body);
        this.updateScoreUI();

        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.loop(), this.gameSpeed);
    }

    loop() {
        if (this.isGameOver) return;

        this.snake.update();

        if (this.snake.checkWallCollision(this.tileCount) || this.snake.checkSelfCollision()) {
            this.gameOver();
            return;
        }

        const head = this.snake.body[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.grow();
            this.food.respawn(this.snake.body);
            this.score += 10;
            this.updateScoreUI();

            if (this.score % 20 === 0) {
                eventManager.emit('AddPnivs', 1);
            }
        }

        this.render();
    }

    render() {
        this.ctx.fillStyle = '#F5F5DC';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#FFB7C5';
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x + 0.5) * this.tileSize,
            (this.food.y + 0.5) * this.tileSize,
            this.tileSize * 0.4, 0, Math.PI * 2
        );
        this.ctx.fill();

        this.snake.body.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#40E0D0' : '#98FF98';
            this.ctx.fillRect(
                segment.x * this.tileSize + 1,
                segment.y * this.tileSize + 1,
                this.tileSize - 2,
                this.tileSize - 2
            );
        });
    }

    updateScoreUI() {
        const scoreEl = document.getElementById('game-score');
        if (scoreEl) scoreEl.textContent = this.score;
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameInterval);
        alert(`Игра окончена! Очки: ${this.score}`);
        eventManager.emit('GameOver', { score: this.score });
        import('../core/GameState.js').then(gs => {
            gs.default.changeState(gs.default.states.MAIN_MENU);
        });
    }
}

export default GameMap;
