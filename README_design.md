# [審議視覺化] 分支說明

### 完整流程：
社會議題討論 (實體 or 線上) → 對話逐字稿 → 【重點摘要 (爭點 or 共識) → 視覺化】

### User Story 發想：
1. 網站管理者 可以建立議題討論頁，用 AI 來輔助產生重點摘要。
2. 網站管理者 可以編輯重點摘要，以人工方式避免AI偏誤。
3. 訪客 可以查看重點摘要，快速瞭解該議題的各方主要論點。
4. (5...)


### Tech
1. 建立議題討論頁：Vue + Firebase
2. AI 輔助重點摘要：ClouFlare Worker & Worker AI & D1 Database
3. 編輯重點摘要：ClouFlare Worker D1 Database CRUD API 
4. 訪客可以查看重點摘要：Vue + axois(對後端3. 項 的 API 發GET請求)
5. (...)