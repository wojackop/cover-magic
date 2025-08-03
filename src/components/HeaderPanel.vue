<template>
  <div
    :class="[
      'shadow-md transition-colors duration-300',
      isDarkMode
        ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100'
        : 'bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800',
    ]"
  >
    <div class="container mx-auto px-6 py-6">
      <!-- 标题和功能图标区域 -->
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div class="flex items-center gap-3 mb-2">
            <div class="bg-blue-500/80 backdrop-blur-md p-3 rounded-xl shadow-lg">
              <Icon icon="material-symbols:palette" class="text-4xl text-white" />
            </div>
            <n-gradient-text :size="40" type="success" class="text-3xl md:text-4xl !font-bold">
              {{ props.title }}
            </n-gradient-text>
          </div>
          <p :class="['text-lg mt-2 max-w-lg font-bold', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
            {{ props.subtitle }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <!-- 主题切换按钮 -->
          <button
            :class="[
              'group backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl',
              isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70' : 'bg-white/50 hover:bg-white/70',
            ]"
            @click="toggleTheme"
          >
            <div class="bg-purple-500 group-hover:bg-purple-400 p-2 rounded-lg transition-colors">
              <Icon :icon="themeIcon" class="text-2xl text-white" />
            </div>
            <div>
              <div :class="['font-medium', isDarkMode ? 'text-gray-100' : 'text-gray-800']">
                {{ isDarkMode ? "浅色" : "深色" }}
              </div>
              <div :class="['text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600']">切换主题模式</div>
            </div>
          </button>

          <button
            :class="[
              'group backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl',
              isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70' : 'bg-white/50 hover:bg-white/70',
            ]"
            @click="emit('header-action', 'design')"
          >
            <div class="bg-blue-500 group-hover:bg-blue-400 p-2 rounded-lg transition-colors">
              <Icon icon="material-symbols:design-services" class="text-2xl text-white" />
            </div>
            <div>
              <div :class="['font-medium', isDarkMode ? 'text-gray-100' : 'text-gray-800']">设计</div>
              <div :class="['text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600']">创建精美封面</div>
            </div>
          </button>

          <button
            :class="[
              'group backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl',
              isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70' : 'bg-white/50 hover:bg-white/70',
            ]"
            @click="emit('header-action', 'preview')"
          >
            <div class="bg-indigo-500 group-hover:bg-indigo-400 p-2 rounded-lg transition-colors">
              <Icon icon="material-symbols:preview" class="text-2xl text-white" />
            </div>
            <div>
              <div :class="['font-medium', isDarkMode ? 'text-gray-100' : 'text-gray-800']">预览</div>
              <div :class="['text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600']">实时查看效果</div>
            </div>
          </button>

          <button
            :class="[
              'group backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl',
              isDarkMode ? 'bg-gray-700/50 hover:bg-gray-600/70' : 'bg-white/50 hover:bg-white/70',
            ]"
            @click="emit('header-action', 'export')"
          >
            <div class="bg-green-500 group-hover:bg-green-400 p-2 rounded-lg transition-colors">
              <Icon icon="material-symbols:download" class="text-2xl text-white" />
            </div>
            <div>
              <div :class="['font-medium', isDarkMode ? 'text-gray-100' : 'text-gray-800']">导出</div>
              <div :class="['text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600']">保存您的作品</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 功能介绍区域 -->
  <div
    :class="[
      'border-b shadow-sm transition-colors duration-300',
      isDarkMode
        ? 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600/50'
        : 'bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200/50',
    ]"
  >
    <div class="container mx-auto px-6 py-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div :class="['p-2 rounded-lg', isDarkMode ? 'bg-blue-400/20' : 'bg-blue-500/20']">
            <Icon icon="material-symbols:info" :class="['text-xl', isDarkMode ? 'text-blue-400' : 'text-blue-600']" />
          </div>
          <h2 :class="['text-xl font-bold', isDarkMode ? 'text-gray-100' : 'text-gray-800']">功能亮点</h2>
        </div>
        <div :class="['text-sm font-medium', isDarkMode ? 'text-blue-400' : 'text-blue-600']">专业封面设计工具</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 背景设计卡片 -->
        <n-card size="large" hoverable class="h-full !rounded-lg">
          <div class="flex items-start gap-4">
            <div class="bg-blue-500/90 text-white p-3 rounded-lg shadow-sm">
              <Icon icon="material-symbols:brush" class="text-2xl" />
            </div>
            <div>
              <h3 :class="['font-bold mb-2', isDarkMode ? 'text-blue-300' : 'text-blue-800']">背景设计</h3>
              <ul class="space-y-2">
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  自定义纯色背景
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  上传自定义图片
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  多方向渐变背景
                </li>
              </ul>
            </div>
          </div>
        </n-card>

        <!-- 内容编辑卡片 -->
        <n-card size="large" hoverable class="h-full !rounded-lg">
          <div class="flex items-start gap-4">
            <div class="bg-indigo-500/90 text-white p-3 rounded-lg shadow-sm">
              <Icon icon="material-symbols:format-shapes" class="text-2xl" />
            </div>
            <div>
              <h3 :class="['font-bold mb-2', isDarkMode ? 'text-indigo-300' : 'text-indigo-800']">内容编辑</h3>
              <ul class="space-y-2">
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  丰富的图标库
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  自定义标题文本
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  水印保护功能
                </li>
              </ul>
            </div>
          </div>
        </n-card>

        <!-- 主题模式卡片 -->
        <n-card size="large" hoverable class="h-full !rounded-lg">
          <div class="flex items-start gap-4">
            <div class="bg-purple-500/90 text-white p-3 rounded-lg shadow-sm">
              <Icon icon="material-symbols:dark-mode" class="text-2xl" />
            </div>
            <div>
              <h3 :class="['font-bold mb-2', isDarkMode ? 'text-purple-300' : 'text-purple-800']">主题模式</h3>
              <ul class="space-y-2">
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  支持暗黑主题
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  一键主题切换
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  护眼模式体验
                </li>
              </ul>
            </div>
          </div>
        </n-card>

        <!-- 导出选项卡片 -->
        <n-card size="large" hoverable class="h-full !rounded-lg">
          <div class="flex items-start gap-4">
            <div class="bg-blue-600/90 text-white p-3 rounded-lg shadow-sm">
              <Icon icon="material-symbols:deployed-code" class="text-2xl" />
            </div>
            <div>
              <h3 :class="['font-bold mb-2', isDarkMode ? 'text-blue-300' : 'text-blue-800']">导出选项</h3>
              <ul class="space-y-2">
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  多种格式导出
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  自定义尺寸
                </li>
                <li :class="['flex items-center gap-2 text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  <Icon icon="material-symbols:check-circle" class="text-green-500" />
                  高质量图像
                </li>
              </ul>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NGradientText, useOsTheme, NCard } from "naive-ui";
import { ref, computed } from "vue";

// 定义组件的 props
const props = defineProps<{
  title?: string; // 标题文本，可选
  subtitle?: string; // 副标题文本，可选
}>();

// 定义组件的事件
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "header-action", action: string): void; // 头部操作事件
  // eslint-disable-next-line no-unused-vars
  (e: "theme-change", isDark: boolean): void; // 主题切换事件
}>();

// 主题切换逻辑
const osThemeRef = useOsTheme();
const isDarkMode = ref(osThemeRef.value === "dark");

// 计算当前主题图标
const themeIcon = computed(() => (isDarkMode.value ? "material-symbols:light-mode" : "material-symbols:dark-mode"));

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  emit("theme-change", isDarkMode.value);
};
</script>
