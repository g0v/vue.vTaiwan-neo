# vTaiwan Neo - Vue 版本

這是 vTaiwan Neo 的 Vue 版本，使用 Vue 3 + Vite + Tailwind CSS + Firebase 建構。

本專案的後端也是開源的，分為兩個專案：

1. Jisti視訊服務的JWT生成： https://github.com/g0v/vtaiwan-jaas-jwt-worker
2. 音訊轉錄、逐字稿管理與AI大綱整理： https://github.com/g0v/vtaiwan-transcription-worker


## 功能特色

- 🏠 首頁展示（完整複刻原始設計）
- 📝 部落格系統（支援 Markdown 渲染）
- 🔐 Google 登入（全域狀態管理）
- ✍️ 發布文章功能
- 📱 響應式設計
- 🎨 Tailwind CSS 樣式系統
- 🔷 TypeScript 支援
- 📊 專案管理頁面
- 📅 會議管理頁面
- ❓ FAQ 頁面
- 👥 貢獻者頁面
- ℹ️ 關於我們頁面
- 🎥 即時視訊頁面，(支援即時逐字稿共同校對功能，開發中，目前只限英文可以運作)

## 技術棧

- **前端框架**: Vue 3 (Composition API)
- **建置工具**: Vite
- **路由**: Vue Router 4
- **樣式**: Tailwind CSS
- **圖標**: Lucide Vue Next
- **後端服務**: Firebase
  - Authentication (Google 登入)
  - Realtime Database (部落格資料)
- **Markdown 渲染**: Marked
- **語言**: JavaScript / TypeScript

## 安裝與運行

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

3. 類型檢查：
```bash
npm run type-check
```


4. 建置生產版本：
```bash
npm run build
```


5. 預覽生產版本Preview：
```bash
npm run preview
```

## 專案結構

```
src/
├── components/              # Vue 組件
│   ├── Header.vue          # 頁面標題（含導航和登入）
│   ├── Footer.vue          # 頁尾組件
│   ├── IconWrapper.vue     # 圖標包裝組件
│   ├── LanguageSwitcher.vue # 語言切換器
│   ├── NewsCarousel.vue    # 新聞輪播組件
│   └── GoogleLogin.vue     # Google 登入組件
├── views/                  # 頁面視圖
│   ├── HomeView.vue        # 首頁
│   ├── BlogsView.vue       # 部落格列表
│   ├── BlogDetailView.vue  # 部落格詳情（支援 Markdown）
│   ├── PostBlogView.vue    # 發布文章
│   ├── ProjectsView.vue    # 專案列表
│   ├── MeetupsView.vue     # 會議列表
│   ├── FAQView.vue         # 常見問題
│   ├── AboutView.vue       # 關於我們
│   └── ContributorsView.vue # 貢獻者
├── data/                   # 靜態資料檔案
│   ├── projects.ts         # 專案資料
│   ├── meetups.ts          # 會議資料
│   └── faqs.ts             # FAQ 資料
├── router/                 # 路由配置
│   └── index.ts
├── lib/                    # 工具函數
│   └── firebase.ts         # Firebase 配置
├── assets/                 # 靜態資源
│   └── images/             # 圖片資源
└── style.css               # 全域樣式
```

## 路由配置

- `/` - 首頁
- `/blogs` - 部落格列表
- `/blogs/:title` - 部落格詳情（動態路由，支援中文標題）
- `/post_blog` - 發布新文章
- `/projects` - 專案列表
- `/meetups` - 會議列表
- `/faq` - 常見問題
- `/about` - 關於我們
- `/contributors` - 貢獻者

## 靜態資料檔案 (src/data/)

專案使用靜態資料檔案來管理內容，方便協作和維護：

### 📊 `projects.ts`
- **用途**: 管理專案列表資料
- **內容**: 專案標題、描述、狀態、圖標、分類、參與人數
- **協作方式**: 新增專案、修改專案資訊、更新狀態

