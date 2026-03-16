# vTaiwan Neo - Vue 版本

vTaiwan Neo 的 Vue 版，使用 Vue 3 + Vite + Tailwind CSS + Firebase。後端開源： [Jitsi JWT](https://github.com/g0v/vtaiwan-jaas-jwt-worker) · [轉錄與 AI 大綱](https://github.com/g0v/vtaiwan-transcription-worker)

## 安裝與運行

若尚未安裝 Node.js，請先至 [nodejs.org](https://nodejs.org/) 下載安裝（建議選 LTS 版本）。

```bash
npm install
npm run dev
```

瀏覽器開啟終端顯示的網址即可預覽。其餘指令：`npm run type-check`（類型檢查）、`npm run build`（建置）、`npm run preview`（預覽建置結果）。

---

## 如何維護內容（改檔案）

**不用改程式碼**，只要編輯 `src/data/` 底下的檔案，存檔後重整頁面即可看到變更。

| 要改的內容     | 編輯檔案               | 說明 |
|----------------|------------------------|------|
| 專案列表       | `src/data/projects.ts` | 在 `projects` 陣列新增/修改，圖標名需為 [Lucide](https://lucide.dev/) 有的名稱 |
| 常見問題 FAQ   | `src/data/faqs.ts`     | 在 `faqs` 陣列新增/修改問題與答案 |

樣式想微調：用 Tailwind 類別或改組件內 `<style>`；全站樣式改 `src/style.css`。

---

## 功能與技術摘要

- 首頁、部落格（Markdown）、Google 登入、發布文章、專案/會議/FAQ/貢獻者/關於我們、即時視訊（逐字稿校對，開發中、暫限英文）
- 技術：Vue 3、Vite、Vue Router、Tailwind、Lucide 圖標、Firebase（登入 + Realtime Database）、Marked 渲染 Markdown

## 專案結構（與維護相關）

- `src/views/` — 各頁面（首頁、部落格、專案、會議等）
- `src/data/` — **靜態資料**（專案、會議、FAQ），維護時主要改這裡
- `src/components/` — 共用的 Header、Footer、登入等組件
- `src/router/index.ts` — 路由；`src/lib/firebase.ts` — Firebase 設定

## 開發注意

- 本機需有 `.env` 並設定好 Firebase。部落格存於 Realtime Database，結構：`/blogs/{id}` 含 `title`、`content`(Markdown)、`author`、`date`、`tags`。

## 部署

```bash
npm run build
firebase deploy
```

---

## vTaiwan Neo - Vue Version

Vue version of vTaiwan Neo (Vue 3 + Vite + Tailwind CSS + Firebase). Backend: [Jitsi JWT](https://github.com/g0v/vtaiwan-jaas-jwt-worker) · [Transcription & AI outline](https://github.com/g0v/vtaiwan-transcription-worker)

## Install & Run

If you don’t have Node.js yet, install it from [nodejs.org](https://nodejs.org/) (LTS recommended).

```bash
npm install
npm run dev
```

Open the URL shown in the terminal. Other commands: `npm run type-check`, `npm run build`, `npm run preview`.

---

## How to Maintain Content (Edit Files)

Edit files under `src/data/` — no code changes needed; refresh the page to see updates.

| What to edit      | File                    | Notes |
|-------------------|-------------------------|-------|
| Project list      | `src/data/projects.ts`  | Add/edit in `projects` array; icon names must exist in [Lucide](https://lucide.dev/) |
| FAQ               | `src/data/faqs.ts`      | Add/edit in `faqs` array |

Styles: use Tailwind classes or component `<style>`; global styles in `src/style.css`.

---

## Features & Tech

Homepage, blog (Markdown), Google login, post articles, projects/meetups/FAQ/contributors/about, live video (transcript collab, in dev, English only). Stack: Vue 3, Vite, Vue Router, Tailwind, Lucide, Firebase (auth + Realtime DB), Marked.

## Project Structure

- `src/views/` — Pages
- `src/data/` — **Static data** (projects, meetups, FAQ) — main place to edit for content
- `src/components/` — Header, Footer, login, etc.
- `src/router/index.ts`, `src/lib/firebase.ts`

## Dev Notes

Set up `.env` with Firebase. Blog data in Realtime Database: `/blogs/{id}` with `title`, `content` (Markdown), `author`, `date`, `tags`.

## Deploy

```bash
npm run build
firebase deploy
```
