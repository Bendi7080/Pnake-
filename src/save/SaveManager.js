import eventManager from '../core/EventManager.js';
import accountSystem from '../player/Account.js';

class SaveManager {
    constructor() {
        this.initListeners();
    }

    initListeners() {
        eventManager.on('AddPnivs', (amount) => this.addCurrency(amount));
        eventManager.on('GameOver', (data) => this.saveStats(data.score));
        eventManager.on('UserLoggedIn', () => this.syncUI());
    }

    getSaveKey() {
        const user = accountSystem.getCurrentUser();
        return user ? `pnake_save_${user.username}` : 'pnake_save_guest';
    }

    loadData() {
        const key = this.getSaveKey();
        const defaultData = { pnivs: 0, highScore: 0 };
        const saved = localStorage.getItem(key);
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveData(data) {
        localStorage.setItem(this.getSaveKey(), JSON.stringify(data));
    }

    addCurrency(amount) {
        const data = this.loadData();
        data.pnivs = (data.pnivs || 0) + amount;
        this.saveData(data);
        this.syncUI();
    }

    saveStats(score) {
        const data = this.loadData();
        if (score > (data.highScore || 0)) data.highScore = score;
        this.saveData(data);
    }

    syncUI() {
        const data = this.loadData();
        const pnivsEl = document.getElementById('menu-pnivs');
        if (pnivsEl) pnivsEl.textContent = data.pnivs;
    }
}

const saveManager = new SaveManager();
export default saveManager;
