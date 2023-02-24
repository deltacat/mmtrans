import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@r/views/HomePage.vue')
  },
  {
    path: '/files',
    name: 'FilesPage',
    component: () => import('@r/views/Files.vue')
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: () => import('@r/views/Settings.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
