<template>
  <div class="main-container">
    <div class="left-panel" :class="{ hidden: isListHidden }">
      <!-- 视频列表 -->
      <div class="video-list" >
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="video-item"
          @click="selectVideo(video)"
        >
          <input
            type="checkbox"
            v-model="selectedVideos"
            :value="video"
            class="video-checkbox"
          />
          {{ video.title }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="video-actions">
        <button @click="uploadVideo" class="action-button">上传</button>
        <button @click="deleteVideos" class="action-button" :disabled="!selectedVideos.length">删除</button>
        <button @click="renameVideo" class="action-button" :disabled="selectedVideos.length !== 1">重命名</button>
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

    <!-- 视频播放器和提问窗口 -->
    <div class="video-and-question-container">
      <!-- 视频播放器区域 -->
      <div class="video-player-area" >
        <video
          id="video-player"
          class="video-js vjs-default-skin"
          controls
          preload="auto"
        ></video>
      </div>
      <!-- 提问窗口 -->
      <div class="question-box">
        <div
          class="question-input"
          contenteditable="true"
          @input="updateQuestion"
          data-placeholder="请输入您的问题，您可以选定视频片段提问获取更精确的答案。"
        ></div>
        <div class="time-inputs">
          <input
            type="text"
            v-model="startTime"
            placeholder="开始时间 (hh:mm:ss)"
            class="time-input"
          />
          <input
            type="text"
            v-model="endTime"
            placeholder="结束时间 (hh:mm:ss)"
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
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default {
  name: 'CourseVideo',
  data() {
    return {
      videos: [
        { id: 1, title: '课程视频 1', url: '/videos/video1.mp4' },
        { id: 3, title: '课程视频 3', url: '/videos/video3.mp4' }
      ],
      selectedVideo: null, // 当前选中的视频
      selectedVideos: [], // 当前选中的视频条目
      player: null, // video.js 播放器实例
      isListHidden: false, // 控制视频列表显示/隐藏
      question: '', // 提问窗口中的问题
      startTime: '', // 开始时间
      endTime: '' // 结束时间
    };
  },
  methods: {
    // 上传视频
    uploadVideo() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const newVideo = {
            id: Date.now(),
            title: file.name,
            url: URL.createObjectURL(file)
          };
          this.videos.push(newVideo);
        }
      };
      input.click();
    },
    // 删除选中的视频
    deleteVideos() {
      this.videos = this.videos.filter((video) => !this.selectedVideos.includes(video));
      this.selectedVideos = [];
    },
    // 重命名视频
    renameVideo() {
      if (this.selectedVideos.length === 1) {
        const video = this.selectedVideos[0];
        const newName = prompt('请输入新的视频名称：', video.title);
        if (newName) {
          video.title = newName;
        }
      }
    },
    // 选择视频
    selectVideo(video) {
      this.selectedVideo = video;
      if (this.player) {
        this.player.src({ type: 'video/mp4', src: video.url });
        this.player.play();
      }
    },
    toggleList() {
      this.isListHidden = !this.isListHidden; // 切换列表显示状态
    },
    askQuestion() {
      if (this.question.trim()) {
        // 转换时间为秒
        const convertToSeconds = (time) => {
          const parts = time.split(':').map(Number);
          if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
          } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
          } else if (parts.length === 1) {
            return parts[0];
          }
          return 0;
        };

        const startTimeInSeconds = this.startTime ? convertToSeconds(this.startTime) : null;
        const endTimeInSeconds = this.endTime ? convertToSeconds(this.endTime) : null;

        // 跳转到 newSession 界面并传递数据
        this.$router.push({
          name: 'NewSession',
          query: {
            question: this.question,
            name: this.selectedVideo ? this.selectedVideo.title : null,
            start: startTimeInSeconds,
            end: endTimeInSeconds,
            type: 'video',
          }
        });

        // 清空输入框
        this.question = '';
        const inputDiv = this.$el.querySelector('.question-input');
        if (inputDiv) inputDiv.innerHTML = '';
      }
    },
    updateQuestion(event) {
      this.question = event.target.innerText; // 同步内容到 question 数据
    },
  },
  mounted() {
    // 初始化 video.js 播放器
    this.player = videojs('video-player', {
      controls: true,
      autoplay: false,
      preload: 'auto'
    });
    // 恢复播放状态
    const savedState = sessionStorage.getItem('videoState');
    if (savedState) {
      const { id, currentTime } = JSON.parse(savedState);
      const video = this.videos.find(v => v.id === id);
      if (video) {
        this.selectedVideo = video;
        this.player.src({ type: 'video/mp4', src: video.url });

        // 等视频加载完再跳转时间点
        this.player.one('loadedmetadata', () => {
          this.player.currentTime(currentTime);
        });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.player && this.selectedVideo) {
      const currentTime = this.player.currentTime();
      sessionStorage.setItem('videoState', JSON.stringify({
        id: this.selectedVideo.id,
        currentTime: currentTime
      }));
    }
    next();
  },
  beforeUnmount() {
    // 销毁 video.js 播放器实例
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100%;
  position: relative;
  overflow: hidden; /* 隐藏超出容器的内容 */
}

.left-panel {
  width: 30%; /* 左侧界面宽度 */
  display: flex;
  flex-direction: column; /* 垂直布局 */
  background: #ffffffbc;
  overflow: hidden;
  position: relative; /* 为了定位按钮 */
  transition: transform 0.3s ease;
}

.left-panel.hidden {
  transform: translateX(-100%); /* 隐藏左侧界面 */
}

.video-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.video-item {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
}

.video-item:hover {
  background: #e3f2fd;
}

.video-checkbox {
  margin-right: 0.5rem;
}

.video-actions {
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

.video-and-question-container {
  flex: 1;
  display: flex;
  flex-direction: column; /* 上下布局 */
  height: 100%;
  margin: 0; /* 去掉外边距 */
  padding: 0; /* 去掉内边距 */
  transition: margin-left 0.3s ease;
}

.video-player-area {
  flex: 1; /* 播放器区域占据更多空间 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  overflow: hidden; /* 隐藏超出内容 */
  margin: 0; /* 去掉外边距 */
  padding: 0; /* 去掉内边距 */
  transition: width 0.3s ease;
}
#video-player {
  width: 100%; /* 默认占满父容器宽度 */
  height: 100%; /* 保持宽高比 */
}

.question-box {
  display: flex;
  flex-direction: column; /* 上下布局 */
  padding: 0em;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  width: 100%; /* 宽度与播放器区域一致 */
  box-sizing: border-box; /* 包括内边距在内计算宽度 */
  height: 80px; /* 调整提问窗口的总高度 */
  flex-shrink: 0; /* 防止被压缩 */
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
  margin-bottom: 0rem;
  position: relative;
}

.question-input:empty::before {
  content: attr(data-placeholder); /* 使用 data-placeholder 属性作为占位符 */
  color: #aaa; /* 占位符颜色 */
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  pointer-events: none; /* 占位符不可点击 */
}

.question-button {
  width: 100px; /* 固定宽度 */
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
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 内容两端对齐 */
  gap: 0.5rem; /* 输入框和按钮之间的间距 */
  margin-bottom: 0; /* 去掉多余间距 */
}

.time-input {
  flex: 1; /* 时间输入框占据剩余空间 */
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

.left-panel.hidden + .video-and-question-container {
  margin-left: -30%;
}

.left-panel:not(.hidden) + .video-and-question-container {
  margin-left: 0;
}
.hide-button {
  right: -15px; /* 初始状态，位于分界线右侧 */
}

.show-button {
  left: -15px; /* 隐藏内容后，移动到左侧边栏的右侧边界 */
}
</style>
