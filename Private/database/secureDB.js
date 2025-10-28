// 安全資料庫系統
class SecureDatabase {
  constructor() {
    this.dbName = 'programming_platform_db';
    this.encryptionKey = this.generateEncryptionKey();
    this.init();
  }

  // 初始化資料庫
  init() {
    this.ensureEncryptionKey();
    this.createTables();
  }

  // 生成加密金鑰
  generateEncryptionKey() {
    let key = localStorage.getItem('db_encryption_key');
    if (!key) {
      // 生成32字節的隨機金鑰
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('db_encryption_key', key);
    }
    return key;
  }

  // 確保加密金鑰存在
  ensureEncryptionKey() {
    if (!localStorage.getItem('db_encryption_key')) {
      this.encryptionKey = this.generateEncryptionKey();
    }
  }

  // 創建資料表結構
  createTables() {
    const tables = {
      users: {
        structure: {
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          username: 'TEXT UNIQUE NOT NULL',
          studentId: 'TEXT UNIQUE NOT NULL',
          email: 'TEXT UNIQUE NOT NULL',
          password: 'TEXT NOT NULL',
          fullName: 'TEXT NOT NULL',
          phone: 'TEXT',
          birthDate: 'TEXT',
          gender: 'TEXT',
          department: 'TEXT',
          grade: 'TEXT',
          programmingLevel: 'TEXT',
          learningGoals: 'TEXT',
          interestedCourses: 'TEXT', // JSON string
          newsletter: 'BOOLEAN DEFAULT 0',
          isActive: 'BOOLEAN DEFAULT 1',
          createdAt: 'TEXT NOT NULL',
          lastLoginAt: 'TEXT',
          updatedAt: 'TEXT'
        },
        indexes: ['username', 'studentId', 'email']
      },
      sessions: {
        structure: {
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          userId: 'INTEGER NOT NULL',
          token: 'TEXT UNIQUE NOT NULL',
          createdAt: 'TEXT NOT NULL',
          expiresAt: 'TEXT NOT NULL',
          isActive: 'BOOLEAN DEFAULT 1',
          ipAddress: 'TEXT',
          userAgent: 'TEXT'
        },
        indexes: ['userId', 'token', 'expiresAt']
      },
      favorites: {
        structure: {
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          userId: 'INTEGER NOT NULL',
          courseId: 'INTEGER NOT NULL',
          createdAt: 'TEXT NOT NULL',
          isActive: 'BOOLEAN DEFAULT 1'
        },
        indexes: ['userId', 'courseId']
      },
      audit_logs: {
        structure: {
          id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
          userId: 'INTEGER',
          action: 'TEXT NOT NULL',
          tableName: 'TEXT NOT NULL',
          recordId: 'INTEGER',
          oldValues: 'TEXT', // JSON string
          newValues: 'TEXT', // JSON string
          ipAddress: 'TEXT',
          userAgent: 'TEXT',
          createdAt: 'TEXT NOT NULL'
        },
        indexes: ['userId', 'action', 'createdAt']
      }
    };

    this.tables = tables;
    this.initializeTables();
  }

  // 初始化資料表
  initializeTables() {
    Object.keys(this.tables).forEach(tableName => {
      if (!localStorage.getItem(`${this.dbName}_${tableName}`)) {
        localStorage.setItem(`${this.dbName}_${tableName}`, JSON.stringify([]));
      }
    });
  }

