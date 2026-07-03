<template>
  <footer class="footer-shell">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="@/assets/images/vtaiwan-logo.svg" alt="vTaiwan" class="footer-logo" />
          <p class="footer-description">
            {{ $t('footer.description') }}
          </p>
        </div>

        <div>
          <h4 class="footer-section-label"><span class="footer-section-mark"></span>{{ $t('footer.community') }}</h4>
          <ul class="footer-list">
            <li>
              <a href="https://g0v.social/" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="footer-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12.103 0C5.413 0 .001 5.412.001 12.103c0 5.69 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
                    />
                  </svg>
                </span>
                <span class="min-w-0">Mastodon</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/vtaiwan.tw/" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="footer-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </span>
                <span class="min-w-0">Facebook</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a href="https://x.com/v_taiwan" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="footer-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
                <span class="min-w-0">X(Twitter)</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/vtaiwan.tw/" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="footer-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    />
                  </svg>
                </span>
                <span class="min-w-0">Instagram</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/vtaiwan/" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="footer-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                  </svg>
                </span>
                <span class="min-w-0">LinkedIn</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book" target="_blank" rel="noopener noreferrer" class="footer-link">
                <span class="footer-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1v5h5v10H6V3h7z" />
                    <path d="M8 12h8v2H8zm0 4h5v2H8z" />
                  </svg>
                </span>
                <span class="min-w-0">HackMD</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="footer-section-label"><span class="footer-section-mark"></span>{{ $t('footer.contact') }}</h4>
          <ul class="footer-list">
            <li>
              <a href="mailto:info@vtaiwan.tw" class="footer-link">
                <span class="footer-link-icon">
                  <IconWrapper name="mail" :size="16" color="currentColor" />
                </span>
                <span class="min-w-0">info@vtaiwan.tw</span>
                <svg class="footer-link-arrow" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10M7 17 17 7" />
                </svg>
                <span class="footer-link-spacer" aria-hidden="true"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="m-0">
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant" class="footer-bottom-link" target="_blank" rel="noopener noreferrer">{{
            $t('footer.copyright', { year: currentYear })
          }}</a>
        </p>
        <p class="footer-bottom-nav">
          <a href="https://github.com/g0v/vue.vTaiwan-neo" class="footer-bottom-link">{{ $t('footer.sourceCode') }}</a>
          <span class="footer-bottom-separator">|</span>
          <a href="/privacy" class="footer-bottom-link">{{ $t('footer.privacyPolicy') }}</a>
          <span class="footer-bottom-separator">|</span>
          <a href="/terms" class="footer-bottom-link">{{ $t('footer.termsOfService') }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconWrapper from './IconWrapper.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
@reference '../style.css';

.footer-shell {
  @apply text-vt-gray-200 relative overflow-hidden py-9;
  background:
    radial-gradient(80% 120% at 0% 0%, color-mix(in srgb, var(--color-vt-democratic-red) 10%, transparent) 0%, transparent 55%),
    radial-gradient(70% 120% at 100% 100%, color-mix(in srgb, var(--color-vt-jade-green) 8%, transparent) 0%, transparent 60%),
    linear-gradient(180deg, var(--color-vt-gray-800) 0%, var(--color-vt-bg-inverse) 100%);
}

.footer-shell::before,
.footer-bottom::before {
  @apply absolute inset-x-0 top-0 h-px;
  content: '';
  background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-vt-white) 8%, transparent) 50%, transparent 100%);
}

.footer-container {
  @apply relative mx-auto max-w-7xl px-4 md:px-7;
}

.footer-grid {
  @apply relative grid gap-8;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: 1.4fr 1fr 1fr;
    align-items: start;
  }
}

.footer-logo {
  @apply mb-3 block h-[26px] w-auto opacity-95;
}

.footer-description {
  @apply text-vt-gray-400 m-0 max-w-xs text-[13px] leading-[1.65];
}

.footer-section-label {
  @apply text-vt-gray-200 mb-2 flex h-7 items-center gap-2 font-sans text-[11px] font-semibold uppercase;
}

.footer-section-mark {
  @apply bg-vt-democratic-red h-[5px] w-[5px] shrink-0 rounded-full;
  box-shadow: 0 0 6px color-mix(in srgb, var(--color-vt-democratic-red) 55%, transparent);
}

.footer-list {
  @apply m-0 flex list-none flex-col gap-0.5 p-0;
}

.footer-link {
  @apply text-vt-gray-200 hover:text-vt-white -mx-2.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-sans text-[13px] leading-[1.4] no-underline transition duration-200 hover:bg-white/5;
}

.footer-link-icon {
  @apply inline-flex h-4 w-4 shrink-0 items-center justify-center opacity-75 transition duration-200;
}

.footer-link-icon svg {
  @apply h-4 w-4;
}

.footer-link-arrow {
  @apply text-vt-democratic-red h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition duration-200;
}

.footer-link-spacer {
  @apply grow;
}

.footer-link:hover .footer-link-icon {
  @apply text-vt-white opacity-100;
}

.footer-link:hover .footer-link-arrow {
  @apply translate-x-0 opacity-100;
}

.footer-bottom {
  @apply text-vt-gray-400 relative mt-7 flex flex-col gap-2 pt-4 font-sans text-xs md:flex-row md:items-center md:justify-between;
}

.footer-bottom-nav {
  @apply m-0 inline-flex flex-wrap items-center gap-2;
}

.footer-bottom-link {
  @apply text-vt-gray-200 hover:text-vt-white no-underline transition duration-200;
}

.footer-bottom-separator {
  @apply opacity-30;
}
</style>
