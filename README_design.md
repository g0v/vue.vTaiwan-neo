目前發想(by Tim, reviewd by Bestian)

### 線上化民主審議流程：
社會議題討論 (實體 or 線上) → 對話逐字稿 → 視覺化重點摘要 (爭點 & 共識)

---

### 訪客
- 可以　輸入關鍵字，查詢符合關鍵字的議題
- 可以　設定篩選條件，例如類型、推薦度等，以便找到感興趣的議題
- 可以　瀏覽議題列表
- 可以　查看議題查看重點摘要，快速瞭解該議題的各方主要論點
- 可以　分享議題的詳細資訊到社交媒體上
- 可以　註冊會員帳號

### 網站會員
- 可以   登入會員系統
- 可以   對議題新增留言 & 參考資料連結
- 可以   回覆其他人的留言
- 可以   訂閱關注的議題，並收到後續討論信件通知
- (可以   編輯議題逐字稿內容) 
- (可以 建立新議題)
- (可以  tag他人，被 tag 的人會收到信件通知)
- (可以   匿名發表留言)

### 網站管理者
- 可以    編輯議題逐字稿內容
- 可以　建立新議題
- 可以　審核使用者提交的評論和評價內容，以保持資料的整潔和準確性
- 可以　刪除評論，確保系統的評價符合相關政策

---

### Tech
1. 建立議題討論頁：Vue + Firebase
2. AI 輔助重點摘要：ClouFlare Worker & Worker AI & D1 Database
3. 編輯重點摘要：ClouFlare Worker D1 Database CRUD API 
4. 訪客可以查看重點摘要：Vue + axois(對後端3. 項 的 API 發GET請求)


共同編輯UX設計文檔位置：

visualizing-deliberation分支 > README_design.md 這個檔案

https://github.com/g0v/vue.vTaiwan-neo/blob/visualizing-deliberation/README_design.md