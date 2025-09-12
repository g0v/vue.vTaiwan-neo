# vTaiwan 圖片爬蟲

這個爬蟲程式會自動從 [vTaiwan 議題頁面](https://www.vtaiwan.tw/topics) 下載所有議題的背景圖片。

## 功能特色

- 🚀 使用 Puppeteer 自動化瀏覽器操作
- ⏳ 等待 20 秒確保所有資料完全載入
- 🖼️ 自動偵測並下載所有 `background-image` 圖片
- 📁 自動處理檔案名稱，移除特殊字符
- 🔄 跳過已存在的檔案，避免重複下載
- 📊 提供詳細的下載進度資訊

## 安裝與使用

### 1. 安裝依賴

```bash
cd crawler
npm install
```

### 2. 執行爬蟲

```bash
npm start
# 或
node crawler.js
```

## 程式說明

### 主要功能

1. **啟動瀏覽器**: 使用 Puppeteer 啟動無頭瀏覽器
2. **載入頁面**: 訪問 vTaiwan 議題頁面
3. **等待渲染**: 等待 20 秒確保所有動態內容載入完成
4. **偵測圖片**: 掃描頁面中所有元素的 `background-image` 樣式
5. **下載圖片**: 將找到的圖片下載到 `public/cover` 目錄
6. **檔案處理**: 自動處理檔案名稱，移除特殊字符

### 檔案命名規則

- 從 URL 中提取原始檔案名稱
- 移除查詢參數 (`?raw=true` 等)
- 解碼 URL 編碼字符
- 將特殊字符替換為下劃線

例如：
- `https://github.com/Jia-wei-cui/vTaiwan-Issue-Meetup2/blob/main/1200x1200_vTaiwan%20社群發文TWNIC.jpg?raw=true`
- 下載為：`1200x1200_vTaiwan_社群發文TWNIC.jpg`

### 錯誤處理

- 自動跳過已存在的檔案
- 處理下載失敗的情況
- 提供詳細的錯誤訊息
- 確保瀏覽器正確關閉

## 目錄結構

```
crawler/
├── crawler.js      # 主要爬蟲程式
├── package.json    # 專案配置檔案
└── README.md       # 使用說明文件

public/cover/       # 圖片下載目錄
├── 2025_AI_Free_Speech.png
└── ...
```

## 注意事項

- 請確保網路連線穩定
- 下載過程可能需要一些時間，請耐心等待
- 程式會自動跳過已下載的檔案
- 建議在網路狀況良好時執行
- 圖片會下載到 `public/cover` 目錄

## 技術細節

- **Puppeteer**: 用於自動化瀏覽器操作
- **Node.js**: 內建的 `https` 和 `http` 模組用於下載檔案
- **檔案系統**: 使用 `fs` 模組處理檔案操作
- **路徑處理**: 使用 `path` 模組處理檔案路徑
