<template>
  <div class="menu-container">
    <!-- 平铺的五个独立菜单项 -->
    <router-link
      v-for="item in menuItems"
      :key="item.path"
      :to="getMenuLink(item)"
      class="menu-item"
    >
      <i :class="`item-icon ${item.icon}`"></i>
      <span class="item-text">{{ item.text }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        {
          path: "/app/new-session",
          icon: "fas fa-comments",
          text: "会话窗口",
          clearContext: true, // 标记是否清除上下文
        },
        {
          path: "/app/history-session",
          icon: "fas fa-history",
          text: "历史会话",
        },
        {
          path: "/app/course-video",
          icon: "fas fa-video",
          text: "课程视频",
        },
        {
          path: "/app/course-slide",
          icon: "fas fa-file-alt",
          text: "课程讲义",
        },
        {
          path: "/app/uml-playground",
          icon: "fas fa-project-diagram",
          text: "UML 演练场",
        },
      ],
    };
  },
  methods: {
    getMenuLink(item) {
      // 如果需要清除上下文，则不携带 query 参数
      if (item.clearContext) {
        return { path: item.path };
      }
      // 动态构建带有上下文的路由链接
      const currentContext = this.$route.query.context || null;
      return { path: item.path, query: { context: currentContext } };
    },
  },
};
</script>

<style scoped>
/* 菜单容器 */

.menu-container {

  width: 220px;
  background-color: #eaf4fc;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 8px;
}

/*
.menu-container {
  position: fixed;
  top: 50px;
  left: 0;
  width: 220px;
  height: calc(100vh - 60px);
  background-color: #eaf4fc;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  border-radius: 8px;
  z-index: 999;
}
*/
/* 菜单项样式（独立矩形框） */
.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background-color: white;
  border: 2px solid #bcdffb; /* 边框颜色 */
  border-radius: 8px;
  color: #2c3e50;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

/* 图标样式 */
.item-icon {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  color: #3498db; /* 图标颜色 */
}

/* 悬停效果 */
.menu-item:hover {
  transform: translateX(4px); /* 右移效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #3498db; /* 悬停边框色 */
}

/* 路由激活状态 */
.menu-item.router-link-active {
  background-color: #d6e9f8;
  border-color: #3498db;
  color: #1a73e8;
  font-weight: bold;
}
</style>
