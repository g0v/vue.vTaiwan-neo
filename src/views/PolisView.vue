<template>
  <!-- Hero Section -->
  <section class="bg-black py-8 text-white">
    <div class="container mx-auto px-2">
      <div class="mx-auto max-w-4xl">
        <h1 class="mb-4 text-3xl font-bold md:text-4xl">{{ $t('polis.title') }}</h1>
        <p class="text-lg opacity-90">
          {{ $t('polis.subtitle') }}
        </p>
      </div>
    </div>
  </section>

  <!-- Intro Section -->
  <section class="bg-gray-50 py-12">
    <div class="container mx-auto px-2">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8 rounded-lg bg-white p-6 shadow-md md:p-8">
          <p class="mb-4 text-xl font-semibold text-gray-900">{{ $t('polis.intro.p1') }}</p>
          <p class="mb-4 text-gray-700">{{ $t('polis.intro.p2') }}</p>
          <p class="mb-4 text-gray-700">{{ $t('polis.intro.p3') }}</p>
          <p class="mb-4 text-gray-700">{{ $t('polis.intro.p4') }}</p>

          <!-- Report Link -->
          <p class="mb-4 text-gray-700">
            {{ $t('polis.reportLabel') }}
            <a
              href="https://pol.is/report/r84fwd8axfjy3mmsfjmpr"
              target="_blank"
              rel="noopener noreferrer"
              class="break-all font-medium text-jade-green underline underline-offset-4 hover:text-democratic-red"
            >
              https://pol.is/report/r84fwd8axfjy3mmsfjmpr
            </a>
          </p>
        </div>


        <!-- Polis Embed -->
        <div class="overflow-hidden rounded-lg bg-white p-2 shadow-md md:p-4">
          <div ref="polisContainer">
            <div class="polis" data-conversation_id="2525kxsn2f"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'

const { t } = useI18n()

useHead({
  title: t('polis.title') + ' | vTaiwan',
  meta: [
    { property: 'og:title', content: t('polis.title') + ' | vTaiwan' },
    { property: 'og:description', content: t('polis.subtitle') },
    { property: 'og:url', content: 'https://vtaiwan.tw/polis' },
    { property: 'twitter:title', content: t('polis.title') + ' | vTaiwan' },
    { property: 'twitter:description', content: t('polis.subtitle') },
  ],
})

const polisContainer = ref(null)
const POLIS_SCRIPT_SRC = 'https://pol.is/embed.js'
let scriptEl = null

onMounted(() => {
  // Remove any existing polis script so embed.js re-runs and picks up our fresh div
  document.querySelectorAll(`script[src="${POLIS_SCRIPT_SRC}"]`).forEach(s => s.remove())

  scriptEl = document.createElement('script')
  scriptEl.async = true
  scriptEl.src = POLIS_SCRIPT_SRC
  document.body.appendChild(scriptEl)
})

onBeforeUnmount(() => {
  if (scriptEl && scriptEl.parentNode) {
    scriptEl.parentNode.removeChild(scriptEl)
  }
  scriptEl = null
})
</script>
