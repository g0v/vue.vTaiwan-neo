<template>
  <div>
    <PageHeader :label="$t('pageLabels.polis')" :title="$t('polis.title')" :description="$t('polis.subtitle')" dark compact />

    <section class="vt-page-shell">
      <div class="vt-page-content max-w-4xl">
        <div class="vt-glass-panel p-6 sm:p-8" aria-labelledby="civic-platform-title">
          <h2 id="civic-platform-title" class="vt-panel-title">{{ $t('polis.civicPlatform.title') }}</h2>
          <p class="text-vt-gray-700 mt-3 max-w-2xl leading-7">{{ $t('polis.civicPlatform.description') }}</p>
          <a href="https://civic.vtaiwan.tw/" target="_blank" rel="noopener noreferrer" class="vt-btn vt-btn-primary mt-6">{{ $t('polis.civicPlatform.linkLabel') }} →</a>
        </div>

        <div class="vt-glass-panel mt-6 p-6 sm:p-8">
          <p class="text-vt-gray-800 text-xl font-semibold">{{ $t('polis.intro.p1') }}</p>
          <div class="text-vt-gray-700 mt-4 space-y-4 leading-7">
            <p>{{ $t('polis.intro.p2') }}</p>
            <p>{{ $t('polis.intro.p3') }}</p>
            <p>{{ $t('polis.intro.p4') }}</p>
            <p>
              {{ $t('polis.reportLabel') }}
              <a
                href="https://pol.is/report/r84fwd8axfjy3mmsfjmpr"
                target="_blank"
                rel="noopener noreferrer"
                class="text-jade-green hover:text-democratic-red font-medium break-all underline underline-offset-4"
                >https://pol.is/report/r84fwd8axfjy3mmsfjmpr</a
              >
            </p>
          </div>
        </div>

        <div class="vt-glass-panel mt-6 overflow-hidden p-2 sm:p-4">
          <div ref="polisContainer"><div class="polis" data-conversation_id="2525kxsn2f"></div></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import PageHeader from '@/components/PageHeader.vue'

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
