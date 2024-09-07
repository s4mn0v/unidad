// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Tables from '@/views/Tables.vue'
import NotFound from '@/views/404.vue'
import Convert from '@/views/Convert.vue'
import Students from '@/views/Students.vue'
import ActiveStudents from '@/views/ActiveStudents.vue'
import GraduateStudents from '@/views/GraduateStudents.vue'
import MoodleStudents from '@/views/MoodleStudents.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tables',
      component: Tables
    },
    {
      path: '/convert',
      component: Convert
    },
    {
      path: '/students',
      component: Students
    },
    {
      path: '/active_students',
      component: ActiveStudents
    },
    {
      path: '/graduate_students',
      component: GraduateStudents
    },
    {
      path: '/moodle_students',
      component: MoodleStudents
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all for 404
      name: 'not-found',
      component: NotFound
    }
  ]
})

export default router
