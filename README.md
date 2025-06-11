# vTaiwan Neo - Vue 版本

這是 vTaiwan Neo 的 Vue 版本，使用 Vue 3 + TypeScript + Vite + Firebase 建構。

## 功能特色

- 🏠 首頁展示
- 📝 部落格系統
- 🔐 Google 登入
- ✍️ 發布文章功能
- 📱 響應式設計
- 🔷 TypeScript 支援

## 技術棧

- Vue 3
- TypeScript
- Vue Router
- Vite
- Tailwind CSS
- Firebase (Auth, Realtime Database)
- Axios

## 安裝與運行

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 建置生產版本：
```bash
npm run build
```

4. 類型檢查：
```bash
npm run type-check
```

## 專案結構

```
src/
├── components/          # Vue 組件
│   ├── Header.vue      # 頁面標題
│   └── GoogleLogin.vue # Google 登入組件
├── views/              # 頁面視圖
│   ├── HomeView.vue    # 首頁
│   ├── BlogsView.vue   # 部落格列表
│   ├── BlogDetailView.vue # 部落格詳情
│   └── PostBlogView.vue   # 發布文章
├── router/             # 路由配置
│   └── index.ts
├── lib/                # 工具函數
│   └── firebase.ts     # Firebase 配置
└── style.css           # 全域樣式
```

## 路由

- `/` - 首頁
- `/blogs` - 部落格列表
- `/blogs/:title` - 部落格詳情（動態路由）
- `/blogs/post_blog` - 發布新文章

## Firebase 配置

專案使用 Firebase 作為後端服務：
- Authentication (Google 登入)
- Realtime Database (部落格資料)
- Storage (檔案儲存)

## 開發注意事項

1. 確保 Firebase 配置正確
2. 動態路由使用 `encodeURIComponent` 處理中文標題
3. 所有 Firebase 操作都有適當的錯誤處理
4. 使用 TypeScript 進行類型檢查
