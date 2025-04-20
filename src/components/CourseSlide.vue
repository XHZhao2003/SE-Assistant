<template>
  <div class="main-container">
    <div class="left-panel" :class="{ hidden: isListHidden }">
      <!-- PDF 列表 -->
      <div class="pdf-list">
        <div
          v-for="(pdf, index) in pdfs"
          :key="index"
          class="pdf-item"
          @click="selectPdf(pdf)"
        >
          <input
            type="checkbox"
            v-model="selectedPdfs"
            :value="pdf"
            class="pdf-checkbox"
          />
          {{ pdf.title }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="pdf-actions">
        <button @click="uploadPdf" class="action-button">上传</button>
        <button @click="deletePdfs" class="action-button" :disabled="!selectedPdfs.length">删除</button>
        <button @click="renamePdf" class="action-button" :disabled="selectedPdfs.length !== 1">重命名</button>
      </div>

      <!-- 半圆形隐藏按钮 -->
      <div
        class="toggle-button hide-button"
        v-if="!isListHidden"
        @click="toggleList"
      >
        <span>◀</span>
      </div>
    </div>

    <!-- PDF 渲染和提问窗口 -->
    <div class="pdf-and-question-container">
      <!-- PDF 渲染区域 -->
      <div class="pdf-render-area">
        <div class="pdf-container" ref="pdfContainer">
          <canvas ref="pdfCanvas"></canvas>
        </div>

      </div>
      <div class="controls">
          <button @click="prevPage" :disabled="currentPage <= 1">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
      </div>
      <!-- 提问窗口 -->
      <div class="question-box">
        <div
          class="question-input"
          contenteditable="true"
          @input="updateQuestion"
          data-placeholder="请输入您的问题，您可以选定PDF片段提问获取更精确的答案。"
        ></div>
        <div class="time-inputs">
          <input
            type="text"
            v-model="startPage"
            placeholder="开始页码"
            class="time-input"
          />
          <input
            type="text"
            v-model="endPage"
            placeholder="结束页码"
            class="time-input"
          />
          <button @click="askQuestion" class="question-button">提问</button>
        </div>
      </div>

      <!-- 半圆形显示按钮 -->
      <div
        class="toggle-button show-button"
        v-if="isListHidden"
        @click="toggleList"
      >
        <span>▶</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist';

export default {
  name: 'CourseSlide',
  data() {
    return {
      pdfs: [
        { id: 1, title: 'lecture1', url: '/pdfs/lecture1.pdf' },
        { id: 2, title: 'lecture2', url: '/pdfs/lecture2.pdf' },
      ],
      selectedPdf: null, // 当前选中的 PDF
      selectedPdfs: [], // 当前选中的 PDF 条目
      isListHidden: false, // 控制 PDF 列表显示/隐藏
      question: '', // 提问窗口中的问题
      startPage: '', // 开始页码
      endPage: '', // 结束页码
      currentPage: 1, // 当前页码
      totalPages: 0, // 总页数
    };
  },
  methods: {
    // 上传 PDF
    uploadPdf() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const newPdf = {
            id: Date.now(),
            title: file.name,
            url: URL.createObjectURL(file),
          };
          this.pdfs.push(newPdf);
        }
      };
      input.click();
    },
    // 删除选中的 PDF
    deletePdfs() {
      this.pdfs = this.pdfs.filter((pdf) => !this.selectedPdfs.includes(pdf));
      this.selectedPdfs = [];
    },
    // 重命名 PDF
    renamePdf() {
      if (this.selectedPdfs.length === 1) {
        const pdf = this.selectedPdfs[0];
        const newName = prompt('请输入新的 PDF 名称：', pdf.title);
        if (newName) {
          pdf.title = newName;
        }
      }
    },

    handleResize() {
      if (this.pdfDoc) {
        this.renderPage(this.currentPage);
      }
    },
    // 选择 PDF
    async selectPdf(pdf) {
      this.selectedPdf = pdf;
      this.currentPage = 1; // 重置到第一页
      this.loadPdf(pdf.url);

      // 保存 PDF 信息到 localStorage
      localStorage.setItem('lastSelectedPdfId', pdf.id);
      localStorage.setItem('lastPage', 1);
    },
    async loadPdf(url) {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        this.pdfDoc = await loadingTask.promise;
        this.totalPages = this.pdfDoc.numPages;
        this.renderPage(this.currentPage);
      } catch (error) {
        console.error('加载 PDF 失败:', error);
      }

    },
    async renderPage(pageNumber) {
      if (!this.pdfDoc) {
        console.error('PDF 文档尚未加载');
        return;
      }
      try {
        this.currentPage = pageNumber;
        // 保存当前页码
        localStorage.setItem('lastPage', pageNumber);

        const page = await this.pdfDoc.getPage(pageNumber);
        const canvas = this.$refs.pdfCanvas;
        const context = canvas.getContext('2d');

        const container = this.$refs.pdfContainer;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const viewport = page.getViewport({ scale: 1 });
        const widthScale = containerWidth / viewport.width;
        const heightScale = containerHeight / viewport.height;
        const scaleFactor = Math.min(widthScale, heightScale);

        const scaledViewport = page.getViewport({ scale: scaleFactor });
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('渲染页面失败:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderPage(this.currentPage);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderPage(this.currentPage);
      }
    },
    toggleList() {
      this.isListHidden = !this.isListHidden;
    },
    askQuestion() {
      if (this.question.trim()) {
        this.$router.push({
          name: 'NewSession',
          query: {
            question: this.question,
            name: this.selectedPdf ? this.selectedPdf.title : null,
            start: this.startPage ? this.startPage : this.currentPage,
            end: this.endPage ? this.endPage : this.currentPage,
            type: 'slide',
          },
        });

        this.question = '';
        const inputDiv = this.$el.querySelector('.question-input');
        if (inputDiv) inputDiv.innerHTML = '';
      }
    },
    updateQuestion(event) {
      this.question = event.target.innerText;
    },
  },
  mounted() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
    window.addEventListener('resize', this.handleResize);

      // 恢复上次状态
    const lastId = localStorage.getItem('lastSelectedPdfId');
    const lastPage = parseInt(localStorage.getItem('lastPage'), 10);

    if (lastId) {
      const lastPdf = this.pdfs.find(p => p.id === Number(lastId));
      if (lastPdf) {
        this.selectedPdf = lastPdf;
        this.currentPage = lastPage || 1;
        this.loadPdf(lastPdf.url); // loadPdf 内会自动触发 renderPage
      }
    }
  },
  beforeCreate() {
    this.pdfDoc = null; // 定义 pdfDoc 为类属性
  },
  beforeDestroy() {
  window.removeEventListener('resize', this.handleResize);
},
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.left-panel {
  width: 30%;
  display: flex;
  flex-direction: column;
  background: #ffffff44;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease;
  border: 1px solid #ffffff;
}

