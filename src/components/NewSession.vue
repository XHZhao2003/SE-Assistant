<template>
  <div class="new-session-container">
    <!-- 简介区域 -->
    <div
      class="intro-section"
      v-if="!hasStartedChat"
    >
      <h2>智能问答助手</h2>
      <div class="intro-content">
        <p>🎯 我可以帮助您：</p>
        <ul>
          <li>解答软件工程相关问题</li>
          <li>解释设计模式与架构原理</li>
          <li>分析代码逻辑和UML图</li>
          <li>提供最佳实践建议</li>
        </ul>
        <p>💡 温馨提示：请尽量清晰地描述您的问题<br>
          &emsp;&ensp;Shift + Enter 换行，Enter 发送
        </p>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-section">
      <!-- 消息列表 -->
      <div class="message-list" ref="messageList">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', { 'user-message': msg.isUser }]"
        >
          <div class="message-bubble">
            <div class="message-content">{{ msg.content }}</div>
            <div class="message-meta">
              <span v-if="msg.isUser">用户</span>
              <span v-else>助手</span>
              <span>{{ msg.timestamp }}</span>
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <div class="dot-flashing"></div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-container">
          <textarea
            v-model="inputText"
            placeholder="请输入您的问题..."
            @keydown.enter.exact.prevent="handleSubmit"
            :disabled="isLoading"
          ></textarea>
          <button
            @click="handleSubmit"
            :disabled="!inputText.trim() || isLoading"
            class="send-button"
          >
            <span v-if="!isLoading">发送</span>
            <div v-else class="loading-dots"></div>
          </button>
          <button
            @click="startNewSession"
            :disabled="isLoading"
            class="new-session-button"
          >
            新会话
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewSession',
  data() {
    return {
      inputText: '',
      messages: [],
      isLoading: false,
      hasStartedChat: false // 标记是否开始会话
    };
  },
  created() {
    // 从 sessionStorage 中获取上下文
    const context = sessionStorage.getItem('chatContext');
    if (context) {
      try {
        const parsedMessages = JSON.parse(context).map((msg) => ({
          ...msg,
          timestamp: this.formatTime(new Date(msg.timestamp)), // 格式化时间
          isUser: msg.role === 'user' // 根据角色区分用户和助手
        }));
        this.messages = [...parsedMessages];
        this.hasStartedChat = true;
      } catch (error) {
        console.error('解析上下文失败:', error);
      }
    } else {
      // 如果没有上下文，则初始化为新会话
      this.messages = [
        {
          content: '您好！我是智能问答助手，有什么可以帮您？',
          role: 'assistant',
          isUser: false,
          timestamp: this.formatTime(new Date())
        }
      ];
      this.hasStartedChat = false;
    }
  },
  mounted() {
    const { question, name, start, end, type, userInput, mermaidCode} = this.$route.query;
    if (question) {
      // 将提问内容作为用户消息添加到消息列表
      const userMessage = {
        content: question,
        role: 'user',
        isUser: true,
        timestamp: this.formatTime(new Date())
      };
      this.messages.push(userMessage);
      // 隐藏简介区域
      this.hasStartedChat = true;
      // 根据类别调用对应的处理函数
      if (type === 'slide') {
        this.processResponse(this.mockApiCall3(question, name, start, end));
      } else if (type === 'video') {
        this.processResponse(this.mockApiCall2(question, name, start, end));
      } else if (type === 'uml') {
        this.processResponse(this.mockApiCall4(question,  userInput, mermaidCode));
      }
    }
    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    async handleSubmit() {
      if (!this.inputText.trim() || this.isLoading) return;

      try {
        const userMessage = {
          content: this.inputText.trim(),
          role: 'user', // 明确角色为用户
          isUser: true,
          timestamp: this.formatTime(new Date())
        };
        this.messages.push(userMessage);

        this.isLoading = true;
        this.inputText = '';
        this.hasStartedChat = true;
        // 模拟 API 调用
        const response = await this.mockApiCall(userMessage.content);

        const assistantMessage = {
          content: response,
          role: 'assistant', // 明确角色为助手
          isUser: false,
          timestamp: this.formatTime(new Date())
        };
        this.messages.push(assistantMessage);

        // 将上下文存储到 sessionStorage
        sessionStorage.setItem('chatContext', JSON.stringify(this.messages));
      } catch (error) {
        console.error('请求失败:', error);
        this.messages.push({
          content: '抱歉，暂时无法处理您的请求，请稍后再试。',
          role: 'assistant',
          isUser: false,
          timestamp: this.formatTime(new Date())
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async processResponse(apiCall) {
      try {
        this.isLoading = true;
        const response = await apiCall;
        this.messages.push({
          content: response,
          role: 'assistant',
          isUser: false,
          timestamp: this.formatTime(new Date())
        });
        sessionStorage.setItem('chatContext', JSON.stringify(this.messages));
      } catch (e) {
        this.messages.push({
          content: '抱歉，暂时无法处理您的请求，请稍后再试。',
          role: 'assistant',
          isUser: false,
          timestamp: this.formatTime(new Date())
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    // TODO：API调用接口
    mockApiCall(question) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`已收到您的问题：${question}\n（这是模拟回复，实际需要对接后端 API）`);
        }, 1500);
      });
    },

    mockApiCall2(question, video, startTime, endTime) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            `已收到您的问题：${question}\n视频名称：${video || '无'}\n开始时间：${startTime || '无'}\n结束时间：${endTime || '无'}\n（这是模拟回复，实际需要对接后端 API）`
          );
        }, 1500);
      });
    },

    mockApiCall3(question, slide, startPage, endPage) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            `已收到您的问题：${question}\nPDF名称：${slide || '无'}\n开始页码：${startPage || '无'}\n结束页码：${endPage || '无'}\n（这是模拟回复，实际需要对接后端 API）`
          );
        }, 1500);
      });
    },

    mockApiCall4(question, userInput, mermaidCode) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            `已收到您的问题：${question}\n用户输入：${userInput || '无'}\nmermaidCode：${mermaidCode || '无'}\n（这是模拟回复，实际需要对接后端 API）`
          );
        }, 1500);
      });
    },

    // 格式化时间
    formatTime(date) {
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messageList;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    async startNewSession() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;


        await this.mockNewSessionApiCall();

        // 清空消息列表并初始化新会话
        this.messages = [
          {
            content: '您好！我是智能问答助手，有什么可以帮您？',
            role: 'assistant',
            isUser: false,
            timestamp: this.formatTime(new Date())
          }
        ];
        this.hasStartedChat = false;

        // 清空上下文存储
        sessionStorage.removeItem('chatContext');
      } catch (error) {
        console.error('新会话启动失败:', error);
        alert('新会话启动失败，请稍后再试！');
      } finally {
        this.isLoading = false;
      }
    },
    //  TODO：通知后端开始新会话，模拟新会话 API 调用
    mockNewSessionApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('新会话已启动');
        }, 1000);
      });
    },
  }
};
</script>

