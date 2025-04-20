<template>
  <div class="history-container" :class="{ 'hide-sidebar': !showSidebar }">
    <!-- 左侧历史会话列表 -->
    <div class="sidebar">
      <div class="session-list">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="session-item"
          :class="{ active: selectedSession?.id === session.id }"
          @click="selectSession(session)"
        >
          <div class="session-title">{{ session.title }}</div>
          <div class="session-meta">
            <span class="time">{{ formatTime(session.lastMessageTime) }}</span>
            <span class="count">{{ session.message_count }} 条对话</span>
          </div>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="error" class="error">加载失败: {{ error }}</div>
      </div>
    </div>

    <!-- 右侧会话内容区域 -->
    <div class="content-area" @click="handleContentClick">
      <!-- 会话详情 -->
      <div v-if="selectedSession" class="session-detail">
        <div class="detail-header">
          <button v-if="!showSidebar" @click.stop="showSidebar = true" class="back-btn">
            <i class="fas fa-chevron-left"></i>
            返回列表
          </button>
        </div>

        <!-- 历史消息 -->
        <div class="message-history">
          <div
            v-for="(msg, index) in selectedSession.messages"
            :key="index"
            :class="['message', { 'user-message': msg.role === 'user' }]"
          >
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>

        <!-- 继续对话按钮 -->
        <div class="continue-chat" style="margin-top: auto;">
          <button @click="continueChat" class="continue-button">
            继续对话
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <i class="fas fa-comments"></i>
        <p>选择左侧会话记录查看详情</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistorySession',
  data() {
    return {
      showSidebar: true, // 是否显示左侧边栏
      loading: false, // 加载状态
      error: null, // 错误信息
      sessions: [], // 历史会话列表
      selectedSession: null, // 当前选中的会话
    }
  },
  async mounted() {
    await this.loadSessions() // 加载历史会话列表
  },
  methods: {
    // 加载历史会话列表
    async loadSessions() {
      try {
        this.loading = true
        // TODO: 替换为实际后端接口,获取历史记录
        this.sessions = [
        {
          id: 1,
          title: "会话 1",
          lastMessageTime: Date.now() - 3600000, // 1 小时前
          message_count: 5,
        },
        {
          id: 2,
          title: "会话 2",
          lastMessageTime: Date.now() - 7200000, // 2 小时前
          message_count: 3,
        },
        {
          id: 3,
          title: "会话 3",
          lastMessageTime: Date.now() - 10800000, // 3 小时前
          message_count: 8,
        },
      ];
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 加载单个会话详情
    async selectSession(session) {
      try {
        // TODO: 替换为实际后端接口，获取单个历史会话详情
          this.selectedSession = {
          id: session.id,
          title: session.title,
          messages: [
            {
              role: "user",
              content: "你好！",
              timestamp: Date.now() - 300000, // 5 分钟前
            },
            {
              role: "assistant",
              content: "你好！有什么可以帮您的吗？",
              timestamp: Date.now() - 240000, // 4 分钟前
            },
            {
              role: "user",
              content: "请帮我解释一下设计模式。",
              timestamp: Date.now() - 180000, // 3 分钟前
            },
            {
              role: "assistant",
              content: "好的，设计模式是软件开发中的最佳实践...",
              timestamp: Date.now() - 120000, // 2 分钟前
            },
            {
              role: "user",
              content: "请帮我解释一下设计模式。",
              timestamp: Date.now() - 180000, // 3 分钟前
            },
            {
              role: "assistant",
              content: "好的，设计模式是软件开发中的最佳实践...",
              timestamp: Date.now() - 120000, // 2 分钟前
            },
            {
              role: "user",
              content: "请帮我解释一下设计模式。",
              timestamp: Date.now() - 180000, // 3 分钟前
            },
            {
              role: "assistant",
              content: "好的，设计模式是软件开发中的最佳实践...",
              timestamp: Date.now() - 120000, // 2 分钟前
            },
          ],
        };
      } catch (err) {
        console.error('加载会话失败:', err)
      }
    },


    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // 继续对话
    continueChat() {
      if (this.selectedSession && this.selectedSession.messages) {
        // 将选中的会话上下文存储到 sessionStorage
        sessionStorage.setItem('chatContext', JSON.stringify(this.selectedSession.messages));

        // 跳转到 NewSession 页面
        this.$router.push({ name: 'NewSession' });
      } else {
        console.error('未选中会话或会话内容为空');
      }
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.history-container {
  display: flex;
  height: 100%; /* 确保高度由父容器决定 */
  width: 100%; /* 确保宽度占满父容器 */
  background: #f5f5f7;
  margin: 0; /* 去掉外边距 */
  padding: 0; /* 去掉内边距 */
  box-sizing: border-box; /* 包括内边距和边框 */
  overflow: hidden; /* 防止内容溢出导致页面变长 */
}

/* 左侧边栏 */
.sidebar {
  width: 320px; /* 固定宽度 */
  background: white;
  border-right: 1px solid #e0e0e0;
  height: 100%; /* 填满父容器高度 */
  overflow-y: auto; /* 启用滚动条 */
  box-sizing: border-box;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}


/* 会话列表 */
.session-list {
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  box-sizing: border-box;
}

.session-item {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.session-item:hover {
  background: #f8f9fa;
}

.session-item.active {
  background: #e3f2fd;
}

.session-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.session-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

/* 右侧内容区域 */
.content-area {
  flex: 1; /* 占据剩余空间 */
  padding: 1rem;
  background: #f8f9fa;
  height: 100%; /* 填满父容器高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  box-sizing: border-box;
}

/* 会话详情 */
.session-detail {
  max-width: 800px;
  margin: 0 auto;
  height: 100%; /* 填满父容器高度 */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 启用滚动条 */
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.back-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  cursor: pointer;
}

/* 消息历史 */
.message-history {
  flex: 1; /* 占据父容器剩余空间 */
  overflow-y: auto; /* 启用垂直滚动条 */
  padding: 1rem 0;
  box-sizing: border-box;
}

.message {
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-content {
  font-size: 14px; /* 调整字体大小 */
  line-height: 1.5; /* 设置行高 */
  color: #333; /* 确保字体颜色一致 */
}

.user-message {
  background: #e3f2fd;
  margin-left: 20%;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
  margin-top: 0.5rem;
}

.continue-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-block;
}
.continue-chat {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>


