/**
 * 清除所有儲存資料的工具函數
 * 可以在瀏覽器控制台中使用
 */

// 清除所有資料的主函數
window.clearAllStoredData = function () {
  try {
    console.log('🧹 開始清除所有儲存的資料...');

    let clearedItems = [];

    // 1. 清除所有資料表 (使用 secureDB 的表結構)
    const tables = ['users', 'sessions', 'favorites', 'audit_logs'];
    tables.forEach(tableName => {
      const key = `programming_platform_db_${tableName}`;
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        clearedItems.push(`資料表: ${tableName}`);
        console.log(`  ✅ 已清除: ${key}`);
      }
    });

    // 2. 清除認證相關資料
    if (localStorage.getItem('auth_token')) {
      localStorage.removeItem('auth_token');
      clearedItems.push('認證 token');
      console.log('  ✅ 已清除: auth_token');
    }

    // 3. 清除收藏資料
    if (localStorage.getItem('user_favorites')) {
      localStorage.removeItem('user_favorites');
      clearedItems.push('收藏資料');
      console.log('  ✅ 已清除: user_favorites');
    }

    // 4. 清除書籤資料
    if (localStorage.getItem('user_bookmarks')) {
      localStorage.removeItem('user_bookmarks');
      clearedItems.push('書籤資料');
      console.log('  ✅ 已清除: user_bookmarks');
    }

    // 5. 清除加密金鑰（可選）
    if (localStorage.getItem('db_encryption_key')) {
      localStorage.removeItem('db_encryption_key');
      clearedItems.push('加密金鑰');
      console.log('  ✅ 已清除: db_encryption_key');
    }

    // 6. 清除所有 session manager 資料
    if (window.sessionManager) {
      window.sessionManager.clearSession();
      console.log('  ✅ 已清除: session manager');
    }

    // 7. 清除所有以 db_ 開頭的 localStorage 項目
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('programming_platform_db_')) {
        localStorage.removeItem(key);
        console.log(`  ✅ 已清除: ${key}`);
      }
    });

    // 重新初始化 empty tables if secureDB exists
    if (window.secureDB) {
      window.secureDB.initializeTables();
      console.log('  ✅ 已重新初始化資料表');
    }

    console.log(`\n✅ 成功清除 ${clearedItems.length} 項資料！`);
    console.log('清除的項目：', clearedItems);

    return {
      success: true,
      clearedCount: clearedItems.length,
      clearedItems: clearedItems
    };

  } catch (error) {
    console.error('❌ 清除資料時發生錯誤:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 顯示當前儲存的資料統計
window.showDataStats = function () {
  try {
    console.log('\n📊 當前儲存的資料統計：\n');

    // 檢查各資料表
    const tables = ['users', 'sessions', 'favorites', 'audit_logs'];
    let totalRecords = 0;

    tables.forEach(tableName => {
      const key = `programming_platform_db_${tableName}`;
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          const count = Array.isArray(parsed) ? parsed.length : 0;
          totalRecords += count;
          console.log(`  ${tableName}: ${count} 筆記錄`);
        } catch (e) {
          console.log(`  ${tableName}: 無法解析資料`);
        }
      } else {
        console.log(`  ${tableName}: 無資料`);
      }
    });

    // 檢查認證狀態
    const authToken = localStorage.getItem('auth_token');
    console.log(`  認證狀態: ${authToken ? '已登入' : '未登入'}`);

    // 檢查收藏
    const favorites = localStorage.getItem('user_favorites');
    if (favorites) {
      try {
        const parsed = JSON.parse(favorites);
        const totalFavorites = Object.values(parsed).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        console.log(`  收藏項目: ${totalFavorites} 筆`);
      } catch (e) {
        console.log(`  收藏項目: 有資料但無法解析`);
      }
    } else {
      console.log(`  收藏項目: 無資料`);
    }

    console.log(`\n📈 總計: ${totalRecords} 筆記錄`);

    return {
      totalRecords: totalRecords,
      hasAuth: !!authToken
    };

  } catch (error) {
    console.error('❌ 讀取統計時發生錯誤:', error);
    return null;
  }
};

// 快速清除並重新載入頁面
window.quickClearAndReload = function () {
  const confirmed = confirm('確定要清除所有資料並重新載入頁面嗎？');
  if (confirmed) {
    window.clearAllStoredData();
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
};

// 清除特定使用者的資料
window.clearUserData = function (userId) {
  try {
    if (!userId) {
      console.error('請提供使用者 ID');
      return { success: false, error: '請提供使用者 ID' };
    }

    console.log(`🧹 清除使用者 ${userId} 的資料...`);

    // 清除使用者會話
    const sessionsKey = 'programming_platform_db_sessions';
    const sessions = localStorage.getItem(sessionsKey);
    if (sessions) {
      try {
        const parsed = JSON.parse(sessions);
        const filtered = parsed.filter(s => s.userId !== parseInt(userId));
        localStorage.setItem(sessionsKey, JSON.stringify(filtered));
        console.log('  ✅ 已清除使用者會話');
      } catch (e) {
        console.error('無法解析會話資料');
      }
    }

    // 清除使用者收藏
    const favoritesKey = 'user_favorites';
    const favorites = localStorage.getItem(favoritesKey);
    if (favorites) {
      try {
        const parsed = JSON.parse(favorites);
        delete parsed[userId];
        localStorage.setItem(favoritesKey, JSON.stringify(parsed));
        console.log('  ✅ 已清除使用者收藏');
      } catch (e) {
        console.error('無法解析收藏資料');
      }
    }

    console.log(`✅ 使用者 ${userId} 的資料已清除`);
    return { success: true };

  } catch (error) {
    console.error('❌ 清除使用者資料時發生錯誤:', error);
    return { success: false, error: error.message };
  }
};

// 顯示使用說明
window.showClearDataHelp = function () {
  console.log(`
🧹 清除資料工具使用說明：

1. 清除所有資料：
   clearAllStoredData()
   或
   window.clearAllStoredData()

2. 查看資料統計：
   showDataStats()
   或
   window.showDataStats()

3. 快速清除並重新載入：
   quickClearAndReload()

4. 清除特定使用者資料：
   clearUserData('123')

5. 顯示此說明：
   showClearDataHelp()
   或
   window.showClearDataHelp()

⚠️  注意：清除後無法復原，請謹慎使用！
    `);
};

// 自動顯示說明（如果直接載入此腳本）
if (typeof window !== 'undefined' && window.console) {
  console.log('✅ 清除資料工具已載入！');
  console.log('💡 輸入 showClearDataHelp() 查看使用說明');
}

