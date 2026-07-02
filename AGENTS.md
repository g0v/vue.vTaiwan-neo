# AGENTS.md

給 AI coding agent 的工作指引。本檔聚焦「**agent 該怎麼在這個 repo 工作**」；一般的內容維護、部署說明請看 [`README.md`](./README.md)。

## 專案簡介

vTaiwan 官網。技術棧：**Vue 3 + Vite + Tailwind CSS v4 + Firebase（Auth + Realtime Database）**，搭配 Vue Router、vue-i18n、Marked。後端服務為獨立 repo（Jitsi JWT、轉錄 worker）。

## 常用指令

```bash
npm install            # 安裝依賴
npm run dev            # 本機開發（http://localhost:3000）
npm run type-check     # vue-tsc 類型檢查
npm run build          # vite build 建置
npm run build:type-check  # 先型別檢查再建置
npm run preview        # 預覽建置結果
```

## 語言與溝通慣例

- **程式碼識別字、技術用語 → 英文**（變數、函式、型別名稱等）。
- **註解、commit 訊息、對使用者的回覆 → 繁體中文**。延續現有 repo 風格。

## 動工前的原則（重要）

- **禁止憑空臆測。** 遇到模糊、不完整或有歧義的指令，先反覆與使用者核對到清楚為止，確認後才動工——不要自行假設需求就開始改。
- 動大結構、加新工具鏈（如測試框架）前先說明並確認。

## 程式碼慣例

- **元件寫法**：Vue 3 SFC，一律 `<script setup>` + Composition API。
- **新檔語言**：新元件用 `<script setup lang="ts">`，新工具檔用 `.ts`；逐步往 TypeScript 收斂。改動既有檔案時沿用該檔原本風格（JS 或 TS），不強行重寫舊檔。
- **路徑別名**：`@` → `src/`（見 `vite.config.ts`）。import 用 `@/...`。
- **路由**：`src/router/index.ts`，頁面用 lazy import（`() => import('@/views/XxxView.vue')`）。
- **格式化**：Prettier（見 `.prettierrc`）——不加分號、單引號、`arrowParens: avoid`、`printWidth: 200`、含 `prettier-plugin-tailwindcss`（會自動排序 class）。寫程式時就照這個風格，不要手動打亂 class 順序。

### Tailwind v4

- 樣式優先用 Tailwind 原子類別；SFC 內 `<style>` 需 Tailwind 時，開頭加 `@reference './style.css';` 才能用 `@apply`。
- **沿用設計系統**：使用既有設計 token（例如 `bg-democratic-red/10` 等自訂色）與 `src/style.css`、`design/` 內的變數，**不要在各處硬寫顏色數值**。

### i18n（多語系）

- 介面文字一律走翻譯：模板用 `$t('key')`，`<script setup>` 內用 `const { t } = useI18n()` 後 `t('key')`。不要在畫面寫死字串。
- **三檔同步（硬性規定）**：新增任何介面文字時，`src/l10n/zh-TW.json`、`en.json`、`ja.json` **三個檔都要加上相同的 key**，值各自翻譯。key 用點號分層（如 `header.home`、`about.mission.title`）。缺 key 會顯示原始 key 或 fallback。

## 內容維護（不用改程式碼）

多數內容改資料檔即可，refresh 頁面就看得到：

| 內容     | 檔案                          |
| -------- | ----------------------------- |
| 貢獻者   | `src/data/contributors.ts`    |
| FAQ      | `src/data/faqs.ts`            |
| 介面文字 | `src/l10n/*.json`（三檔同步） |

## 專案結構

- `src/views/` — 各頁面（`XxxView.vue`）
- `src/components/` — 共用元件（Header、Footer、登入、Topic 相關等）
- `src/data/` — 靜態資料（貢獻者、FAQ）
- `src/l10n/` — 翻譯 JSON（zh-TW / en / ja）
- `src/lib/` — 整合層（`firebase.ts`、`discourse.ts`、`newsletters.ts`）
- `src/router/index.ts` — 路由
- `src/utils/`、`src/assets/`

**Firebase 資料結構**：`/users/{uid}`（含 role、isAdmin 等）、`/blogs/{id}`（`title`、`content` 為 Markdown、`author`、`date`、`tags`）。本機需自備 `.env` 設定 Firebase。

## 驗證流程（改完必做）

1. `npm run type-check` — 確認沒有型別 / 模板錯誤。
2. `npm run build` — 確認能成功建置。
3. **單元測試（Vitest + Vue Test Utils）**：為新增的邏輯補測試。專案目前尚未建立測試框架——第一次要加測試時，先安裝設定 Vitest + Vue Test Utils，並在動工前與使用者確認（見「動工前的原則」）。

## Git / Commit 慣例

- **Conventional Commits + 繁體中文描述**，例如：
  - `feat: 新增電子報詳情頁`
  - `fix: 修正登入後 userData 未更新`
  - `chore(deps): 升級 Tailwind CSS`
- 常見前綴：`feat`、`fix`、`chore`、`refactor`、`style`、`docs`。
- 除非使用者明確要求，否則**不要自行 commit / push**。

## 守則與禁區

- ✅ **i18n 三檔同步**——新增文字時 zh-TW / en / ja 都要有對應 key。
- ✅ **沿用設計系統**——用既有 Tailwind 變數 / token，不硬寫顏色。
- ✅ **動工前確認需求**——不憑空臆測，模糊就先問清楚。
- 🚫 **不手改 `dist/`**——那是 `npm run build` 的自動產物。
- 🚫 **不提交機密**——`.env`、Firebase 金鑰等不進 git。
