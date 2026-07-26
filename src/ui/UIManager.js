import eventManager from '../core/EventManager.js';
import gameState from '../core/GameState.js';

class UIManager {
    constructor() {
        this.screens = {
            [gameState.states.LOADING]: document.getElementById('screen-loading'),
            [gameState.states.AUTH]: document.getElementById('screen-auth'),
            [gameState.states.MAIN_MENU]: document.getElementById('screen-main'),
            [gameState.states.GAME]: document.getElementById('screen-game')
        };

        this.init();
    }

    init() {
        eventManager.on('StateChanged', (data) => this.switchScreen(data.to));
    }

    switchScreen(stateName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        const activeScreen = this.screens[stateName];
        if (activeScreen) {
            activeScreen.classList.add('active');
        }
    }
}

const uiManager = new UIManager();
export default uiManager;