  // 簡單的加密函數
  async encrypt(text) {
    try {
      const key = await this.importKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedText = new TextEncoder().encode(text);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedText
      );

      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encrypted), iv.length);

      return Array.from(result, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('加密錯誤:', error);
      return text; // 如果加密失敗，返回原文
    }
  }

  // 簡單的解密函數
  async decrypt(encryptedText) {
    try {
      const key = await this.importKey();
      const encryptedArray = new Uint8Array(
        encryptedText.match(/.{2}/g).map(byte => parseInt(byte, 16))
      );

      const iv = encryptedArray.slice(0, 12);
      const encrypted = encryptedArray.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('解密錯誤:', error);
      return encryptedText; // 如果解密失敗，返回原文
    }
  }

  // 導入加密金鑰
  async importKey() {
    const keyData = new Uint8Array(
      this.encryptionKey.match(/.{2}/g).map(byte => parseInt(byte, 16))
    );

    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // 雜湊密碼
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + this.encryptionKey); // 加鹽
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // 驗證密碼
  async verifyPassword(password, hashedPassword) {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  // 插入記錄
  async insert(tableName, data) {
    try {
      const table = this.getTable(tableName);
      const newId = this.getNextId(table);

      // 加密敏感資料
      const encryptedData = await this.encryptSensitiveData(data);

      const record = {
        id: newId,
        ...encryptedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      table.push(record);
      this.saveTable(tableName, table);

      // 記錄審計日誌
      await this.logAudit(null, 'INSERT', tableName, newId, null, record);

      return { success: true, id: newId, data: record };
    } catch (error) {
      console.error('插入記錄錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 更新記錄
  async update(tableName, id, data) {
    try {
      const table = this.getTable(tableName);
      const recordIndex = table.findIndex(record => record.id === id);

      if (recordIndex === -1) {
        return { success: false, error: '記錄不存在' };
      }

      const oldRecord = { ...table[recordIndex] };

      // 加密敏感資料
      const encryptedData = await this.encryptSensitiveData(data);

      const updatedRecord = {
        ...table[recordIndex],
        ...encryptedData,
        updatedAt: new Date().toISOString()
      };

      table[recordIndex] = updatedRecord;
      this.saveTable(tableName, table);

      // 記錄審計日誌
      await this.logAudit(null, 'UPDATE', tableName, id, oldRecord, updatedRecord);

      return { success: true, data: updatedRecord };
    } catch (error) {
      console.error('更新記錄錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 刪除記錄
  async delete(tableName, id) {
    try {
      const table = this.getTable(tableName);
      const recordIndex = table.findIndex(record => record.id === id);

      if (recordIndex === -1) {
        return { success: false, error: '記錄不存在' };
      }

      const deletedRecord = table[recordIndex];
      table.splice(recordIndex, 1);
      this.saveTable(tableName, table);

      // 記錄審計日誌
      await this.logAudit(null, 'DELETE', tableName, id, deletedRecord, null);

      return { success: true };
    } catch (error) {
      console.error('刪除記錄錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 查詢記錄
  async select(tableName, conditions = {}) {
    try {
      const table = this.getTable(tableName);
      let results = [...table];

      // 應用查詢條件
      Object.keys(conditions).forEach(key => {
        if (conditions[key] !== undefined) {
          results = results.filter(record => record[key] === conditions[key]);
        }
      });

      // 解密敏感資料
      const decryptedResults = await this.decryptSensitiveData(results);

      return { success: true, data: decryptedResults };
    } catch (error) {
      console.error('查詢記錄錯誤:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  // 根據ID查詢單一記錄
  async findById(tableName, id) {
    try {
      const table = this.getTable(tableName);
      const record = table.find(record => record.id === id);

      if (!record) {
        return { success: false, error: '記錄不存在' };
      }

      // 解密敏感資料
      const decryptedRecord = await this.decryptSensitiveData([record]);

      return { success: true, data: decryptedRecord[0] };
    } catch (error) {
      console.error('查詢記錄錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 加密敏感資料
  async encryptSensitiveData(data) {
    const sensitiveFields = ['password', 'phone', 'email', 'fullName', 'studentId'];
    const encryptedData = { ...data };

    for (const field of sensitiveFields) {
      if (encryptedData[field] && typeof encryptedData[field] === 'string') {
        encryptedData[field] = await this.encrypt(encryptedData[field]);
      }
    }

    return encryptedData;
  }

  // 解密敏感資料
  async decryptSensitiveData(records) {
    const sensitiveFields = ['password', 'phone', 'email', 'fullName', 'studentId'];
    const decryptedRecords = [];

    for (const record of records) {
      const decryptedRecord = { ...record };

      for (const field of sensitiveFields) {
        if (decryptedRecord[field] && typeof decryptedRecord[field] === 'string') {
          decryptedRecord[field] = await this.decrypt(decryptedRecord[field]);
        }
      }

      decryptedRecords.push(decryptedRecord);
    }

    return decryptedRecords;
  }

  // 獲取資料表
  getTable(tableName) {
    const tableData = localStorage.getItem(`${this.dbName}_${tableName}`);
    return tableData ? JSON.parse(tableData) : [];
  }

  // 儲存資料表
  saveTable(tableName, table) {
    localStorage.setItem(`${this.dbName}_${tableName}`, JSON.stringify(table));
  }

  // 獲取下一個ID
  getNextId(table) {
    if (table.length === 0) return 1;
    return Math.max(...table.map(record => record.id)) + 1;
  }

  // 記錄審計日誌
  async logAudit(userId, action, tableName, recordId, oldValues, newValues) {
    try {
      const auditLog = {
        userId: userId,
        action: action,
        tableName: tableName,
        recordId: recordId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        createdAt: new Date().toISOString()
      };

      const table = this.getTable('audit_logs');
      table.push(auditLog);
      this.saveTable('audit_logs', table);
    } catch (error) {
      console.error('記錄審計日誌錯誤:', error);
    }
  }

  // 獲取客戶端IP（簡化版本）
  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // 備份資料庫
  async backup() {
    try {
      const backup = {};
      Object.keys(this.tables).forEach(tableName => {
        backup[tableName] = this.getTable(tableName);
      });

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: backup
      };

      return { success: true, data: backupData };
    } catch (error) {
      console.error('備份資料庫錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 還原資料庫
  async restore(backupData) {
    try {
      if (!backupData || !backupData.data) {
        return { success: false, error: '無效的備份資料' };
      }

      Object.keys(backupData.data).forEach(tableName => {
        this.saveTable(tableName, backupData.data[tableName]);
      });

      return { success: true };
    } catch (error) {
      console.error('還原資料庫錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 清理過期資料
  async cleanup() {
    try {
      const now = new Date().toISOString();

      // 清理過期的會話
      const sessions = this.getTable('sessions');
      const activeSessions = sessions.filter(session =>
        new Date(session.expiresAt) > new Date(now)
      );
      this.saveTable('sessions', activeSessions);

      // 清理舊的審計日誌（保留30天）
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const auditLogs = this.getTable('audit_logs');
      const recentLogs = auditLogs.filter(log =>
        new Date(log.createdAt) > new Date(thirtyDaysAgo)
      );
      this.saveTable('audit_logs', recentLogs);

      return { success: true };
    } catch (error) {
      console.error('清理資料庫錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 獲取資料庫統計
  getStats() {
    const stats = {};
    Object.keys(this.tables).forEach(tableName => {
      const table = this.getTable(tableName);
      stats[tableName] = {
        count: table.length,
        lastUpdated: table.length > 0 ?
          Math.max(...table.map(record => new Date(record.updatedAt || record.createdAt).getTime())) : null
      };
    });
    return stats;
  }

  // 清除所有資料（用於測試或重置）
  clearAllData() {
    try {
      console.log('正在清除所有儲存的資料...');

      // 清除所有資料表
      Object.keys(this.tables).forEach(tableName => {
        localStorage.removeItem(`${this.dbName}_${tableName}`);
        console.log(`已清除資料表: ${tableName}`);
      });

      // 重新初始化空的資料表
      this.initializeTables();

      // 清除認證相關的 localStorage
      localStorage.removeItem('auth_token');
      console.log('已清除認證 token');

      // 清除收藏資料
      if (localStorage.getItem('user_favorites')) {
        localStorage.removeItem('user_favorites');
        console.log('已清除收藏資料');
      }

      // 清除書籤資料
      if (localStorage.getItem('user_bookmarks')) {
        localStorage.removeItem('user_bookmarks');
        console.log('已清除書籤資料');
      }

      console.log('✅ 所有資料已成功清除！');
      return {
        success: true,
        message: '所有資料已清除'
      };
    } catch (error) {
      console.error('清除資料錯誤:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 創建全域實例
window.secureDB = new SecureDatabase();

