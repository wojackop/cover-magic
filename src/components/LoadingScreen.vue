<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="loading-logo">
        <div class="loading-spinner"></div>
        <div class="loading-icon">
          <Icon icon="fluent-emoji-flat:magic-wand" class="magic-icon" />
        </div>
      </div>
      <div class="loading-text">封面魔法加载中...</div>
      <div class="loading-progress">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from "@iconify/vue";

// LoadingScreen 组件
// 用于显示全屏加载动画，带进度条和图标动画效果

// 模拟加载进度
const progress = ref(0);

onMounted(() => {
  const interval = setInterval(() => {
    progress.value += Math.random() * 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval);
    }
  }, 200);
});
</script>

<style scoped>
/* 加载动画容器 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  z-index: 9999;
  animation: gradientAnimation 10s ease infinite;
  background-size: 400% 400%;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  backdrop-filter: blur(5px);
  padding: 40px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 加载图标容器 */
.loading-logo {
  position: relative;
  width: 80px;
  height: 80px;
}

/* 旋转加载图标 */
.loading-spinner {
  width: 80px;
  height: 80px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  position: absolute;
  top: 0;
  left: 0;
}

/* 中心图标 */
.loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.magic-icon {
  font-size: 32px;
  color: white;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
  animation: pulse 2s ease-in-out infinite;
}

/* 加载文字 */
.loading-text {
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeInOut 2s ease-in-out infinite;
}

/* 进度条容器 */
.loading-progress {
  width: 200px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

/* 进度条 */
.progress-bar {
  height: 100%;
  background-color: #ffffff;
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

/* 动画定义 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
