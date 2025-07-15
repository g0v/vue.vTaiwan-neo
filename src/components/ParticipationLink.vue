<template>
  <div class="participation-link">
    <div v-if="ulinkall.length > 0" class="flex flex-wrap gap-2">
      <a
        v-for="(item, index) in ulinkall"
        :key="index"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        :title="item.long"
        class="inline-flex items-center px-3 py-1 text-sm bg-jade-green text-white rounded hover:bg-jade-green/80 transition-colors"
      >
        <IconWrapper :name="item.icon" :size="14" class="mr-1" />
        {{ item.text }}
      </a>
    </div>

    <!-- 空狀態提示 -->
    <div v-else class="text-xs text-gray-400">
      無相關連結
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import IconWrapper from './IconWrapper.vue'

// Props
const props = defineProps({
  urllink: {
    type: Array,
    default: () => []
  }
})

// 響應式資料
const ulinkall = ref([])

// 連結類型對應表
const dataBase = [
  {
    key: 'hackpad',
    icon: 'edit',
    text: '共筆',
    long: '會議共同筆記'
  },
  {
    key: 'sayit',
    icon: 'book',
    text: '記錄',
    long: '當日共同筆記整理出的重點'
  },
  {
    key: 'youtube',
    icon: 'play',
    text: '直播',
    long: '會議直播影片 youtube'
  },
  {
    key: 'livehouse',
    icon: 'play',
    text: '直播',
    long: '會議直播影片 livehouse'
  },
  {
    key: 'pol.is',
    icon: 'users',
    text: '討論',
    long: '進入討論'
  },
  {
    key: 'talk.vtaiwan.tw',
    icon: 'message-circle',
    text: '留言',
    long: '進入留言'
  },
  {
    key: 'app.sli.do',
    icon: 'megaphone',
    text: '提問',
    long: '會議共同筆記'
  },
  {
    key: '.pdf',
    icon: 'download',
    text: 'PDF',
    long: '會議共同筆記'
  },
  {
    key: 'g0v.github',
    icon: 'github',
    text: 'GitBook',
    long: '會議共同筆記'
  },
  {
    key: '',
    icon: 'link',
    text: '相關',
    long: '與議題相關的連結'
  }
]

// 處理連結
const processLinks = () => {
  // 清空原有連結
  ulinkall.value = []

  if (!props.urllink || props.urllink.length === 0) {
    return
  }

  // 過濾並處理有效的連結
  const validLinks = props.urllink.filter(link => link && link.trim() !== '')

  if (validLinks.length === 0) {
    return
  }

  ulinkall.value = validLinks.map(link => {
    const item = {}

    // 找到匹配的連結類型
    const matched = dataBase.find(data =>
      data.key !== '' && link.toLowerCase().indexOf(data.key) > -1
    ) || dataBase[dataBase.length - 1] // 預設使用最後一個（相關）

    item.icon = matched.icon
    item.long = matched.long

    // 解析連結格式 [文字](網址)
    const linkMatch = /^\[(.*?)\]\((.*)\)/.exec(link)
    if (linkMatch) {
      item.text = linkMatch[1]
      item.link = linkMatch[2]
    } else {
      item.link = link
      item.text = matched.text
    }

    return item
  })
}

// 組件掛載時處理連結
onMounted(() => {
  processLinks()
})

// 監聽 props 變化
watch(() => props.urllink, processLinks, { immediate: true })
</script>

<style scoped>
.participation-link {
  min-height: 2rem;
}
</style>