### 📅 `meetups.ts`
- **用途**: 管理會議資料
- **內容**: 會議標題、日期、時間、地點、描述、相關專案
- **協作方式**: 新增會議、更新會議資訊、管理報名連結

### ❓ `faqs.ts`
- **用途**: 管理常見問題與答案
- **內容**: 問題、答案、詳細說明列表
- **協作方式**: 新增問題、更新答案、補充詳細說明

## 主要組件說明

### Header.vue
- 響應式導航選單
- Google 登入狀態管理
- 語言切換器
- 行動裝置選單

### IconWrapper.vue
- 統一圖標管理
- 支援 Lucide 圖標庫
- 顏色和尺寸自訂

### GoogleLogin.vue
- Google 登入功能
- 用戶資料管理
- 登入狀態同步

## Firebase 配置

專案使用 Firebase 作為後端服務：
- **Authentication**: Google 登入
- **Realtime Database**: 部落格文章儲存
- **資料結構**:
  ```
  /blogs/{id}
    - title: 標題
    - content: 內容 (Markdown)
    - author: 作者
    - date: 日期
    - tags: 標籤陣列
  ```

## 開發注意事項

1. **Firebase 配置**: 確保 `.env` 檔案包含正確的 Firebase 配置
2. **中文標題處理**: 動態路由使用 `encodeURIComponent` 處理中文標題
3. **Markdown 支援**: 使用 `marked` 套件渲染部落格內容
4. **響應式設計**: 所有頁面都支援行動裝置和桌面版
5. **圖標管理**: 統一使用 `IconWrapper` 組件管理圖標
6. **靜態資料**: 新增內容時優先使用 `src/data/` 中的靜態檔案

## 協作指南

### 新增專案
1. 編輯 `src/data/projects.ts`
2. 在 `projects` 陣列中新增專案資料
3. 確保圖標名稱在 Lucide 圖標庫中存在

### 新增會議
1. 編輯 `src/data/meetups.ts`
2. 在 `meetups` 陣列中新增會議資料
3. 設定正確的日期格式 (YYYY-MM-DD)

### 新增 FAQ
1. 編輯 `src/data/faqs.ts`
2. 在 `faqs` 陣列中新增問題和答案
3. 可選的 `details` 陣列用於詳細說明

### 樣式修改
- 使用 Tailwind CSS 類別
- 自訂樣式放在組件的 `<style>` 區塊
- 全域樣式修改 `src/style.css`

## 部署

1. 建置專案：
```bash
npm run build
```

2. 部署到 Firebase Hosting：
```bash
firebase deploy
```

---

# vTaiwan Neo - Vue Version

This is the Vue version of vTaiwan Neo, built with Vue 3 + Vite + Tailwind CSS + Firebase.

The backend of this project is also open source and consists of two projects:

1. JWT generation for Jitsi video service: https://github.com/g0v/vtaiwan-jaas-jwt-worker
2. Audio transcription, transcript management, and AI outline generation: https://github.com/g0v/vtaiwan-transcription-worker

## Features

- 🏠 Homepage display (complete replica of original design)
- 📝 Blog system (Markdown rendering support)
- 🔐 Google login (global state management)
- ✍️ Post articles functionality
- 📱 Responsive design
- 🎨 Tailwind CSS styling system
- 🔷 TypeScript support
- 📊 Project management page
- 📅 Meeting management page
- ❓ FAQ page
- 👥 Contributors page
- ℹ️ About Us page
- 🎥 Live video page (supports real-time transcript collaborative editing, in development, currently only works with English)

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **Backend Service**: Firebase
  - Authentication (Google login)
  - Realtime Database (blog data)
- **Markdown Rendering**: Marked
- **Languages**: JavaScript / TypeScript

## Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Type checking:
```bash
npm run type-check
```

4. Build production version:
```bash
npm run build
```