<style scoped>
/* 主容器样式 */
.new-session-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* 填满父容器高度 */
  width: 100%; /* 填满父容器宽度 */
  margin: 0; /* 去掉外边距 */
  background-color: #ebebebbc;
  box-sizing: border-box; /* 包括内边距在内计算宽高 */
  overflow: auto;
}

/* 简介区域 */
.intro-section {
  padding: 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
}

/* 聊天主区域 */
.chat-section {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  flex-direction: column;
  width: 100%; /* 填满父容器宽度 */
  padding: 1rem;
  box-sizing: border-box;
  border: 1px solid #f4f9ff; /* 添加白色边框 */
  border-radius: 40px; /* 可选：添加圆角 */
  background-color: #f4f9ff; /* 背景色 */
  overflow: auto;
}

/* 消息列表动态高度 */
.message-list {
  flex: 1; /* 消息列表占据剩余空间 */
  overflow: auto;
  padding: 1rem 0;
  box-sizing: border-box;
}

/* 消息气泡样式 */
.message-item {
  display: flex;
  margin-bottom: 1rem;
}

.message-item.user-message {
  justify-content: flex-end; /* 用户消息靠右 */
}

.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  line-height: 1.5;
}

.message-item.user-message .message-bubble {
  background-color: #d1e7ff; /* 用户消息背景色 */
  color: #333;
  text-align: left; /* 用户消息内容左对齐 */
}

.message-item:not(.user-message) .message-bubble {
  background-color: #ffffff; /* 系统消息背景色 */
  color: #333;
  text-align: left;
}

/* 输入区域固定底部 */
.input-section {
  flex-shrink: 0; /* 防止输入框被压缩 */
  padding: 1rem;
  background: rgb(255, 255, 255);
  border-radius: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
  position: sticky; /* 固定在父容器底部 */
  bottom: 0; /* 距离底部 0 */
}

.input-container {
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  resize: none;
}

.send-button {
  padding: 10px 20px;
  font-size: 14px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #3498db;
}

/* 新会话按钮样式 */
.new-session-button {
  padding: 10px 12px;
  font-size: 14px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.new-session-button:hover {
  background-color: #3498db;
}
</style>
