<template>
  <div class="uml-container">
    <!-- 左侧：文本输入框 -->
    <div class="left-panel">
      <textarea
        v-model="userInput"
        placeholder="请输入描述文本，例如：公司有多个部门，每个部门有多个员工..."
        class="input-box"
      ></textarea>
      <button @click="generateUML" class="generate-button">生成 UML</button>
    </div>

    <!-- 右侧：UML 渲染框和提问框 -->
    <div class="right-panel">
      <div v-if="isLoading" class="loading">正在生成图表...</div>
      <!-- UML 渲染框 -->
      <div class="uml-render-container">
        <div ref="umlRender" class="mermaid-render-box"></div>
      </div>

      <!-- 提问框 -->
      <div class="question-box">
        <div
          class="question-input"
          contenteditable="true"
          @input="updateQuestion"
          data-placeholder="请输入您的问题..."
        ></div>
        <button @click="askQuestion" class="question-button">提问</button>
      </div>
    </div>
  </div>
</template>

<script>
import mermaid from 'mermaid';

export default {
  name: 'UMLPlayground',
  data() {
    return {
      userInput: '', // 用户输入的文本
      mermaidCode: '', // 后端返回的 Mermaid 代码
      question: '', // 提问框中的问题
      isLoading: false, // 加载状态
    };
  },
  methods: {
    async generateUML() {
      if (!this.userInput.trim()) {
        alert('请输入描述文本！');
        return;
      }

      this.isLoading = true; // 开始加载
      try {
        // TODO：模拟后端接口调用，根据用户输入生成 Mermaid 代码。
        const response = await fetch('/api/generate-mermaid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: this.userInput }),
        });

        if (!response.ok) {
          throw new Error('生成失败，请检查后端接口！');
        }

        const data = await response.json();
        this.mermaidCode = data.mermaidCode;

        // 使用 Mermaid 渲染 UML
        this.renderUML();
      } catch (error) {
        console.error('生成 UML 失败:', error);

        // 设置默认的 Mermaid 代码
        this.mermaidCode = `
          classDiagram
            Animal <|-- Duck
            Animal <|-- Fish
            Animal <|-- Zebra
            Animal : +int age
            Animal : +String gender
            Animal: +isMammal()
            Animal: +mate()
        `;

        alert('生成失败，使用默认的 Mermaid 代码进行测试！');
        this.renderUML();
      } finally {
        this.isLoading = false; // 结束加载
      }
    },
    async renderUML() {
      if (!this.mermaidCode.trim()) {
        alert('无有效的 Mermaid 代码！');
        return;
      }

      const targetEl = this.$refs.umlRender;
      if (!targetEl) {
        console.error('渲染容器未找到！');
        alert('渲染容器未找到，请检查 DOM 结构！');
        return;
      }

      try {
        // 异步渲染 Mermaid SVG 图
        const { svg } = await mermaid.render('umlDiagram', this.mermaidCode);

        // 清空旧内容后插入新的 SVG
        targetEl.innerHTML = svg;
      } catch (error) {
        console.error('渲染 UML 失败:', error);
        alert('渲染 UML 失败，请检查 Mermaid 代码！');
      }
    },
    askQuestion() {
      if (!this.question.trim()) {
        alert('请输入问题！');
        return;
      }

      // 跳转到 NewSession 界面并传递参数
      this.$router.push({
        name: 'NewSession',
        query: {
          question: this.question,
          userInput: this.userInput,
          mermaidCode: this.mermaidCode,
          type: 'uml',
        },
      });

      // 清空输入框
      this.question = '';
      const inputDiv = this.$el.querySelector('.question-input');
      if (inputDiv) inputDiv.innerHTML = '';
    },
    updateQuestion(event) {
      this.question = event.target.innerText;
    },
  },
  mounted() {
    // 初始化 Mermaid
    mermaid.initialize({
    startOnLoad: false, // 由我们手动控制渲染
    theme: 'default',
    });
  },
};
</script>

<style scoped>
.uml-container {
  display: flex;
  height: 100%;
  box-sizing: border-box;
}

.left-panel {
  width: 30%;
  display: flex;
  flex-direction: column;
  padding: 0rem;
  background: #f8f9fa;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
}

.input-box {
  flex: 1;
  padding: 1rem;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 0rem;
}

.generate-button {
  padding: 0.5rem 1rem;
  font-size: 16px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.generate-button:hover {
  background-color: #2980b9;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0rem;
  box-sizing: border-box;
}

.loading {
  color: #3498db;
  font-size: 16px;
  margin-bottom: 10px;
}

.uml-render-container {
  flex: 2;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  overflow: auto;
}

.uml-render-box {
  width: 100%;
  height: 100%;
}

.question-box {
  display: flex;
  flex-direction: row;
  padding: 0rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.question-input {
  flex: 1;
  padding: 0.8rem;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 60px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  outline: none;
  background: #fff;
  box-sizing: border-box;
}

.question-input:empty::before {
  content: attr(data-placeholder);
  color: #aaa;
}

.question-button {
  padding: 0.3rem 0.8rem;
  font-size: 14px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.question-button:hover {
  background: #2980b9;
}
</style>
