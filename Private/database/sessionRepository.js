// 會話資料庫操作類別
class SessionRepository {
    constructor() {
        this.db = window.secureDB;
    }

    // 創建會話
    async createSession(userId, token, expiresAt, ipAddress = null, userAgent = null) {
        try {
            const sessionData = {
                userId: userId,
                token: token,
                expiresAt: expiresAt,
                ipAddress: ipAddress,
                userAgent: userAgent,
                isActive: true
            };

            const result = await this.db.insert('sessions', sessionData);
            
            if (result.success) {
                return { 
                    success: true, 
                    data: result.data,
                    message: '會話創建成功'
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('創建會話錯誤:', error);
            return { success: false, error: '創建會話時發生錯誤' };
        }
    }

    // 根據token查找會話
    async findByToken(token) {
        try {
            const result = await this.db.select('sessions', { 
                token: token, 
                isActive: true 
            });
            
            if (result.success && result.data.length > 0) {
                const session = result.data[0];
                
                // 檢查會話是否過期
                if (new Date(session.expiresAt) <= new Date()) {
                    // 會話已過期，標記為非活躍
                    await this.deactivateSession(session.id);
                    return { success: false, error: '會話已過期' };
                }
                
                return { success: true, data: session };
            } else {
                return { success: false, error: '會話不存在' };
            }
        } catch (error) {
            console.error('查找會話錯誤:', error);
            return { success: false, error: '查找會話時發生錯誤' };
        }
    }

    // 根據使用者ID查找所有活躍會話
    async findByUserId(userId) {
        try {
            const result = await this.db.select('sessions', { 
                userId: userId, 
                isActive: true 
            });
            
            if (result.success) {
                // 過濾掉過期的會話
                const now = new Date();
                const activeSessions = result.data.filter(session => 
                    new Date(session.expiresAt) > now
                );
                
                return { success: true, data: activeSessions };
            } else {
                return { success: false, error: result.error, data: [] };
            }
        } catch (error) {
            console.error('查找使用者會話錯誤:', error);
            return { success: false, error: '查找會話時發生錯誤', data: [] };
        }
    }

    // 停用會話
    async deactivateSession(sessionId) {
        try {
            const updateData = {
                isActive: false,
                updatedAt: new Date().toISOString()
            };
            
            const result = await this.db.update('sessions', sessionId, updateData);
            
            if (result.success) {
                return { success: true, message: '會話已停用' };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('停用會話錯誤:', error);
            return { success: false, error: '停用會話時發生錯誤' };
        }
    }

    // 根據token停用會話
    async deactivateByToken(token) {
        try {
            const sessionResult = await this.findByToken(token);
            
            if (sessionResult.success) {
                return await this.deactivateSession(sessionResult.data.id);
            } else {
                return { success: false, error: sessionResult.error };
            }
        } catch (error) {
            console.error('根據token停用會話錯誤:', error);
            return { success: false, error: '停用會話時發生錯誤' };
        }
    }

    // 停用使用者的所有會話
    async deactivateAllUserSessions(userId) {
        try {
            const sessionsResult = await this.findByUserId(userId);
            
            if (sessionsResult.success) {
                const promises = sessionsResult.data.map(session => 
                    this.deactivateSession(session.id)
                );
                
                await Promise.all(promises);
                
                return { 
                    success: true, 
                    message: `已停用 ${sessionsResult.data.length} 個會話` 
                };
            } else {
                return { success: false, error: sessionsResult.error };
            }
        } catch (error) {
            console.error('停用所有會話錯誤:', error);
            return { success: false, error: '停用會話時發生錯誤' };
        }
    }

    // 延長會話
    async extendSession(sessionId, newExpiresAt) {
        try {
            const updateData = {
                expiresAt: newExpiresAt,
                updatedAt: new Date().toISOString()
            };
            
            const result = await this.db.update('sessions', sessionId, updateData);
            
            if (result.success) {
                return { success: true, data: result.data, message: '會話已延長' };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('延長會話錯誤:', error);
            return { success: false, error: '延長會話時發生錯誤' };
        }
    }

    // 清理過期會話
    async cleanupExpiredSessions() {
        try {
            const result = await this.db.select('sessions', { isActive: true });
            
            if (result.success) {
                const now = new Date();
                const expiredSessions = result.data.filter(session => 
                    new Date(session.expiresAt) <= now
                );
                
                const promises = expiredSessions.map(session => 
                    this.deactivateSession(session.id)
                );
                
                await Promise.all(promises);
                
                return { 
                    success: true, 
                    message: `已清理 ${expiredSessions.length} 個過期會話` 
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('清理過期會話錯誤:', error);
            return { success: false, error: '清理會話時發生錯誤' };
        }
    }

    // 獲取會話統計
    async getSessionStats() {
        try {
            const result = await this.db.select('sessions');
            
            if (result.success) {
                const sessions = result.data;
                const now = new Date();
                
                const activeSessions = sessions.filter(session => 
                    session.isActive && new Date(session.expiresAt) > now
                );
                
                const expiredSessions = sessions.filter(session => 
                    session.isActive && new Date(session.expiresAt) <= now
                );
                
                const inactiveSessions = sessions.filter(session => !session.isActive);
                
                // 按使用者統計
                const userSessionCount = {};
                activeSessions.forEach(session => {
                    userSessionCount[session.userId] = (userSessionCount[session.userId] || 0) + 1;
                });
                
                return {
                    success: true,
                    data: {
                        totalSessions: sessions.length,
                        activeSessions: activeSessions.length,
                        expiredSessions: expiredSessions.length,
                        inactiveSessions: inactiveSessions.length,
                        userSessionCount,
                        lastUpdated: new Date().toISOString()
                    }
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('獲取會話統計錯誤:', error);
            return { success: false, error: '獲取統計資料時發生錯誤' };
        }
    }

    // 驗證會話並獲取使用者資訊
    async validateSessionAndGetUser(token) {
        try {
            const sessionResult = await this.findByToken(token);
            
            if (!sessionResult.success) {
                return { success: false, error: sessionResult.error };
            }
            
            const session = sessionResult.data;
            
            // 獲取使用者資訊
            const userResult = await window.userRepository.findById(session.userId);
            
            if (!userResult.success) {
                return { success: false, error: '使用者不存在' };
            }
            
            return { 
                success: true, 
                data: {
                    session: session,
                    user: userResult.data
                }
            };
        } catch (error) {
            console.error('驗證會話錯誤:', error);
            return { success: false, error: '驗證會話時發生錯誤' };
        }
    }

    // 生成安全token
    generateSecureToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return 'token_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 計算會話過期時間
    calculateExpirationTime(hours = 24) {
        const now = new Date();
        return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
    }
}

// 創建全域實例
window.sessionRepository = new SessionRepository();

