<template>
  <div class="chat-view">
    <Header />
    <div class="main-content">
      <Menu />
      <router-view />
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
.chat-view {
  display: flex;
  flex-direction: column;
  min-height: 95vh;
  max-height: 100vh;
  max-width: 95vw;
  max-width: 100vw;
}

.main-content {
  flex: 1;
  display: flex;
}

.Menu {
  width: 200px; /* 可按需调整菜单宽度 */
  height: 100%; /* 让菜单高度填充父容器 */
}
</style>