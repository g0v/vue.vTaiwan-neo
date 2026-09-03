<template>
  <section class="vt-page-shell min-h-[70vh]">
    <div class="vt-page-content max-w-4xl">
      <div v-if="loading" class="vt-status-panel" role="status">
        <span class="border-vt-border border-t-democratic-red h-8 w-8 animate-spin rounded-full border-2" aria-hidden="true" />
        <p>{{ t('newsletter.loading') }}</p>
      </div>

      <div v-else-if="error" class="vt-status-panel" role="alert">
        <p class="text-democratic-red">{{ error }}</p>
        <router-link to="/newsletters" class="vt-btn vt-btn-ghost">{{ t('newsletter.backToList') }}</router-link>
      </div>

      <article v-else-if="newsletter">
        <router-link to="/newsletters" class="text-vt-gray-700 hover:text-democratic-red mb-6 inline-flex font-sans text-sm transition-colors">{{ t('newsletter.backToList') }}</router-link>
        <img v-if="newsletter.coverImage" :src="newsletter.coverImage" :alt="newsletter.title" class="vt-glass-panel mb-8 h-auto w-full object-cover" />
        <div class="vt-glass-panel p-6 sm:p-9 lg:p-10">
          <header class="border-vt-border mb-8 border-b pb-7">
            <p class="text-vt-gray-400 mb-3 font-sans text-sm">
              <span v-if="newsletter.author">{{ newsletter.author }} · </span>{{ formatDate(newsletter.pubDate) }}
            </p>
            <h1 class="m-0 text-3xl leading-tight tracking-[-0.02em] md:text-4xl">{{ newsletter.title }}</h1>
            <a :href="newsletter.link" target="_blank" rel="noopener noreferrer" class="text-democratic-red mt-5 inline-flex font-sans text-sm font-medium hover:underline"
              >{{ t('newsletter.viewOriginal') }} →</a
            >
          </header>
          <div class="newsletter-content prose max-w-none" v-html="sanitizedContent"></div>
        </div>
        <footer class="mt-8 text-center">
          <router-link to="/newsletters" class="vt-btn vt-btn-ghost">{{ t('newsletter.backToList') }}</router-link>
        </footer>
      </article>

      <div v-else class="vt-status-panel">
        <p>{{ t('newsletter.notFound') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getNewsletterBySlug, sanitizeNewsletterHtml, type NewsletterItem } from '@/lib/newsletters'

const route = useRoute()
const { locale, t } = useI18n()

const newsletter = ref<NewsletterItem | null>(null)
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

const sanitizedContent = computed(() => {
  const content = newsletter.value?.contentHtml || `<p>${newsletter.value?.description || ''}</p>`
  return sanitizeNewsletterHtml(content)
})

useHead({
  title: computed(() => (newsletter.value ? `${newsletter.value.title} | vTaiwan` : `${t('newsletter.title')} | vTaiwan`)),
})

const loadNewsletter = async () => {
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''

  if (!slug) {
    error.value = t('newsletter.notFound')
    return
  }

  loading.value = true
  error.value = ''

  try {
    newsletter.value = await getNewsletterBySlug(slug)

    if (!newsletter.value) {
      error.value = t('newsletter.notFound')
    }
  } catch (err) {
    console.error('載入電子報內容失敗', err)
    error.value = t('newsletter.fetchError')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNewsletter()
})

watch(() => route.params.slug, loadNewsletter)
</script>

<style scoped>
@reference '../style.css';

.newsletter-content :deep(.subscription-widget-wrap-editor),
.newsletter-content :deep(.subscription-widget),
.newsletter-content :deep(form) {
  display: none;
}

.newsletter-content :deep(img) {
  @apply h-auto max-w-full rounded-xl;
}

.newsletter-content :deep(p),
.newsletter-content :deep(ul),
.newsletter-content :deep(ol),
.newsletter-content :deep(blockquote),
.newsletter-content :deep(.captioned-image-container),
.newsletter-content :deep(figure),
.newsletter-content :deep(h1),
.newsletter-content :deep(h2),
.newsletter-content :deep(h3),
.newsletter-content :deep(h4) {
  @apply my-6;
}

.newsletter-content :deep(li) {
  @apply my-2;
}

.newsletter-content :deep(h1),
.newsletter-content :deep(h2),
.newsletter-content :deep(h3),
.newsletter-content :deep(h4) {
  @apply leading-tight font-bold;
}

.newsletter-content :deep(h1) {
  @apply text-2xl md:text-3xl;
}

.newsletter-content :deep(h2) {
  @apply text-xl md:text-2xl;
}

.newsletter-content :deep(h3) {
  @apply text-lg md:text-xl;
}

.newsletter-content :deep(h4) {
  @apply text-lg md:text-xl;
}

.newsletter-content :deep(a) {
  @apply text-democratic-red underline underline-offset-2;
}

.newsletter-content :deep(iframe) {
  @apply max-w-full;
}

.newsletter-content :deep(hr) {
  @apply my-8;
}
</style>
