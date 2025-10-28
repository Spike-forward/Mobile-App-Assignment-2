// 會話管理模組
class SessionManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    // 初始化會話管理
    init() {
        // 檢查是否有儲存的 token
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            this.token = storedToken;
            this.checkAuthStatus();
        }
    }

    // 檢查認證狀態
    async checkAuthStatus() {
        if (!this.token) {
            this.clearSession();
            return false;
        }

        try {
            const response = await window.authAPI.checkAuth(this.token);
            if (response.user_id) {
                this.currentUser = await window.authAPI.getUserById(response.user_id);
                return true;
            } else {
                this.clearSession();
                return false;
            }
        } catch (error) {
            console.error('認證檢查失敗:', error);
            this.clearSession();
            return false;
        }
    }

    // 登入
    async login(username, password) {
        try {
            const response = await window.authAPI.login(username, password);
            this.token = response.token;
            this.currentUser = response.user;
            
            // 儲存 token 到 localStorage
            localStorage.setItem('auth_token', this.token);
            
            // 觸發登入事件
            this.dispatchEvent('login', { user: this.currentUser });
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 登出
    async logout() {
        try {
            if (this.token) {
                await window.authAPI.logout(this.token);
            }
            
            this.clearSession();
            
            // 觸發登出事件
            this.dispatchEvent('logout');
            
            return { success: true };
        } catch (error) {
            console.error('登出失敗:', error);
            this.clearSession();
            return { success: false, error: error.message };
        }
    }

    // 清除會話
    clearSession() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    // 檢查是否已登入
    isLoggedIn() {
        return this.currentUser !== null && this.token !== null;
    }

    // 獲取當前使用者
    getCurrentUser() {
        return this.currentUser;
    }

    // 獲取 token
    getToken() {
        return this.token;
    }

    // 更新使用者資料
    updateUser(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
        }
    }

    // 事件分發
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }

    // 監聽事件
    on(eventName, callback) {
        window.addEventListener(eventName, callback);
    }

    // 移除事件監聽
    off(eventName, callback) {
        window.removeEventListener(eventName, callback);
    }
}

// 創建全域實例
window.sessionManager = new SessionManager();