5. Preview production version:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/              # Vue components
│   ├── Header.vue          # Page header (navigation and login)
│   ├── Footer.vue          # Footer component
│   ├── IconWrapper.vue     # Icon wrapper component
│   ├── LanguageSwitcher.vue # Language switcher
│   ├── NewsCarousel.vue    # News carousel component
│   └── GoogleLogin.vue     # Google login component
├── views/                  # Page views
│   ├── HomeView.vue        # Homepage
│   ├── BlogsView.vue       # Blog list
│   ├── BlogDetailView.vue  # Blog detail (Markdown support)
│   ├── PostBlogView.vue    # Post article
│   ├── ProjectsView.vue    # Project list
│   ├── MeetupsView.vue     # Meeting list
│   ├── FAQView.vue         # FAQ
│   ├── AboutView.vue       # About Us
│   └── ContributorsView.vue # Contributors
├── data/                   # Static data files
│   ├── projects.ts         # Project data
│   ├── meetups.ts          # Meeting data
│   └── faqs.ts             # FAQ data
├── router/                 # Route configuration
│   └── index.ts
├── lib/                    # Utility functions
│   └── firebase.ts         # Firebase configuration
├── assets/                 # Static resources
│   └── images/             # Image resources
└── style.css               # Global styles
```

## Route Configuration

- `/` - Homepage
- `/blogs` - Blog list
- `/blogs/:title` - Blog detail (dynamic route, supports Chinese titles)
- `/post_blog` - Post new article
- `/projects` - Project list
- `/meetups` - Meeting list
- `/faq` - FAQ
- `/about` - About Us
- `/contributors` - Contributors

## Static Data Files (src/data/)

The project uses static data files to manage content, making collaboration and maintenance easier:

### 📊 `projects.ts`
- **Purpose**: Manage project list data
- **Content**: Project title, description, status, icon, category, participant count
- **Collaboration**: Add projects, modify project information, update status

### 📅 `meetups.ts`
- **Purpose**: Manage meeting data
- **Content**: Meeting title, date, time, location, description, related projects
- **Collaboration**: Add meetings, update meeting information, manage registration links

### ❓ `faqs.ts`
- **Purpose**: Manage frequently asked questions and answers
- **Content**: Questions, answers, detailed explanation lists
- **Collaboration**: Add questions, update answers, supplement detailed explanations

## Component Descriptions

### Header.vue
- Responsive navigation menu
- Google login state management
- Language switcher
- Mobile menu

### IconWrapper.vue
- Unified icon management
- Supports Lucide icon library
- Customizable colors and sizes

### GoogleLogin.vue
- Google login functionality
- User data management
- Login state synchronization

## Firebase Configuration

The project uses Firebase as backend service:
- **Authentication**: Google login
- **Realtime Database**: Blog article storage
- **Data Structure**:
  ```
  /blogs/{id}
    - title: Title
    - content: Content (Markdown)
    - author: Author
    - date: Date
    - tags: Tags array
  ```

## Development Notes

1. **Firebase Configuration**: Ensure `.env` file contains correct Firebase configuration
2. **Chinese Title Handling**: Dynamic routes use `encodeURIComponent` to handle Chinese titles
3. **Markdown Support**: Uses `marked` package to render blog content
4. **Responsive Design**: All pages support mobile and desktop versions
5. **Icon Management**: Use `IconWrapper` component uniformly for icon management
6. **Static Data**: Prioritize using static files in `src/data/` when adding content

## Collaboration Guide

### Adding Projects
1. Edit `src/data/projects.ts`
2. Add project data to the `projects` array
3. Ensure icon names exist in the Lucide icon library

### Adding Meetings
1. Edit `src/data/meetups.ts`
2. Add meeting data to the `meetups` array
3. Set correct date format (YYYY-MM-DD)

### Adding FAQ
1. Edit `src/data/faqs.ts`
2. Add questions and answers to the `faqs` array
3. Optional `details` array for detailed explanations

### Style Modifications
- Use Tailwind CSS classes
- Custom styles in component `<style>` blocks
- Global styles modify `src/style.css`

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase Hosting:
```bash
firebase deploy
```
