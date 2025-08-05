<template>
  <div class="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 z-[9999] animate-gradient bg-[length:400%_400%]">
    <div class="flex flex-col items-center gap-6 backdrop-blur-md p-10 rounded-2xl bg-white/10 shadow-lg border border-white/20">
      <div class="relative w-20 h-20">
        <div class="w-20 h-20 border-5 border-white/30 rounded-full border-t-white absolute inset-0 animate-spin-slow"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <Icon icon="fluent-emoji-flat:magic-wand" class="text-3xl text-white drop-shadow-glow animate-pulse-slow" />
        </div>
      </div>
      <div class="text-white text-xl font-bold tracking-wide drop-shadow-md animate-fade-in-out">封面魔法加载中...</div>
      <div class="w-50 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div class="h-full bg-white rounded-full transition-all duration-300 shadow-glow" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, onMounted } from 'vue';

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
/* 自定义动画 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes fade-in-out {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 自定义工具类 */
.animate-gradient {
  animation: gradient 10s ease infinite;
}

.animate-spin-slow {
  animation: spin-slow 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-fade-in-out {
  animation: fade-in-out 2s ease-in-out infinite;
}

.drop-shadow-glow {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}

.shadow-glow {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.border-5 {
  border-width: 5px;
}

.w-50 {
  width: 200px;
}
</style>