.left-panel.hidden {
  transform: translateX(-100%);
}

.pdf-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.pdf-item {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
  border-right: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
}

.pdf-item:hover {
  background: #e3f2fd;
}

.pdf-checkbox {
  margin-right: 0.5rem;
}

.pdf-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem;
}

.action-button {
  padding: 0.5rem 1rem;
  font-size: 14px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  background: #2980b9;
}

.pdf-and-question-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pdf-render-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  overflow: hidden;
  position: relative;
}

.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 0px;
  padding: 0.1rem 1rem;
  background: rgba(255, 255, 255, 0.9); /* 半透明背景，提升可读性 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 1px solid #ddd;
}

.question-box {
  display: flex;
  flex-direction: column;
  padding: 0rem;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
}

.question-input {
  flex: 1;
  padding: 0.5rem;
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
  width: 100px;
  padding: 0.3rem 0.8rem;
  font-size: 14px;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: auto;
}

.question-button:hover {
  background: #2980b9;
}

.time-inputs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.time-input {
  flex: 1;
  padding: 0.3rem;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.toggle-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.toggle-button:hover {
  background: #2980b9;
}

.left-panel.hidden + .pdf-and-question-container {
  margin-left: -30%;
}

.left-panel:not(.hidden) + .pdf-and-question-container {
  margin-left: 0;
}

.hide-button {
  right: -15px;
}

.show-button {
  left: -15px;
}
</style>

