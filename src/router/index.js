import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import NewSession from '@/components/NewSession.vue';
import HistorySession from '@/components/HistorySession.vue';
import CourseVideo from '../components/CourseVideo.vue';
import CourseSlide from '../components/CourseSlide.vue';
import UMLPlayground from '../components/UMLPlayground.vue';
import ChatView from '@/views/ChatView.vue';

const routes = [
  {
    path: '/login',
    component: Login, // 默认显示登录界面
  },
  {
    path: '/app',
    component: ChatView, // 主布局
    redirect: '/app/new-session', // 默认重定向到新会话
    children: [
      {
        path: 'new-session',
        name: 'NewSession',
        component: NewSession, // 右下角区域内容
      },
      {
        path: 'history-session',
        name: 'HistorySession',
        component: HistorySession,
      },
      {
        path: 'course-video',
                component: CourseVideo,
      },
      {
        path: 'course-slide',
                component: CourseSlide,
      },
      {
        path: 'uml-playground',
                component: UMLPlayground,
      },
    ],
  },
  {
    path: '/app/course-video',
    name: 'CourseVideo',
    component: CourseVideo,
    children: [
      {
        path: 'chat',
        component: ChatView, // 会话窗口作为子路由
      },
    ],
  },
  // 根路径重定向
  {
    path: '/',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
