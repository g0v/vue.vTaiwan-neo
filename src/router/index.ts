import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import MeetupsView from '../views/MeetupsView.vue'
import BlogsView from '../views/BlogsView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import PostBlogView from '../views/PostBlogView.vue'
import FAQView from '../views/FAQView.vue'
import AboutView from '../views/AboutView.vue'
import ContributorsView from '../views/ContributorsView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/projects/:topic',
      name: 'project-detail',
      component: ProjectDetailView
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
      path: '/about',
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
    }
  ]
})

export default router
