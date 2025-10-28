// 使用者資料庫操作類別
class UserRepository {
    constructor() {
        this.db = window.secureDB;
    }

    // 創建使用者
    async createUser(userData) {
        try {
            // 驗證必填欄位
            const requiredFields = ['username', 'password', 'studentId', 'email', 'fullName'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    return { success: false, error: `缺少必填欄位: ${field}` };
                }
            }

            // 檢查使用者名稱是否已存在
            const existingUser = await this.findByUsername(userData.username);
            if (existingUser.success && existingUser.data) {
                return { success: false, error: '使用者名稱已存在' };
            }

            // 檢查學號是否已存在
            const existingStudent = await this.findByStudentId(userData.studentId);
            if (existingStudent.success && existingStudent.data) {
                return { success: false, error: '學號已被註冊' };
            }

            // 檢查電子郵件是否已存在
            const existingEmail = await this.findByEmail(userData.email);
            if (existingEmail.success && existingEmail.data) {
                return { success: false, error: '電子郵件已被註冊' };
            }

            // 雜湊密碼
            const hashedPassword = await this.db.hashPassword(userData.password);
            
            // 準備使用者資料
            const userRecord = {
                username: userData.username,
                password: hashedPassword,
                studentId: userData.studentId,
                email: userData.email,
                fullName: userData.fullName,
                phone: userData.phone || null,
                birthDate: userData.birthDate || null,
                gender: userData.gender || null,
                department: userData.department || null,
                grade: userData.grade || null,
                programmingLevel: userData.programmingLevel || null,
                learningGoals: userData.learningGoals || null,
                interestedCourses: userData.interestedCourses ? 
                    JSON.stringify(userData.interestedCourses) : null,
                newsletter: userData.newsletter || false,
                isActive: true
            };

            // 插入資料庫
            const result = await this.db.insert('users', userRecord);
            
            if (result.success) {
                // 移除密碼後返回
                const { password, ...userWithoutPassword } = result.data;
                return { 
                    success: true, 
                    data: userWithoutPassword,
                    message: '使用者創建成功'
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('創建使用者錯誤:', error);
            return { success: false, error: '創建使用者時發生錯誤' };
        }
    }

    // 根據使用者名稱查找使用者
    async findByUsername(username) {
        try {
            const result = await this.db.select('users', { username: username, isActive: true });
            
            if (result.success && result.data.length > 0) {
                return { success: true, data: result.data[0] };
            } else {
                return { success: false, error: '使用者不存在' };
            }
        } catch (error) {
            console.error('查找使用者錯誤:', error);
            return { success: false, error: '查找使用者時發生錯誤' };
        }
    }

    // 根據學號查找使用者
    async findByStudentId(studentId) {
        try {
            const result = await this.db.select('users', { studentId: studentId, isActive: true });
            
            if (result.success && result.data.length > 0) {
                return { success: true, data: result.data[0] };
            } else {
                return { success: false, error: '使用者不存在' };
            }
        } catch (error) {
            console.error('查找使用者錯誤:', error);
            return { success: false, error: '查找使用者時發生錯誤' };
        }
    }

    // 根據電子郵件查找使用者
    async findByEmail(email) {
        try {
            const result = await this.db.select('users', { email: email, isActive: true });
            
            if (result.success && result.data.length > 0) {
                return { success: true, data: result.data[0] };
            } else {
                return { success: false, error: '使用者不存在' };
            }
        } catch (error) {
            console.error('查找使用者錯誤:', error);
            return { success: false, error: '查找使用者時發生錯誤' };
        }
    }

    // 根據ID查找使用者
    async findById(id) {
        try {
            const result = await this.db.findById('users', id);
            
            if (result.success) {
                // 移除密碼後返回
                const { password, ...userWithoutPassword } = result.data;
                return { success: true, data: userWithoutPassword };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('查找使用者錯誤:', error);
            return { success: false, error: '查找使用者時發生錯誤' };
        }
    }

    // 根據電話號碼查找使用者
    async findByPhone(phoneNumber) {
        try {
            // 標準化電話號碼用於搜索
            const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '').replace(/\D/g, '');
            
            const result = await this.db.select('users', { isActive: true });
            
            if (result.success && result.data.length > 0) {
                // 在所有用戶中搜索匹配的電話號碼
                const matchedUser = result.data.find(u => {
                    if (!u.phone) return false;
                    
                    const userPhone = u.phone.toString().replace(/[\s\-\(\)]/g, '').replace(/\D/g, '');
                    
                    // 完全匹配
                    if (userPhone === cleanPhone) {
                        return true;
                    }
                    
                    // 後8位匹配（忽略區號）
                    if (cleanPhone.length >= 8 && userPhone.length >= 8) {
                        const inputLast8 = cleanPhone.slice(-8);
                        const storedLast8 = userPhone.slice(-8);
                        if (inputLast8 === storedLast8) {
                            return true;
                        }
                    }
                    
                    return false;
                });
                
                if (matchedUser) {
                    // 移除密碼後返回
                    const { password, ...userWithoutPassword } = matchedUser;
                    return { success: true, data: userWithoutPassword };
                }
            }
            
            return { success: false, error: '找不到該電話號碼的帳戶' };
        } catch (error) {
            console.error('根據電話號碼查找使用者錯誤:', error);
            return { success: false, error: '查找使用者時發生錯誤' };
        }
    }

    // 驗證使用者登入
    async validateLogin(username, password) {
        try {
            // 查找使用者（包含密碼）
            const result = await this.db.select('users', { username: username, isActive: true });
            
            console.log('validateLogin - search result:', result);
            
            if (!result.success || result.data.length === 0) {
                console.log('validateLogin - user not found');
                return { success: false, error: '使用者名稱或密碼錯誤' };
            }

            const user = result.data[0];
            console.log('validateLogin - user found:', user.username);
            
            // 驗證密碼
            const isValidPassword = await this.db.verifyPassword(password, user.password);
            console.log('validateLogin - password valid:', isValidPassword);
            
            if (!isValidPassword) {
                console.log('validateLogin - password does not match');
                return { success: false, error: '使用者名稱或密碼錯誤' };
            }

            // 更新最後登入時間
            await this.updateLastLogin(user.id);

            // 移除密碼後返回
            const { password: _, ...userWithoutPassword } = user;
            return { 
                success: true, 
                data: userWithoutPassword,
                message: '登入成功'
            };
        } catch (error) {
            console.error('驗證登入錯誤:', error);
            return { success: false, error: '登入驗證時發生錯誤' };
        }
    }

    // 更新使用者資料
    async updateUser(id, updateData) {
        try {
            // 如果更新密碼，需要雜湊
            if (updateData.password) {
                updateData.password = await this.db.hashPassword(updateData.password);
            }

            // 如果更新有興趣的課程，轉換為JSON字串
            if (updateData.interestedCourses) {
                updateData.interestedCourses = JSON.stringify(updateData.interestedCourses);
            }

            const result = await this.db.update('users', id, updateData);
            
            if (result.success) {
                // 移除密碼後返回
                const { password, ...userWithoutPassword } = result.data;
                return { 
                    success: true, 
                    data: userWithoutPassword,
                    message: '使用者資料更新成功'
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('更新使用者錯誤:', error);
            return { success: false, error: '更新使用者時發生錯誤' };
        }
    }

    // 更新最後登入時間
    async updateLastLogin(id) {
        try {
            const updateData = {
                lastLoginAt: new Date().toISOString()
            };
            
            await this.db.update('users', id, updateData);
        } catch (error) {
            console.error('更新最後登入時間錯誤:', error);
        }
    }

    // 停用使用者
    async deactivateUser(id) {
        try {
            const updateData = {
                isActive: false,
                updatedAt: new Date().toISOString()
            };
            
            const result = await this.db.update('users', id, updateData);
            
            if (result.success) {
                return { success: true, message: '使用者已停用' };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('停用使用者錯誤:', error);
            return { success: false, error: '停用使用者時發生錯誤' };
        }
    }

    // 啟用使用者
    async activateUser(id) {
        try {
            const updateData = {
                isActive: true,
                updatedAt: new Date().toISOString()
            };
            
            const result = await this.db.update('users', id, updateData);
            
            if (result.success) {
                return { success: true, message: '使用者已啟用' };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('啟用使用者錯誤:', error);
            return { success: false, error: '啟用使用者時發生錯誤' };
        }
    }

    // 獲取所有使用者（管理員功能）
    async getAllUsers() {
        try {
            const result = await this.db.select('users');
            
            if (result.success) {
                // 移除所有使用者的密碼
                const usersWithoutPasswords = result.data.map(user => {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                });
                
                return { success: true, data: usersWithoutPasswords };
            } else {
                return { success: false, error: result.error, data: [] };
            }
        } catch (error) {
            console.error('獲取所有使用者錯誤:', error);
            return { success: false, error: '獲取使用者清單時發生錯誤', data: [] };
        }
    }

    // 搜尋使用者
    async searchUsers(searchTerm) {
        try {
            const result = await this.db.select('users');
            
            if (result.success) {
                const filteredUsers = result.data.filter(user => 
                    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                );

                // 移除密碼
                const usersWithoutPasswords = filteredUsers.map(user => {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                });
                
                return { success: true, data: usersWithoutPasswords };
            } else {
                return { success: false, error: result.error, data: [] };
            }
        } catch (error) {
            console.error('搜尋使用者錯誤:', error);
            return { success: false, error: '搜尋使用者時發生錯誤', data: [] };
        }
    }

    // 獲取使用者統計
    async getUserStats() {
        try {
            const result = await this.db.select('users');
            
            if (result.success) {
                const users = result.data;
                const activeUsers = users.filter(user => user.isActive);
                const inactiveUsers = users.filter(user => !user.isActive);
                
                // 按科系統計
                const departmentStats = {};
                users.forEach(user => {
                    if (user.department) {
                        departmentStats[user.department] = (departmentStats[user.department] || 0) + 1;
                    }
                });

                // 按程式經驗等級統計
                const levelStats = {};
                users.forEach(user => {
                    if (user.programmingLevel) {
                        levelStats[user.programmingLevel] = (levelStats[user.programmingLevel] || 0) + 1;
                    }
                });

                return {
                    success: true,
                    data: {
                        totalUsers: users.length,
                        activeUsers: activeUsers.length,
                        inactiveUsers: inactiveUsers.length,
                        departmentStats,
                        levelStats,
                        lastUpdated: new Date().toISOString()
                    }
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('獲取使用者統計錯誤:', error);
            return { success: false, error: '獲取統計資料時發生錯誤' };
        }
    }
}

// 創建全域實例
window.userRepository = new UserRepository();

