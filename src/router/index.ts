import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogsView from '../views/BlogsView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import PostBlogView from '../views/PostBlogView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: BlogsView
    },
    {
      path: '/blogs/:title',
      name: 'blog-detail',
      component: BlogDetailView,
      props: true
    },
    {
      path: '/blogs/post_blog',
      name: 'post-blog',
      component: PostBlogView
    }
  ]
})

export default router
