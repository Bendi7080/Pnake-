import eventManager from '../core/EventManager.js';
import gameState from '../core/GameState.js';

class MainMenuUI {
    constructor() {
        this.initListeners();
    }

    initListeners() {
        eventManager.on('UserLoggedIn', (user) => {
            this.updateUserData(user);
        });

        document.getElementById('btn-play').addEventListener('click', () => {
            gameState.changeState(gameState.states.GAME);
            eventManager.emit('StartGame');
        });
    }

    updateUserData(user) {
        const nicknameEl = document.getElementById('menu-nickname');
        const titleEl = document.getElementById('menu-title');
        
        if (nicknameEl) nicknameEl.textContent = user.username;
        if (titleEl) titleEl.textContent = user.isGuest ? 'Гость Сада' : 'Новичок Лотоса';
    }
}

const mainMenuUI = new MainMenuUI();
export default mainMenuUI;
