// API 客戶端類別 - 處理需要身份驗證的 API
class APIClient {
    constructor() {
        this.baseUrl = 'https://dae-mobile-assignment.hkit.cc/api';
        this.token = null;
    }

    // 設定認證 token
    setToken(token) {
        this.token = token;
    }

    // 獲取當前 token
    getToken() {
        return this.token;
    }

    // 通用 API 請求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // 如果有 token，添加 Authorization header
        if (this.token) {
            defaultOptions.headers['Authorization'] = `Bearer ${this.token}`;
        }

        // 合併選項
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // 獲取書籤列表
    async getBookmarks() {
        try {
            const json = await this.request('/bookmarks', {
                method: 'GET',
            });
            console.log(json.item_ids);
            return json;
        } catch (error) {
            console.error('Failed to fetch bookmarks:', error);
            throw error;
        }
    }

    // 添加書籤
    async addBookmark(itemId) {
        try {
            const json = await this.request(`/bookmarks/${itemId}`, {
                method: 'POST',
            });
            return json;
        } catch (error) {
            console.error('Failed to add bookmark:', error);
            throw error;
        }
    }

    // 刪除書籤
    async removeBookmark(itemId) {
        try {
            const json = await this.request(`/bookmarks/${itemId}`, {
                method: 'DELETE',
            });
            return json;
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
            throw error;
        }
    }
}

// 認證 API 模組
class AuthAPI {
    constructor() {
        this.baseURL = '/api/auth';
        this.userRepo = window.userRepository;
        this.sessionRepo = window.sessionRepository;
        this.apiClient = new APIClient();
    }

    // 生成 token
    generateToken() {
        return this.sessionRepo.generateSecureToken();
    }

