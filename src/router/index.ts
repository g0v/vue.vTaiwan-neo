import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/jitsi',
      name: 'jitsi',
      component: () => import('@/views/JitsiView.vue'),
    },
    {
      path: '/topics',
      name: 'topics',
      component: () => import('@/views/TopicsView.vue'),
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: () => import('@/views/TopicDetailView.vue'),
    },
    {
      path: '/meetups',
      name: 'meetups',
      component: () => import('@/views/MeetupsView.vue'),
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: () => import('@/views/BlogsView.vue'),
    },
    {
      path: '/mastodon',
      name: 'mastodon',
      component: () => import('@/views/MastodonView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/FAQView.vue'),
    },
    {
      path: '/how-to-use',
      redirect: '/faq',
    },
    {
      path: '/intro',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/contributors',
      name: 'contributors',
      component: () => import('@/views/ContributorsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/contactus',
      redirect: '/contact',
    },
    {
      path: '/transcriptions',
      name: 'transcriptions',
      component: () => import('@/views/TranscriptionsView.vue'),
    },
    {
      path: '/transcription_detail/:meeting_id',
      name: 'transcription-detail',
      component: () => import('@/views/TranscriptionDetailView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/propose',
      name: 'propose',
      component: () => import('@/views/ProposeView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsView.vue'),
    },
    {
      path: '/404',
      name: 'notFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'catchAll',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// 全域導航守衛：路由轉換時自動捲到頂端
router.beforeEach((to, from, next) => {
  // 確保在 DOM 更新後捲到頂端
  next()
})

router.afterEach(() => {
  // 在路由轉換完成後捲到頁面頂端
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth', // 使用平滑捲動效果
  })
})

export default router
