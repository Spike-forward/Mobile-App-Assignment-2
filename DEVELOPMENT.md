# 開發指南

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 開發模式
```bash
npm run dev
```
這會啟動：
- TypeScript 編譯監聽模式
- Live Server (http://localhost:3000)

### 3. 生產構建
```bash
npm run build
```

## 🛠️ 開發工具

### Visual Studio Code
推薦安裝以下擴展：
- TypeScript Importer
- ESLint
- Prettier
- Live Server
- Auto Rename Tag

### 瀏覽器開發工具
- **Chrome DevTools**: 用於調試和性能分析
- **Network 面板**: 監控 API 請求
- **Console**: 查看日誌和錯誤

### API 測試
使用 **Insomnia** 測試 API 端點：
- 用戶註冊/登入
- 課程管理
- 收藏功能

## 📁 專案結構

```
Mobile-App-Assignment-2/
├── Private/                 # 私有模組
│   ├── auth/               # 認證相關
│   ├── data/               # 數據模組
│   ├── database/           # 數據庫操作
│   └── favorites/          # 收藏功能
├── Public/                 # 公開頁面
│   ├── *.html             # 頁面文件
│   └── index.css          # 樣式文件
├── dist/                   # 構建輸出
├── .vscode/               # VS Code 配置
├── tsconfig.json          # TypeScript 配置
├── build.js               # 構建腳本
└── package.json           # 專案配置
```

## 🔧 開發命令

```bash
# 開發模式（監聽文件變化）
npm run watch

# 生產構建
npm run build

# 清理構建目錄
npm run clean

# 類型檢查
npm run type-check

# 代碼檢查
npm run lint

# 代碼格式化
npm run format

# 啟動開發服務器
npm start

# 啟動本地服務器 (localhost:3000)
npm run server
```

## 📝 代碼風格

### TypeScript 規範
- 使用嚴格的 TypeScript 配置
- 明確的類型定義
- 避免使用 `any` 類型
- 使用 ES6+ 語法

### 命名規範
- 文件名：kebab-case (例：user-repository.ts)
- 類名：PascalCase (例：UserRepository)
- 函數/變量：camelCase (例：getUserData)
- 常量：UPPER_SNAKE_CASE (例：API_BASE_URL)

### 文件組織
- 每個類一個文件
- 相關功能放在同一目錄
- 使用 index.ts 作為模組入口

## 🧪 測試策略

### API 測試
使用 Insomnia 創建測試集合：
1. 用戶註冊測試
2. 用戶登入測試
3. 課程獲取測試
4. 收藏功能測試

### 瀏覽器測試
- Chrome DevTools 調試
- 網路面板監控
- 控制台錯誤檢查

## 🚀 部署

### 本地部署
```bash
npm run build
npm start
```

### 生產環境
1. 構建專案：`npm run build`
2. 將 `dist/` 目錄部署到 Web 服務器
3. 配置 HTTPS 和域名

## 📚 技術棧

- **前端**: HTML5, CSS3, JavaScript ES6+
- **框架**: Ionic (UI 組件)
- **語言**: TypeScript
- **構建工具**: esbuild
- **開發服務器**: live-server
- **代碼品質**: ESLint, Prettier

## 🔍 調試技巧

### 1. 控制台調試
```javascript
// 分組日誌
console.group('API Debug');
console.log('Request:', requestData);
console.log('Response:', responseData);
console.groupEnd();

// 錯誤追蹤
try {
  // 代碼
} catch (error) {
  console.error('Error details:', error);
  console.trace(); // 顯示調用堆棧
}
```

### 2. 網路調試
- 打開 DevTools Network 面板
- 勾選 "Preserve log"
- 監控 API 請求狀態和響應時間

### 3. TypeScript 調試
- 使用 `// @ts-ignore` 臨時忽略類型錯誤
- 利用 VS Code 的 TypeScript 智能提示
- 檢查 `tsconfig.json` 配置

## 📖 最佳實踐

1. **模組化開發**: 將功能拆分為獨立模組
2. **錯誤處理**: 完善的 try-catch 和用戶友好的錯誤訊息
3. **性能優化**: 使用懶加載和代碼分割
4. **安全性**: 輸入驗證和 XSS 防護
5. **可維護性**: 清晰的代碼結構和註釋

## 🆘 常見問題

### Q: TypeScript 編譯錯誤
A: 檢查 `tsconfig.json` 配置，確保所有依賴正確安裝

### Q: 模組導入錯誤
A: 檢查文件路徑和模組導出語法

### Q: 瀏覽器兼容性問題
A: 使用 Babel 轉譯或檢查目標瀏覽器支持

### Q: API 請求失敗
A: 檢查網路連接和 API 端點配置
