import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TopicsView from '../views/TopicsView.vue'
import TopicDetailView from '../views/TopicDetailView.vue'
import MeetupsView from '../views/MeetupsView.vue'
import BlogsView from '../views/BlogsView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import PostBlogView from '../views/PostBlogView.vue'
import FAQView from '../views/FAQView.vue'
import AboutView from '../views/AboutView.vue'
import ContributorsView from '../views/ContributorsView.vue'
import ContactView from '../views/ContactView.vue'
import JitsiView from '../views/JitsiView.vue'
import TranscriptionsView from '../views/TranscriptionsView.vue'
import TranscriptionDetailView from '../views/TranscriptionDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import ProposeView from '../views/ProposeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/jitsi',
      name: 'jitsi',
      component: JitsiView
    },
    {
      path: '/topics',
      name: 'topics',
      component: TopicsView
    },
    {
      path: '/topic/:id',
      name: 'topic',
      component: TopicDetailView
    },
    {
      path: '/meetups',
      name: 'meetups',
      component: MeetupsView
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: BlogsView
    },
    {
      path: '/blogs/:title',
      name: 'blog-detail',
      component: BlogDetailView
    },
    {
      path: '/blogs/post_blog',
      name: 'post-blog',
      component: PostBlogView
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQView
    },
    {
      path: '/how-to-use',
      redirect: '/faq'
    },
    {
      path: '/intro',
      name: 'about',
      component: AboutView
    },
    {
      path: '/contributors',
      name: 'contributors',
      component: ContributorsView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/contactus',
      redirect: '/contact'
    },
    {
      path: '/transcriptions',
      name: 'transcriptions',
      component: TranscriptionsView
    },
    {
      path: '/transcription_detail/:meeting_id',
      name: 'transcription-detail',
      component: TranscriptionDetailView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/propose',
      name: 'propose',
      component: ProposeView
    }
  ]
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
    behavior: 'smooth' // 使用平滑捲動效果
  })
})

export default router
