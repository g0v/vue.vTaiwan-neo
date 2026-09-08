#!/usr/bin/env bash

# 依 vue.vTaiwan-neo.code-workspace 設定，pull 本專案與 sibling 儲存庫
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

repos=(
  "$ROOT"
  "$ROOT/../vtaiwan-design-system"
  "$ROOT/../vTaiwan-hono"
)

failed=0
skipped=0
succeeded=0
total=${#repos[@]}

echo "========================================"
echo "開始同步 workspace 內的 git 儲存庫"
echo "共 ${total} 個專案（來源：vue.vTaiwan-neo.code-workspace）"
echo "========================================"
echo

for i in "${!repos[@]}"; do
  repo="${repos[$i]}"
  index=$((i + 1))

  echo "----------------------------------------"
  echo "[${index}/${total}] 處理中：$(basename "$repo")"
  echo "路徑：${repo}"

  if [[ ! -d "$repo" ]]; then
    echo "結果：略過 — 目錄不存在，請確認已 clone 此專案"
    skipped=$((skipped + 1))
    failed=$((failed + 1))
    echo
    continue
  fi

  repo="$(cd "$repo" && pwd)"
  echo "實際路徑：${repo}"

  if [[ ! -d "$repo/.git" ]]; then
    echo "結果：略過 — 此目錄不是 git 儲存庫（找不到 .git）"
    skipped=$((skipped + 1))
    failed=$((failed + 1))
    echo
    continue
  fi

  branch="$(git -C "$repo" branch --show-current 2>/dev/null || echo "（未知）")"
  remote="$(git -C "$repo" remote get-url origin 2>/dev/null || echo "（無 origin）")"
  echo "目前分支：${branch}"
  echo "遠端 origin：${remote}"

  if ! git -C "$repo" diff --quiet 2>/dev/null || ! git -C "$repo" diff --cached --quiet 2>/dev/null; then
    echo "工作區狀態：有未提交的變更（pull 仍會嘗試執行）"
  elif [[ -n "$(git -C "$repo" ls-files --others --exclude-standard 2>/dev/null)" ]]; then
    echo "工作區狀態：有未追蹤的檔案（pull 仍會嘗試執行）"
  else
    echo "工作區狀態：乾淨"
  fi

  echo "執行：git pull"
  if git -C "$repo" pull; then
    echo "結果：成功 — $(basename "$repo") 已更新至最新"
    succeeded=$((succeeded + 1))
  else
    echo "結果：失敗 — $(basename "$repo") pull 未成功，請手動檢查上述錯誤訊息"
    failed=$((failed + 1))
  fi
  echo
done

echo "========================================"
echo "同步完成"
echo "成功：${succeeded} 個"
echo "略過：${skipped} 個"
echo "失敗：$((failed - skipped)) 個"
echo "========================================"

exit "$failed"
