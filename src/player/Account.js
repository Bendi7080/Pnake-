import eventManager from '../core/EventManager.js';
import gameState from '../core/GameState.js';

class AccountSystem {
    constructor() {
        this.currentUser = null;
        this.dbKey = 'pnake_accounts';
        this.initDatabase();
    }

    initDatabase() {
        if (!localStorage.getItem(this.dbKey)) {
            localStorage.setItem(this.dbKey, JSON.stringify({}));
        }
    }

    getDatabase() {
        return JSON.parse(localStorage.getItem(this.dbKey));
    }

    saveDatabase(data) {
        localStorage.setItem(this.dbKey, JSON.stringify(data));
    }

    register(username, password) {
        const db = this.getDatabase();
        if (db[username]) {
            return { success: false, message: 'Этот ник уже занят' };
        }
        if (username.length < 3) {
            return { success: false, message: 'Ник слишком короткий' };
        }

        db[username] = {
            password: btoa(password),
            id: 'ID_' + Date.now().toString(36),
            isGuest: false
        };

        this.saveDatabase(db);
        return this.login(username, password);
    }

    login(username, password) {
        const db = this.getDatabase();
        const user = db[username];

        if (!user) return { success: false, message: 'Аккаунт не найден' };
        if (user.password !== btoa(password)) return { success: false, message: 'Неверный пароль' };

        this.currentUser = { username, ...user };
        eventManager.emit('UserLoggedIn', this.currentUser);
        gameState.changeState(gameState.states.MAIN_MENU);
        
        return { success: true };
    }

    loginAsGuest() {
        const guestName = 'Гость_' + Math.floor(Math.random() * 10000);
        this.currentUser = {
            username: guestName,
            id: 'GUEST_' + Date.now(),
            isGuest: true
        };
        
        eventManager.emit('UserLoggedIn', this.currentUser);
        gameState.changeState(gameState.states.MAIN_MENU);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

const accountSystem = new AccountSystem();
export default accountSystem;
