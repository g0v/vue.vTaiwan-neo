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

| 要改的內容     | 編輯檔案                    | 說明 |
|----------------|-----------------------------|------|
| 貢獻者         | `src/data/contributors.ts`  | 在 `coreTeam` 等陣列新增/修改成員（name、role、description、imgURL 等） |
| 常見問題 FAQ   | `src/data/faqs.ts`          | 在 `faqs` 陣列新增/修改問題與答案 |
| 介面文字翻譯   | `src/l10n/*.json`           | 見下方「多語言翻譯」說明 |

樣式想微調：用 Tailwind 類別或改組件內 `<style>`；全站樣式改 `src/style.css`。

### 多語言翻譯檔案（l10n）

介面上的按鈕、標題、說明等文字來自 `src/l10n/` 的 JSON 檔，目前支援繁體中文、英文、日文：

```
src/l10n/
├── zh-TW.json   # 繁體中文
├── en.json      # 英文
├── ja.json      # 日文
└── README.md    # 進階 i18n 說明（給開發者）
```

**結構**：三個 JSON 檔的「鍵（key）」要一致，值才是各語言文字。鍵用點號分層，例如 `header.home`、`common.save`、`about.mission.title`。

**修改現有文字**：在對應語言的檔案裡找到同一個鍵，改右邊的值即可。例如把首頁選單「首頁」改成別的字，就改 `zh-TW.json` 裡 `header.home` 的值。

**新增一段翻譯**：在三個檔案裡**同一個位置**新增相同的鍵、各自語言的値。例如新增 `newPage.title`：
- `zh-TW.json`：在適當區塊加 `"title": "新頁面標題"`
- `en.json`：同區塊加 `"title": "New Page Title"`
- `ja.json`：同區塊加 `"title": "新規ページ"`

程式裡會用 `$t('newPage.title')` 顯示，所以鍵名需一致，否則會顯示 key 或 fallback。詳細用法見 `src/l10n/README.md`。

---

## 功能與技術摘要

- 首頁、Google 登入、議題、專案/會議/FAQ/貢獻者/關於我們、即時視訊（逐字稿校對，開發中）
- 技術：Vue 3、Vite、Vue Router、Tailwind、Lucide 圖標、Firebase（登入 + Realtime Database）、Marked 渲染 Markdown

## 專案結構（與維護相關）

- `src/views/` — 各頁面（首頁、部落格、專案、會議等）
- `src/data/` — **靜態資料**（貢獻者、FAQ），維護時主要改這裡
- `src/l10n/` — **多語言翻譯**（zh-TW.json、en.json、ja.json），介面文字由此改
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

| What to edit      | File                         | Notes |
|-------------------|------------------------------|-------|
| Contributors      | `src/data/contributors.ts`   | Add/edit in `coreTeam` etc.; fields: name, role, description, imgURL |
| FAQ               | `src/data/faqs.ts`           | Add/edit in `faqs` array |
| UI text / translations | `src/l10n/*.json`        | See “Multi-language (l10n)” below |

Styles: use Tailwind classes or component `<style>`; global styles in `src/style.css`.

### Multi-language translation files (l10n)

UI strings (buttons, titles, labels) come from JSON files in `src/l10n/`. Supported: zh-TW, en, ja.

```
src/l10n/
├── zh-TW.json   # Traditional Chinese
├── en.json      # English
├── ja.json      # Japanese
└── README.md    # Developer i18n details
```

**Structure**: All three JSON files share the same **keys**; only the values differ by language. Keys are dot-separated (e.g. `header.home`, `common.save`, `about.mission.title`).

**Edit existing text**: Find the key in the language file and change the value (e.g. change “Home” in the menu by editing `header.home` in `en.json`).

**Add new text**: Add the **same key** in all three files with the translated value. Example for `newPage.title`:
- `zh-TW.json`: `"title": "新頁面標題"`
- `en.json`: `"title": "New Page Title"`
- `ja.json`: `"title": "新規ページ"`

The app uses `$t('newPage.title')` to show the string, so keys must match across files. See `src/l10n/README.md` for more.

---

## Features & Tech

Homepage, Google login, topics, post articles, projects/meetups/FAQ/contributors/about, live video (transcript collab, in dev). Stack: Vue 3, Vite, Vue Router, Tailwind, Firebase (auth + Realtime DB), Marked.

## Project Structure

- `src/views/` — Pages
- `src/data/` — **Static data** (contributors, FAQ) — main place to edit for content
- `src/l10n/` — **Translations** (zh-TW.json, en.json, ja.json) — UI strings
- `src/components/` — Header, Footer, login, etc.
- `src/router/index.ts`, `src/lib/firebase.ts`

## Dev Notes

Set up `.env` with Firebase. Blog data in Realtime Database: `/blogs/{id}` with `title`, `content` (Markdown), `author`, `date`, `tags`.

## Deploy

```bash
npm run build
firebase deploy
```
