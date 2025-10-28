// 初始化課程資料並設置全域物件
// 這個文件確保課程資料可以在不同的頁面中正確載入

console.log('正在載入課程資料...');

// 等待 courseData.ts 載入完成
if (typeof window !== 'undefined' && window.CourseData) {
  console.log('課程資料已載入:', window.CourseData.courses.length, '個課程');
} else {
  console.warn('CourseData 尚未載入，將在稍後檢查');

  // 設置檢查機制
  let attempts = 0;
  const maxAttempts = 10;

  const checkCourseData = setInterval(() => {
    attempts++;

    if (window.CourseData && window.CourseData.courses) {
      console.log('課程資料已載入:', window.CourseData.courses.length, '個課程');
      clearInterval(checkCourseData);
    } else if (attempts >= maxAttempts) {
      console.error('無法載入課程資料，已重試', maxAttempts, '次');
      clearInterval(checkCourseData);
    }
  }, 100);
}