    // 註冊使用者
    async signup(userData) {
        try {
            // 先嘗試使用本地儲存
            const localResult = await this.userRepo.createUser(userData);
            
            if (!localResult.success) {
                throw new Error(localResult.error || '註冊失敗');
            }

            // 生成 token 和會話
            const token = this.generateToken();
            const expiresAt = this.sessionRepo.calculateExpirationTime(24 * 7); // 7天
            
            const sessionResult = await this.sessionRepo.createSession(
                localResult.data.id,
                token,
                expiresAt
            );

            if (!sessionResult.success) {
                throw new Error('創建會話失敗');
            }

            // 設定 API 客戶端的認證 token
            this.setAPIToken(token);

            // 嘗試同步到遠端 API (可選)
            try {
                const response = await fetch(`${this.apiClient.baseUrl}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userData.username,
                        password: userData.password
                    })
                });

                if (response.ok) {
                    const apiResult = await response.json();
                    // 如果 API 成功，使用 API 的 token
                    if (apiResult.token) {
                        this.setAPIToken(apiResult.token);
                    }
                }
            } catch (apiError) {
                // API 同步失敗，使用本地 token
                console.log('遠端 API 同步失敗，使用本地註冊');
            }
            
            return {
                user_id: localResult.data.id,
                token: token,
                user: localResult.data
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // 使用者登入
    async login(username, password) {
        try {
            // 先使用本地驗證登入
            const localResult = await this.userRepo.validateLogin(username, password);
            
            if (!localResult.success) {
                throw new Error(localResult.error || '登入失敗');
            }

            // 生成新 token 和會話
            const token = this.generateToken();
            const expiresAt = this.sessionRepo.calculateExpirationTime(24 * 7); // 7天
            
            const sessionResult = await this.sessionRepo.createSession(
                localResult.data.id,
                token,
                expiresAt
            );

            if (!sessionResult.success) {
                throw new Error('創建會話失敗');
            }

            // 設定 API 客戶端的認證 token
            this.setAPIToken(token);

            // 嘗試同步到遠端 API (可選)
            try {
                const response = await fetch(`${this.apiClient.baseUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });

                if (response.ok) {
                    const apiResult = await response.json();
                    // 如果 API 成功，使用 API 的 token
                    if (apiResult.token) {
                        this.setAPIToken(apiResult.token);
                    }
                }
            } catch (apiError) {
                // API 同步失敗，使用本地 token
                console.log('遠端 API 同步失敗，使用本地登入');
            }
            
            return {
                user_id: localResult.data.id,
                token: token,
                user: localResult.data
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // 檢查認證狀態
    async checkAuth(token) {
        try {
            if (!token) {
                return { user_id: null };
            }

            // 移除 "Bearer " 前綴（如果存在）
            const cleanToken = token.replace('Bearer ', '');
            
            // 先使用本地資料庫驗證會話
            const localResult = await this.sessionRepo.validateSessionAndGetUser(cleanToken);
            
            if (!localResult.success) {
                // 本地驗證失敗，嘗試 API
                try {
                    const response = await fetch(`${this.apiClient.baseUrl}/auth/check`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${cleanToken}`,
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        return { user_id: result.user_id };
                    }
                } catch (apiError) {
                    console.log('遠端 API 驗證失敗，使用本地驗證');
                }
                return { user_id: null };
            }

            return { user_id: localResult.data.user.id };
        } catch (error) {
            console.error('檢查認證狀態錯誤:', error);
            return { user_id: null };
        }
    }

    // 登出
    async logout(token) {
        try {
            const cleanToken = token.replace('Bearer ', '');
            
            // 使用安全資料庫停用會話
            const result = await this.sessionRepo.deactivateByToken(cleanToken);
            
            if (result.success) {
                return { success: true };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            throw new Error('登出失敗');
        }
    }

    // 獲取使用者資料
    async getUserById(userId) {
        try {
            const result = await this.userRepo.findById(userId);
            return result.success ? result.data : null;
        } catch (error) {
            console.error('獲取使用者資料錯誤:', error);
            return null;
        }
    }

    // 儲存包含密碼的使用者資料
    async saveUserWithPassword(userData) {
        try {
            // 使用現有的 createUser 方法來儲存完整使用者資料
            // createUser 已經處理了所有必要的驗證和資料儲存
            const result = await this.userRepo.createUser(userData);
            
            if (!result.success) {
                throw new Error(result.error || '儲存使用者資料失敗');
            }
            
            return result;
        } catch (error) {
            console.error('儲存使用者資料錯誤:', error);
            throw new Error(error.message);
        }
    }

    // 清理過期會話
    async cleanExpiredSessions() {
        try {
            const result = await this.sessionRepo.cleanupExpiredSessions();
            return result;
        } catch (error) {
            console.error('清理過期會話錯誤:', error);
            return { success: false, error: error.message };
        }
    }

    // 設定 API 客戶端的認證 token
    setAPIToken(token) {
        this.apiClient.setToken(token);
    }

    // 獲取書籤列表（需要身份驗證）
    async getBookmarks() {
        try {
            return await this.apiClient.getBookmarks();
        } catch (error) {
            console.error('獲取書籤失敗:', error);
            throw error;
        }
    }

    // 添加書籤（需要身份驗證）
    async addBookmark(itemId) {
        try {
            return await this.apiClient.addBookmark(itemId);
        } catch (error) {
            console.error('添加書籤失敗:', error);
            throw error;
        }
    }

    // 刪除書籤（需要身份驗證）
    async removeBookmark(itemId) {
        try {
            return await this.apiClient.removeBookmark(itemId);
        } catch (error) {
            console.error('刪除書籤失敗:', error);
            throw error;
        }
    }


    // 通用 API 請求方法（需要身份驗證）
    async authenticatedRequest(endpoint, options = {}) {
        try {
            return await this.apiClient.request(endpoint, options);
        } catch (error) {
            console.error('認證 API 請求失敗:', error);
            throw error;
        }
    }
}

// 創建全域實例
window.authAPI = new AuthAPI();

