<template>
  <div>
    <!-- 主题选择弹窗 -->
    <n-modal 
      v-model:show="showThemeSelector" 
      preset="card"
      style="width: 90%; max-width: 900px;"
      title="选择主题"
      :bordered="false"
      size="huge"
      :segmented="{ content: true, footer: 'soft' }"
      :style="actualDarkMode ? 'background-color: #1f1f1f; color: #e5e5e5;' : ''"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div 
          v-for="theme in availableThemes" 
          :key="theme.id"
          class="rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border-2 border-transparent hover:-translate-y-1 hover:shadow-lg shadow-md"
          :class="{ 'theme-card-active': selectedThemeId === theme.id }"
          @click="selectTheme(theme)"
        >
          <div class="h-36 flex flex-col items-center justify-center p-4 relative" :style="getThemePreviewStyle(theme)">
            <div v-if="theme.previewIcon" class="text-5xl mb-2">
              <Icon :icon="theme.previewIcon" />
            </div>
            <div class="text-base font-bold">{{ theme.name }}</div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-800">
            <div class="font-bold mb-1">{{ theme.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ theme.description }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <n-button :ghost="actualDarkMode" @click="closeThemeSelector">取消</n-button>
          <n-button type="primary" :disabled="!selectedThemeId" @click="applySelectedTheme">应用主题</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { NModal, NButton, useOsTheme } from 'naive-ui';
import { ref, computed, inject } from 'vue';

// 获取当前主题状态
const osThemeRef = useOsTheme();
const isDarkMode = ref(osThemeRef.value === 'dark');
// 尝试从父组件注入主题状态
const injectedDarkMode = inject('isDarkMode', ref(false));
// 使用注入的值或默认值
const actualDarkMode = computed(() => {
  return typeof injectedDarkMode === 'object' ? injectedDarkMode.value : isDarkMode.value;
});

// 定义主题类型
interface Theme {
  id: string;
  name: string;
  description: string;
  previewBg: string;
  previewIcon?: string;
  previewTextColor: string;
  config: any;
}

// 可用主题列表
const availableThemes = ref<Theme[]>([
  {
    id: 'default',
    name: '默认主题',
    description: '简约黑色背景配合清晰文字的经典设计',
    previewBg: 'linear-gradient(to bottom right, #000000, #333333)',
    previewIcon: 'fluent-emoji-flat:four-leaf-clover',
    previewTextColor: '#ffffff',
    config: {
      background: {
        type: 'color',
        color: '#000000',
        opacity: 100,
        gradient: {
          startColor: '#000000',
          endColor: '#333333',
          direction: 'to-bottom-right'
        }
      },
      icon: {
        code: 'fluent-emoji-flat:four-leaf-clover',
        size: 240,
        shadowSize: 100,
        shadowColor: '#ffffff',
        position: { x: 50, y: 50 }
      },
      title: {
        text: '默认   主题',
        font: 'Maple Mono CN',
        size: 180,
        color: '#ffffff',
        position: { x: 50, y: 50 },
        effects: { bold: true, italic: false, uppercase: false }
      },
      watermark: {
        text: '@baiwumm',
        font: 'Maple Mono CN',
        size: 50,
        color: '#ffffff',
        opacity: 80,
        position: { x: 98, y: 98 },
        effects: { bold: true, italic: true, uppercase: false }
      }
    }
  },
  {
    id: 'blue-gradient',
    name: '蓝色渐变',
    description: '清新蓝色渐变背景，现代简约风格',
    previewBg: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
    previewIcon: 'fluent-emoji-flat:blue-heart',
    previewTextColor: '#ffffff',
    config: {
      background: {
        type: 'gradient',
        opacity: 100,
        gradient: {
          startColor: '#3b82f6',
          endColor: '#8b5cf6',
          direction: 'to-bottom-right'
        }
      },
      icon: {
        code: 'fluent-emoji-flat:blue-heart',
        size: 240,
        shadowSize: 100,
        shadowColor: '#ffffff',
        position: { x: 50, y: 50 }
      },
      title: {
        text: '蓝色   渐变',
        font: 'Maple Mono CN',
        size: 180,
        color: '#ffffff',
        position: { x: 50, y: 50 },
        effects: { bold: true, italic: false, uppercase: false }
      },
      watermark: {
        text: '@baiwumm',
        font: 'Maple Mono CN',
        size: 50,
        color: '#ffffff',
        opacity: 80,
        position: { x: 98, y: 98 },
        effects: { bold: true, italic: true, uppercase: false }
      }
    }
  },
  {
    id: 'warm-sunset',
    name: '暖阳夕照',
    description: '温暖的橙红色渐变，给人舒适感',
    previewBg: 'linear-gradient(to bottom right, #f59e0b, #ef4444)',
    previewIcon: 'fluent-emoji-flat:sun',
    previewTextColor: '#ffffff',
    config: {
      background: {
        type: 'gradient',
        opacity: 100,
        gradient: {
          startColor: '#f59e0b',
          endColor: '#ef4444',
          direction: 'to-bottom-right'
        }
      },
      icon: {
        code: 'fluent-emoji-flat:sun',
        size: 240,
        shadowSize: 100,
        shadowColor: '#ffffff',
        position: { x: 50, y: 50 }
      },
      title: {
        text: '暖阳   夕照',
        font: 'Maple Mono CN',
        size: 180,
        color: '#ffffff',
        position: { x: 50, y: 50 },
        effects: { bold: true, italic: false, uppercase: false }
      },
      watermark: {
        text: '@baiwumm',
        font: 'Maple Mono CN',
        size: 50,
        color: '#ffffff',
        opacity: 80,
        position: { x: 98, y: 98 },
        effects: { bold: true, italic: true, uppercase: false }
      }
    }
  },
  {
    id: 'forest-green',
    name: '森林绿意',
    description: '自然绿色系渐变，给人清新感',
    previewBg: 'linear-gradient(to bottom right, #10b981, #047857)',
    previewIcon: 'fluent-emoji-flat:deciduous-tree',
    previewTextColor: '#ffffff',
    config: {
      background: {
        type: 'gradient',
        opacity: 200,
        gradient: {
          startColor: '#10b981',
          endColor: '#047857',
          direction: 'to-bottom-right'
        }
      },
      icon: {
        code: 'fluent-emoji-flat:deciduous-tree',
        size: 240,
        shadowSize: 100,
        shadowColor: '#ffffff',
        position: { x: 50, y: 50 }
      },
      title: {
        text: '森林   绿意',
        font: 'Maple Mono CN',
        size: 180,
        color: '#ffffff',
        position: { x: 50, y: 50 },
        effects: { bold: true, italic: false, uppercase: false }
      },
      watermark: {
        text: '@baiwumm',
        font: 'Maple Mono CN',
        size: 50,
        color: '#ffffff',
        opacity: 80,
        position: { x: 98, y: 98 },
        effects: { bold: true, italic: true, uppercase: false }
      }
    }
  },
  {
    id: 'galaxy-night',
    name: '星空夜景',
    description: '深邃的星空渐变，神秘而优雅',
    previewBg: 'linear-gradient(to bottom right, #0f172a, #4c1d95)',
    previewIcon: 'fluent-emoji-flat:crescent-moon',
    previewTextColor: '#e2e8f0',
    config: {
      background: {
        type: 'gradient',
        opacity: 100,
        gradient: {
          startColor: '#0f172a',
          endColor: '#4c1d95',
          direction: 'to-bottom-right'
        }
      },
      icon: {
        code: 'fluent-emoji-flat:crescent-moon',
        size: 240,
        shadowSize: 100,
        shadowColor: '#a78bfa',
        position: { x: 50, y: 50 }
      },
      title: {
        text: '星空   夜景',
        font: 'Maple Mono CN',
        size: 180,
        color: '#e2e8f0',
        position: { x: 50, y: 50 },
        effects: { bold: true, italic: false, uppercase: false }
      },
      watermark: {
        text: '@baiwumm',
        font: 'Maple Mono CN',
        size: 50,
        color: '#a78bfa',
        opacity: 80,
        position: { x: 98, y: 98 },
        effects: { bold: true, italic: true, uppercase: false }
      }
    }
  },
  {
    id: 'pastel-dream',
    name: '梦幻粉彩',
    description: '柔和的粉色系渐变，温馨梦幻',
    previewBg: 'linear-gradient(to bottom right, #f9a8d4, #d946ef)',
    previewIcon: 'fluent-emoji-flat:sparkles',
    previewTextColor: '#ffffff',
    config: {
      background: {
        type: 'gradient',
        opacity: 100,
        gradient: {
          startColor: '#f9a8d4',
          endColor: '#d946ef',
          direction: 'to-bottom-right'
        }
      },
      icon: {
        code: 'fluent-emoji-flat:sparkles',
        size: 240,
        shadowSize: 100,
        shadowColor: '#ffffff',
        position: { x: 50, y: 50 }
      },
      title: {
        text: '梦幻   粉彩',
        font: 'Maple Mono CN',
        size: 180,
        color: '#ffffff',
        position: { x: 50, y: 50 },
        effects: { bold: true, italic: false, uppercase: false }
      },
      watermark: {
        text: '@baiwumm',
        font: 'Maple Mono CN',
        size: 50,
        color: '#ffffff',
        opacity: 80,
        position: { x: 98, y: 98 },
        effects: { bold: true, italic: true, uppercase: false }
      }
    }
  }
]);

// 控制主题选择器显示状态
const showThemeSelector = ref(false);
// 当前选中的主题ID
const selectedThemeId = ref('default');

// 获取当前选中的主题
const selectedTheme = computed(() => {
  return availableThemes.value.find(theme => theme.id === selectedThemeId.value);
});

// 打开主题选择器
const openThemeSelector = () => {
  showThemeSelector.value = true;
};

// 关闭主题选择器
const closeThemeSelector = () => {
  showThemeSelector.value = false;
};

// 选择主题
const selectTheme = (theme: Theme) => {
  selectedThemeId.value = theme.id;
};

// 应用选中的主题
const applySelectedTheme = () => {
  if (selectedTheme.value) {
    emit('theme-selected', selectedTheme.value.config);
    closeThemeSelector();
  }
};

// 获取主题预览样式
const getThemePreviewStyle = (theme: Theme) => {
  return {
    background: theme.previewBg,
    color: theme.previewTextColor
  };
};

// 定义组件事件
const emit = defineEmits(['theme-selected']);

// 暴露方法和属性给父组件
defineExpose({
  openThemeSelector,
  selectedThemeId
});
</script>

<style scoped>
.theme-card-active {
  border-color: #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}
</style>
