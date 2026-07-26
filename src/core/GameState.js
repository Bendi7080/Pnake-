import eventManager from './EventManager.js';

class GameState {
    constructor() {
        this.states = {
            LOADING: 'loading',
            AUTH: 'auth',
            MAIN_MENU: 'main_menu',
            GAME: 'game',
            PAUSE: 'pause',
            SHOP: 'shop',
            PROFILE: 'profile'
        };
        this.currentState = this.states.LOADING;
    }

    changeState(newState) {
        if (Object.values(this.states).includes(newState)) {
            const oldState = this.currentState;
            this.currentState = newState;
            
            eventManager.emit('StateChanged', {
                from: oldState,
                to: this.currentState
            });
        }
    }

    getCurrentState() {
        return this.currentState;
    }
}

const gameState = new GameState();
export default gameState;
