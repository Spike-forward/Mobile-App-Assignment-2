// 課程資料 - 統一的課程數據
// 這個文件包含所有課程的基本信息
const coursesData = [
  {
    id: 1,
    title: "C++程式語言",
    level: "初級",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    language: "C++",
    category: "程式入門"
  },
  {
    id: 2,
    title: "Java程式設計",
    level: "中級",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/grEKMHGYyns",
    videoUrl: "https://www.youtube.com/embed/grEKMHGYyns",
    language: "Java",
    category: "程式入門"
  },
  {
    id: 3,
    title: "Python程式設計",
    level: "初級",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/kqtD5dpn9C8",
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    language: "Python",
    category: "程式入門"
  },
  {
    id: 4,
    title: "JavaScript前端開發",
    level: "中級",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/9YddVVsdG5A",
    videoUrl: "https://www.youtube.com/embed/9YddVVsdG5A",
    language: "JavaScript",
    category: "網頁開發"
  },
  {
    id: 5,
    title: "資料結構與演算法",
    level: "高級",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/8hly31xKli0",
    videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
    language: "多語言",
    category: "演算法"
  },
  {
    id: 6,
    title: "網頁設計基礎",
    level: "初級",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/kMT54MPz9oE",
    videoUrl: "https://www.youtube.com/embed/kMT54MPz9oE",
    language: "JavaScript",
    category: "網頁開發"
  },
  {
    id: 7,
    title: "資料庫設計",
    level: "中級",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/HXV3zeQKqGY",
    videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
    language: "SQL",
    category: "資料科學"
  },
  {
    id: 8,
    title: "機器學習入門",
    level: "高級",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/aircAruvnKk",
    videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
    language: "Python",
    category: "資料科學"
  },
  {
    id: 9,
    title: "C++程式設計",
    level: "中級",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    language: "C++",
    category: "系統設計"
  },
  {
    id: 10,
    title: "React前端框架",
    level: "中級",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/SqcY0GlETPk",
    videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
    language: "JavaScript",
    category: "網頁開發"
  },
  {
    id: 11,
    title: "Node.js後端開發",
    level: "中級",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/fBNz5xF-Kx4",
    videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4",
    language: "JavaScript",
    category: "網頁開發"
  },
  {
    id: 12,
    title: "演算法進階",
    level: "高級",
    image: "https://images.unsplash.com/photo-1559739819-80ddd5e8115f?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1559739819-80ddd5e8115f?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/oBt53YbR9Kk",
    videoUrl: "https://www.youtube.com/embed/oBt53YbR9Kk",
    language: "多語言",
    category: "演算法"
  },
  {
    id: 13,
    title: "物件導向程式設計",
    level: "中級",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/zOjov-2OZ0E",
    videoUrl: "https://www.youtube.com/embed/zOjov-2OZ0E",
    language: "多語言",
    category: "程式入門"
  },
  {
    id: 14,
    title: "系統設計",
    level: "高級",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/7vZIc6e7COI",
    videoUrl: "https://www.youtube.com/embed/7vZIc6e7COI",
    language: "多語言",
    category: "系統設計"
  },
  {
    id: 15,
    title: "Git版本控制",
    level: "初級",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/SWYqp7iY_Tc",
    videoUrl: "https://www.youtube.com/embed/SWYqp7iY_Tc",
    language: "多語言",
    category: "程式入門"
  },
  {
    id: 16,
    title: "Docker容器技術",
    level: "高級",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/3c-iBn73dDE",
    videoUrl: "https://www.youtube.com/embed/3c-iBn73dDE",
    language: "多語言",
    category: "系統設計"
  },
  {
    id: 17,
    title: "軟體測試",
    level: "中級",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/HBq5R3_bhM8?si=swYkBXAqLE43Nwj7",
    videoUrl: "https://www.youtube.com/embed/HBq5R3_bhM8",
    language: "多語言",
    category: "系統設計"
  },
  {
    id: 18,
    title: "API設計與開發",
    level: "中級",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/-mN3VyJuCjM?si=BVmHP7o8_VXu5ihj",
    videoUrl: "https://www.youtube.com/embed/-mN3VyJuCjM",
    language: "JavaScript",
    category: "網頁開發"
  },
  {
    id: 19,
    title: "資料庫進階",
    level: "高級",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/7S_tz1z_5bA",
    videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
    language: "SQL",
    category: "資料科學"
  },
  {
    id: 20,
    title: "雲端運算基礎",
    level: "中級",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop",
    url: "https://www.youtube.com/embed/RWgW-CgdIk0",
    videoUrl: "https://www.youtube.com/embed/RWgW-CgdIk0",
    language: "多語言",
    category: "系統設計"
  }
];

// 為全域可用性添加 window 物件
if (typeof window !== 'undefined') {
  window.coursesData = coursesData;
}
