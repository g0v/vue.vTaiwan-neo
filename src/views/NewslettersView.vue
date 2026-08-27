<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content-wide">
      <div class="vt-page-intro flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="vt-section-label">{{ t('pageLabels.newsletters') }}</p>
          <h1 class="vt-page-title">
            <span class="vt-title-underline">{{ t('newsletter.title') }}</span>
          </h1>
          <p class="vt-page-description">{{ t('newsletter.description') }}</p>
        </div>
        <a :href="NEWSLETTER_FEED_URL.replace('/feed', '')" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-ghost shrink-0">{{ t('newsletter.visitSubstack') }} →</a>
      </div>

      <div v-if="loading" class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ t('newsletter.loading') }}</p>
      </div>
      <div v-else-if="error" class="vt-status-panel" role="alert">
        <p class="text-democratic-red">{{ error }}</p>
        <button type="button" class="vt-btn vt-btn-primary" @click="loadNewsletters(true)">{{ t('newsletter.retry') }}</button>
      </div>

      <div v-else-if="newsletters.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="newsletter in newsletters" :key="newsletter.id" class="vt-glass-panel group overflow-hidden transition-transform hover:-translate-y-0.5">
          <router-link :to="{ name: 'newsletter-detail', params: { slug: newsletter.slug } }" class="bg-vt-bg-2 block aspect-[16/10] overflow-hidden">
            <img v-if="newsletter.coverImage" :src="newsletter.coverImage" :alt="newsletter.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
          </router-link>
          <div class="p-6">
            <p class="text-vt-gray-400 font-sans text-xs">{{ formatDate(newsletter.pubDate) }}</p>
            <h2 class="mt-3 mb-0 text-xl leading-snug">
              <router-link :to="{ name: 'newsletter-detail', params: { slug: newsletter.slug } }" class="hover:text-democratic-red transition-colors">{{ newsletter.title }}</router-link>
            </h2>
            <p class="newsletter-excerpt text-vt-gray-700 mt-3 text-sm leading-6">{{ newsletter.excerpt || newsletter.description }}</p>
            <router-link :to="{ name: 'newsletter-detail', params: { slug: newsletter.slug } }" class="text-democratic-red mt-5 inline-flex font-sans text-sm font-medium hover:underline"
              >{{ t('newsletter.readMore') }} →</router-link
            >
          </div>
        </article>
      </div>

      <div v-else class="vt-status-panel">
        <p>{{ t('newsletter.empty') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { getNewsletters, NEWSLETTER_FEED_URL, type NewsletterItem } from '@/lib/newsletters'

const { locale, t } = useI18n()

useHead({
  title: `${t('newsletter.title')} | vTaiwan`,
})

const newsletters = ref<NewsletterItem[]>([])
const loading = ref(false)
const error = ref('')

const formatDate = (dateString: string) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const loadNewsletters = async (force = false) => {
  loading.value = true
  error.value = ''

  try {
    newsletters.value = await getNewsletters(force)
  } catch (err) {
    console.error('載入電子報失敗', err)
    error.value = t('newsletter.fetchError')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNewsletters()
})
</script>

<style scoped>
.newsletter-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
