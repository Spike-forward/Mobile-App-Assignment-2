// 課程資料介面定義 - 使用更廣泛的瀏覽器兼容性
interface Course {
  title: string;           // 課程名稱
  language: string;        // 程式語言
  level: string;          // 程度
  details: string;        // 重點
  category: string;       // 分類
  tags: string[];         // 標籤陣列
  imageUrl: string;       // 課程封面
  videoUrl: string;       // 教學影片
}

// 為了更好的瀏覽器兼容性，定義全域類型
export { };

declare global {
  interface Window {
    CourseData: {
      courses: Course[];
      searchCourses: (searchTerm: string, category?: string) => Course[];
      getAllCategories: () => string[];
      getAllLanguages: () => string[];
    };
  }
  // （已移除 Node.js 模組相容宣告，避免變數重複與型別衝突）
}

// 程式開發課程資料
export const courses: Course[] = [
  {
    title: 'Python 基礎入門',
    language: 'Python 3',
    level: '入門',
    details: '從零開始學習 Python 程式設計，包含變數、流程控制、函式等基礎概念。',
    category: '程式入門',
    tags: ['Python', '程式設計', '入門課程'],
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8'
  },
  {
    title: 'JavaScript 進階技巧',
    language: 'JavaScript',
    level: '進階',
    details: '深入學習 ES6+ 語法、非同步程式設計、模組化開發等高階概念。',
    category: '網頁開發',
    tags: ['JavaScript', 'ES6', '非同步'],
    imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/9YddVVsdG5A'
  },
  {
    title: 'React 完整開發指南',
    language: 'JavaScript',
    level: '中級',
    details: '學習 React 框架，包含 Hooks、狀態管理、路由等現代前端開發技術。',
    category: '網頁開發',
    tags: ['React', '前端框架', 'Hooks'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk'
  },
  {
    title: 'Vue.js 實戰專案',
    language: 'JavaScript',
    level: '中級',
    details: '透過實際專案學習 Vue.js，包含組件設計、狀態管理和部署。',
    category: '網頁開發',
    tags: ['Vue.js', '前端框架', '實戰專案'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/qZXt1Aom3Cs'
  },
  {
    title: 'Node.js 後端開發',
    language: 'JavaScript',
    level: '中級',
    details: '使用 Node.js 建立 RESTful API，學習 Express、資料庫整合等後端技術。',
    category: '網頁開發',
    tags: ['Node.js', '後端開發', 'API'],
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4'
  },
  {
    title: 'Python 資料分析',
    language: 'Python',
    level: '中級',
    details: '使用 Pandas、NumPy 進行資料處理與分析，學習資料視覺化技巧。',
    category: '資料科學',
    tags: ['Python', '資料分析', 'Pandas'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/gtjxAH8uaP0'
  },
  {
    title: '機器學習基礎',
    language: 'Python',
    level: '中級',
    details: '學習機器學習演算法，使用 Scikit-learn 實作分類、回歸等模型。',
    category: '資料科學',
    tags: ['機器學習', 'Python', 'Scikit-learn'],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk'
  },
  {
    title: '深度學習入門',
    language: 'Python',
    level: '進階',
    details: '使用 TensorFlow 和 PyTorch 學習神經網路、卷積網路等深度學習技術。',
    category: '資料科學',
    tags: ['深度學習', 'TensorFlow', 'PyTorch'],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk'
  },
  {
    title: 'Java 物件導向程式設計',
    language: 'Java',
    level: '中級',
    details: '深入學習 Java 的物件導向概念，包含繼承、多型、封裝等核心原則。',
    category: '程式入門',
    tags: ['Java', '物件導向', '程式設計'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/grEKMHGYyns'
  },
  {
    title: 'C++ 系統程式設計',
    language: 'C++',
    level: '進階',
    details: '學習 C++ 記憶體管理、指標操作、系統程式設計等低階程式設計技巧。',
    category: '系統設計',
    tags: ['C++', '系統程式設計', '記憶體管理'],
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y'
  },
  {
    title: 'Swift iOS 開發',
    language: 'Swift',
    level: '中級',
    details: '使用 Swift 開發 iOS 應用程式，學習 UIKit、SwiftUI 等框架。',
    category: '行動開發',
    tags: ['Swift', 'iOS', '行動開發'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/09TeUXjzpKs'
  },
  {
    title: 'Kotlin Android 開發',
    language: 'Kotlin',
    level: '中級',
    details: '使用 Kotlin 開發 Android 應用程式，學習現代 Android 開發技術。',
    category: '行動開發',
    tags: ['Kotlin', 'Android', '行動開發'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/F9UC9DY-vIU'
  },
  {
    title: 'Flutter 跨平台開發',
    language: 'Dart',
    level: '中級',
    details: '使用 Flutter 開發跨平台行動應用程式，一套程式碼多平台運行。',
    category: '行動開發',
    tags: ['Flutter', 'Dart', '跨平台'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/1gD_H4rT1hI'
  },
  {
    title: '資料結構與演算法',
    language: '多語言',
    level: '中級',
    details: '學習基本資料結構如陣列、鏈結串列、樹、圖，以及常用演算法。',
    category: '演算法',
    tags: ['資料結構', '演算法', '程式設計'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/8hly31xKli0'
  },
  {
    title: '動態規劃演算法',
    language: '多語言',
    level: '進階',
    details: '深入學習動態規劃演算法，解決複雜的優化問題。',
    category: '演算法',
    tags: ['動態規劃', '演算法', '優化'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/oBt53YbR9Kk'
  },
  {
    title: '圖論演算法',
    language: '多語言',
    level: '進階',
    details: '學習圖論相關演算法，包含最短路徑、最小生成樹等。',
    category: '演算法',
    tags: ['圖論', '演算法', '最短路徑'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/09_LlHjoEiY'
  },
  {
    title: '微服務架構設計',
    language: '多語言',
    level: '進階',
    details: '學習微服務架構設計原則，包含服務拆分、API 設計、容器化部署。',
    category: '系統設計',
    tags: ['微服務', '架構設計', '容器化'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/1qk1_9HZkto'
  },
  {
    title: '分散式系統設計',
    language: '多語言',
    level: '進階',
    details: '學習分散式系統的核心概念，包含一致性、可用性、容錯等。',
    category: '系統設計',
    tags: ['分散式系統', '系統設計', '容錯'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/xA5xN4vJ50Y'
  },
  {
    title: 'Go 語言實戰',
    language: 'Go',
    level: '中級',
    details: '學習 Go 語言的特性，包含並發程式設計、微服務開發等。',
    category: '系統設計',
    tags: ['Go', '並發程式設計', '微服務'],
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU'
  },
  {
    title: 'Rust 系統程式設計',
    language: 'Rust',
    level: '進階',
    details: '學習 Rust 語言的安全性和效能特性，進行系統程式設計。',
    category: '系統設計',
    tags: ['Rust', '系統程式設計', '記憶體安全'],
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/5C_HPTJg5ek'
  },
  {
    title: 'TypeScript 進階開發',
    language: 'TypeScript',
    level: '中級',
    details: '深入學習 TypeScript 的型別系統、泛型、裝飾器等進階特性，提升程式碼品質。',
    category: '網頁開發',
    tags: ['TypeScript', '型別系統', '泛型'],
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs'
  }
];

// 課程等級類型定義
export type CourseLevel = '入門' | '中級' | '進階';

// 課程分類類型定義
export type CourseCategory = '程式入門' | '網頁開發' | '資料科學' | '行動開發' | '系統設計' | '演算法';

// 搜尋和篩選功能相關的類型
export interface SearchFilters {
  searchTerm: string;
  category: string;
}

// 匯出課程資料相關的輔助函數
export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(course => course.category === category);
}

export function getCoursesByLevel(level: CourseLevel): Course[] {
  return courses.filter(course => course.level === level);
}

export function searchCourses(searchTerm: string, category: string = ''): Course[] {
  const filtered = courses.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !category || course.category === category;
    
    return matchesSearch && matchesCategory;
  });

  return filtered;
}

export function getAllCategories(): string[] {
  const categories = [...new Set(courses.map(course => course.category))];
  return categories.sort();
}

export function getAllLanguages(): string[] {
  const languages = [...new Set(courses.map(course => course.language))];
  return languages.sort();
}

// 為了更好的瀏覽器兼容性，提供全域物件
// 這樣可以在沒有模組支援的舊瀏覽器中使用
if (typeof window !== 'undefined') {
  window.CourseData = {
    courses: courses,
    searchCourses: searchCourses,
    getAllCategories: getAllCategories,
    getAllLanguages: getAllLanguages
  };
}
