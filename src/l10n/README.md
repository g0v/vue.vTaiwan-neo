# 國際化 (i18n) 使用說明

## 概述

本專案使用 `vue-i18n` 套件來實現多語言支援，目前支援繁體中文 (zh-TW) 和英文 (en)。

本專案的後端也是開源的，分為兩個專案：

1. Jisti視訊服務的JWT生成： https://github.com/g0v/vtaiwan-jaas-jwt-worker
2. 音訊轉錄、逐字稿管理與AI大綱整理： https://github.com/g0v/vtaiwan-transcription-worker

## 檔案結構

```
src/l10n/
├── README.md          # 本說明文件
├── zh-TW.json         # 繁體中文翻譯
├── en.json           # 英文翻譯
└── index.ts          # i18n 設定檔
```

## 使用方法

### 1. 在 Vue 元件中使用翻譯

#### 使用 $t 函數 (模板中)
```vue
<template>
  <div>
    <h1>{{ $t('home.welcome') }}</h1>
    <p>{{ $t('home.description') }}</p>
    <button>{{ $t('common.save') }}</button>
  </div>
</template>
```

#### 使用 useI18n (Composition API)
```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 在 JavaScript 中使用
const message = t('auth.loginError')
</script>
```

### 2. 帶參數的翻譯

```json
// zh-TW.json
{
  "footer": {
    "copyright": "© {year} vTaiwan. 版權所有。"
  }
}
```

```vue
<template>
  <p>{{ $t('footer.copyright', { year: 2024 }) }}</p>
</template>
```

### 3. 語言切換

使用 `LanguageSwitcher` 元件或直接調用 `setLocale` 函數：

```vue
<script setup>
import { setLocale } from '@/i18n'

// 切換到英文
setLocale('en')

// 切換到繁體中文
setLocale('zh-TW')
</script>
```

## 新增翻譯

### 1. 在翻譯檔案中新增項目

在 `src/l10n/zh-TW.json` 和 `src/l10n/en.json` 中新增對應的翻譯：

```json
// zh-TW.json
{
  "newSection": {
    "title": "新標題",
    "description": "新描述"
  }
}

// en.json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

### 2. 在元件中使用

```vue
<template>
  <div>
    <h1>{{ $t('newSection.title') }}</h1>
    <p>{{ $t('newSection.description') }}</p>
  </div>
</template>
```

## 支援的語言

- **繁體中文 (zh-TW)**: 預設語言
- **英文 (en)**: 第二語言

## 語言偏好設定

系統會按以下順序決定使用語言：

1. 使用者之前選擇的語言 (儲存在 localStorage)
2. 瀏覽器語言設定
3. 預設語言 (繁體中文)

## 注意事項

- 所有翻譯檔案都使用 JSON 格式
- 翻譯鍵值使用點號分隔的命名空間 (例如: `header.home`)
- 建議將相關的翻譯項目組織在同一個命名空間下
- 新增翻譯時請確保中英文版本都有對應的項目 