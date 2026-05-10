<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div class="max-w-3xl">
        <h1 class="mb-3 text-3xl font-bold">{{ t('newsletter.title') }}</h1>
        <p class="text-gray-600">{{ t('newsletter.description') }}</p>
      </div>

      <a
        :href="NEWSLETTER_FEED_URL.replace('/feed', '')"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center text-sm font-medium text-democratic-red hover:underline"
      >
        {{ t('newsletter.visitSubstack') }}
      </a>
    </div>

    <div v-if="loading" class="py-10 text-center text-gray-600">
      {{ t('newsletter.loading') }}
    </div>

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p class="mb-4 text-red-700">{{ error }}</p>
      <button @click="loadNewsletters(true)" class="rounded-md bg-democratic-red px-4 py-2 text-white transition hover:opacity-90">
        {{ t('newsletter.retry') }}
      </button>
    </div>

    <div v-else-if="newsletters.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="newsletter in newsletters"
        :key="newsletter.id"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <router-link :to="{ name: 'newsletter-detail', params: { slug: newsletter.slug } }" class="block bg-gray-200">
          <img v-if="newsletter.coverImage" :src="newsletter.coverImage" :alt="newsletter.title" class="h-52 w-full object-contain" />
        </router-link>

        <div class="p-6">
          <p class="mb-3 text-sm text-gray-500">
            {{ formatDate(newsletter.pubDate) }}
          </p>

          <h2 class="mb-3 text-xl font-bold text-gray-900">
            <router-link :to="{ name: 'newsletter-detail', params: { slug: newsletter.slug } }" class="hover:text-democratic-red">
              {{ newsletter.title }}
            </router-link>
          </h2>

          <p class="newsletter-excerpt mb-5 text-gray-700">
            {{ newsletter.excerpt || newsletter.description }}
          </p>

          <router-link :to="{ name: 'newsletter-detail', params: { slug: newsletter.slug } }" class="font-medium text-democratic-red hover:underline">
            {{ t('newsletter.readMore') }}
          </router-link>
        </div>
      </article>
    </div>

    <div v-else class="py-10 text-center text-gray-600">
      {{ t('newsletter.empty') }}
    </div>
  </div>
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
