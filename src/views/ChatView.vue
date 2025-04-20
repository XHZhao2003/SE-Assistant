<template>
  <div class="chat-view">
    <Header />
    <div class="main-content">
      <Menu />
      <div class="content-area">
        <router-view /> <!-- 渲染子路由内容 -->
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Menu from '../components/Menu.vue'

export default {
  components: {
    Header,
    Menu,
  },
}
</script>

<style scoped>
/* 主容器样式 */
.chat-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5; /* 背景色 */
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden; /* 防止内容溢出 */
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #ebebebbc;
  gap: 20px;
  box-sizing: border-box;
  overflow: auto;
  height: calc(100vh - 60px);
}

/* Header 样式 */

.chat-view > Header {
  background-color: #3498db; /* 蓝色背景 */
  color: #ffffff; /* 白色字体 */
  padding: 15px 20px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-view > Header a {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.chat-view > Header a:hover {
  color: #dff9fb; /* hover 效果 */
}
</style>
