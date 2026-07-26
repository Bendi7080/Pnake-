import gameState from './GameState.js';
import uiManager from '../ui/UIManager.js';
import accountSystem from '../player/Account.js';
import mainMenuUI from '../ui/MainMenuUI.js';
import saveManager from '../save/SaveManager.js';
import GameMap from '../game/Map.js';

class GameEngine {
    constructor() {
        this.initApp();
        this.gameMap = new GameMap('game-canvas');
        
        eventManager.on('StartGame', () => {
            this.gameMap.start();
        });
    }

    initApp() {
        gameState.changeState(gameState.states.LOADING);

        setTimeout(() => {
            this.setupAuthUI();
            gameState.changeState(gameState.states.AUTH);
        }, 1500);
    }

    setupAuthUI() {
        const btnLoginTab = document.getElementById('tab-login');
        const btnRegisterTab = document.getElementById('tab-register');
        const inputConfirm = document.getElementById('input-password-confirm');
        const btnSubmit = document.getElementById('btn-auth-submit');
        const errorText = document.getElementById('auth-error');
        const authForm = document.getElementById('form-auth');
        const btnGuest = document.getElementById('btn-guest');

        let isRegisterMode = false;

        const toggleMode = (registerMode) => {
            isRegisterMode = registerMode;
            btnLoginTab.classList.toggle('active', !isRegisterMode);
            btnRegisterTab.classList.toggle('active', isRegisterMode);
            inputConfirm.style.display = isRegisterMode ? 'block' : 'none';
            btnSubmit.textContent = isRegisterMode ? 'Зарегистрироваться' : 'Войти';
            errorText.textContent = '';
        };

        btnLoginTab.addEventListener('click', () => toggleMode(false));
        btnRegisterTab.addEventListener('click', () => toggleMode(true));

        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('input-username').value.trim();
            const password = document.getElementById('input-password').value;
            errorText.textContent = '';

            if (isRegisterMode) {
                if (password !== inputConfirm.value) {
                    errorText.textContent = 'Пароли не совпадают';
                    return;
                }
                const res = accountSystem.register(username, password);
                if (!res.success) errorText.textContent = res.message;
            } else {
                const res = accountSystem.login(username, password);
                if (!res.success) errorText.textContent = res.message;
            }
        });

        btnGuest.addEventListener('click', () => {
            accountSystem.loginAsGuest();
        });
    }
}

import eventManager from './EventManager.js';

document.addEventListener('DOMContentLoaded', () => {
    new GameEngine();
});
