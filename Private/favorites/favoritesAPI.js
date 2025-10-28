// 收藏功能 API 模組
class FavoritesAPI {
  constructor() {
    this.favorites = this.loadFavorites();
  }

  // 載入收藏資料
  loadFavorites() {
    const stored = localStorage.getItem('user_favorites');
    return stored ? JSON.parse(stored) : {};
  }

  // 儲存收藏資料
  saveFavorites() {
    localStorage.setItem('user_favorites', JSON.stringify(this.favorites));
  }

  // 添加收藏項目
  addFavorite(userId, courseId) {
    try {
      if (!this.favorites[userId]) {
        this.favorites[userId] = [];
      }

      // 檢查是否已經收藏
      if (this.favorites[userId].includes(courseId)) {
        throw new Error('課程已經在收藏清單中');
      }

      this.favorites[userId].push(courseId);
      this.saveFavorites();

      return {
        success: true,
        message: '已添加到收藏清單',
        favorites: this.favorites[userId]
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // 移除收藏項目
  removeFavorite(userId, courseId) {
    try {
      if (!this.favorites[userId]) {
        this.favorites[userId] = [];
      }

      const index = this.favorites[userId].indexOf(courseId);
      if (index === -1) {
        throw new Error('課程不在收藏清單中');
      }

      this.favorites[userId].splice(index, 1);
      this.saveFavorites();

      return {
        success: true,
        message: '已從收藏清單移除',
        favorites: this.favorites[userId]
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // 切換收藏狀態
  toggleFavorite(userId, courseId) {
    if (this.isFavorite(userId, courseId)) {
      return this.removeFavorite(userId, courseId);
    } else {
      return this.addFavorite(userId, courseId);
    }
  }

  // 檢查是否已收藏
  isFavorite(userId, courseId) {
    if (!this.favorites[userId]) {
      return false;
    }
    return this.favorites[userId].includes(courseId);
  }

  // 獲取使用者的收藏清單
  getUserFavorites(userId) {
    return this.favorites[userId] || [];
  }

  // 獲取收藏的課程詳細資料
  getFavoriteCourses(userId, coursesData) {
    const favoriteIds = this.getUserFavorites(userId);
    return coursesData.filter(course => favoriteIds.includes(course.id));
  }

  // 清空使用者的所有收藏
  clearUserFavorites(userId) {
    this.favorites[userId] = [];
    this.saveFavorites();
    return {
      success: true,
      message: '已清空所有收藏項目'
    };
  }

  // 獲取收藏統計
  getFavoritesStats(userId) {
    const userFavorites = this.getUserFavorites(userId);
    return {
      totalFavorites: userFavorites.length,
      favorites: userFavorites
    };
  }

  // 批量添加收藏
  addMultipleFavorites(userId, courseIds) {
    try {
      if (!this.favorites[userId]) {
        this.favorites[userId] = [];
      }

      const newFavorites = courseIds.filter(courseId =>
        !this.favorites[userId].includes(courseId)
      );

      this.favorites[userId] = [...this.favorites[userId], ...newFavorites];
      this.saveFavorites();

      return {
        success: true,
        message: `已添加 ${newFavorites.length} 個收藏項目`,
        addedCount: newFavorites.length,
        favorites: this.favorites[userId]
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // 從註冊時的課程選擇同步收藏
  syncFromRegistration(userId, interestedCourses) {
    try {
      if (!interestedCourses || interestedCourses.length === 0) {
        return {
          success: true,
          message: '沒有課程需要同步',
          favorites: this.getUserFavorites(userId)
        };
      }

      // 如果 interestedCourses 是課程標題的數組，需要轉換為課程 ID
      let courseIds = interestedCourses;

      // 檢查是否為課程標題，如果是則轉換為 ID
      if (typeof interestedCourses[0] === 'string' && interestedCourses[0].length > 0) {
        // 嘗試從課程標題獲取課程 ID
        if (window.coursesData && window.coursesData.length > 0) {
          courseIds = interestedCourses
            .map(title => {
              const course = window.coursesData.find(c => c.title === title);
              return course ? course.id : null;
            })
            .filter(id => id !== null && id !== undefined);

          console.log('轉換課程標題為 ID:', interestedCourses, '→', courseIds);
        }
      }

      if (courseIds.length === 0) {
        return {
          success: false,
          message: '無法將課程標題轉換為 ID',
          favorites: this.getUserFavorites(userId)
        };
      }

      // 將課程添加到收藏
      const result = this.addMultipleFavorites(userId, courseIds);

      return {
        success: result.success,
        message: result.success ? `已同步 ${result.addedCount || 0} 個課程到收藏清單` : result.message,
        favorites: this.favorites[userId],
        addedCount: result.addedCount || 0
      };
    } catch (error) {
      console.error('同步收藏時發生錯誤:', error);
      return {
        success: false,
        message: error.message || '同步失敗'
      };
    }
  }
}

// 創建全域實例
window.favoritesAPI = new FavoritesAPI();

