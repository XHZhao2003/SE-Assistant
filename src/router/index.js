import { createRouter, createWebHistory } from 'vue-router'
import NewSession from '../components/NewSession.vue'
import HistorySession from '../components/HistorySession.vue'
import CourseVideo from '../components/CourseVideo.vue'
import CourseSlide from '../components/CourseSlide.vue'
import UMLPlayground from '../components/UMLPlayground.vue'
import ChatView from '../views/ChatView.vue'

const routes = [
  {
    path: '/',
    component: ChatView,
    children: [
      {
        path: 'new-session',
        component: NewSession
      },
      {
        path: 'history-session',
        component: HistorySession
      },
      {
        path: 'course-video',
        component: CourseVideo
      },
      {
        path: 'course-slide',
        component: CourseSlide
      },
      {
        path: 'uml-playground',
        component: UMLPlayground
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router  