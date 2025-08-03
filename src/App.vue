<template>
  <n-config-provider :theme="theme">
    <div class="min-h-screen" :class="[isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark-mode' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50']">
      <!-- 顶部标题栏 -->
      <HeaderPanel 
        title="封面制作工具" 
        subtitle="专业的封面设计工具，支持实时预览和高质量导出" 
        @header-action="handleHeaderAction"
        @theme-change="handleThemeChange"
      />

    <div class="container mx-auto px-6 py-8">
      <!-- 预览区域 -->
      <div class="mb-8" :class="isDarkMode ? 'bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50' : 'bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold flex items-center gap-2" :class="isDarkMode ? 'text-gray-100' : 'text-gray-800'">
            <Icon icon="material-symbols:preview" class="text-2xl" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
            实时预览
          </h2>
          <div class="rounded-full px-4 py-1 text-sm font-medium flex items-center gap-1" :class="isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700'">
            <Icon icon="material-symbols:info-outline" />
            拖动元素调整位置
          </div>
        </div>
        <PreviewPanel 
          ref="previewPanelRef" 
          :backgroundConfig="backgroundConfig" 
          :iconConfig="iconConfig"
          :titleConfig="titleConfig" 
          :watermarkConfig="watermarkConfig" 
          @canvas-update="onCanvasUpdate" 
          class="rounded-lg overflow-hidden shadow-inner"
        />
      </div>

      <!-- 控制面板 -->
      <n-grid cols="1 s:1 m:2 l:2 xl:3 2xl:3" responsive="screen" :x-gap="24" :y-gap="24">
        <!-- 背景设置 -->
        <n-grid-item>
          <BackgroundPanel :backgroundConfig="backgroundConfig" @update:backgroundConfig="(newBackgroundConfig) => {
            Object.assign(backgroundConfig, newBackgroundConfig);
            updateCanvas();
          }" @image-upload="handleImageUpload" @canvas-update="updateCanvas" />
        </n-grid-item>

        <!-- 图标设置 -->
        <n-grid-item>
          <IconPanel :iconConfig="iconConfig" @update:iconConfig="(newIconConfig) => {
            Object.assign(iconConfig, newIconConfig);
            updateCanvas();
          }" @icon-load="loadIcon" @canvas-update="updateCanvas" />
        </n-grid-item>

        <!-- 标题设置 -->
        <n-grid-item>
          <TitlePanel :titleConfig="titleConfig" @update:titleConfig="(newTitleConfig) => {
            Object.assign(titleConfig, newTitleConfig);
            updateCanvas();
          }" @canvas-update="updateCanvas" />
        </n-grid-item>

        <!-- 水印设置 -->
        <n-grid-item>
          <WatermarkPanel :watermarkConfig="watermarkConfig" @update:watermarkConfig="(newWatermarkConfig) => {
            Object.assign(watermarkConfig, newWatermarkConfig);
            updateCanvas();
          }" @canvas-update="updateCanvas" />
        </n-grid-item>

        <!-- 导出设置 -->
        <n-grid-item>
          <ExportPanel :exportConfig="exportConfig" @update:exportConfig="(newExportConfig) => {
            Object.assign(exportConfig, newExportConfig);
          }" @export-image="exportImage" />
        </n-grid-item>
      </n-grid>
    </div>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { NGrid, NGridItem, NConfigProvider, darkTheme } from 'naive-ui'
import HeaderPanel from '@/components/HeaderPanel.vue'
import BackgroundPanel from '@/components/BackgroundPanel.vue'
import IconPanel from '@/components/IconPanel.vue'
import TitlePanel from '@/components/TitlePanel.vue'
import WatermarkPanel from '@/components/WatermarkPanel.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import type { BackgroundConfig, IconConfig, TitleConfig, WatermarkConfig, ExportConfig } from '@/lib/type'

import { BACKGROUND_TYPE, GRADIENT_DIRECTION } from '@/lib/enum'

// 背景设置 - 用于控制封面背景的各项属性
const backgroundConfig = reactive<BackgroundConfig>({
  type: BACKGROUND_TYPE.COLOR,  // 背景类型：'color'表示纯色背景，'image'表示图片背景，'gradient'表示渐变背景
  color: '#000000',                    // 背景颜色：十六进制颜色值，默认为黑色
  opacity: 100,                        // 背景不透明度：范围0-100，100表示完全不透明
  image: '' as string,                 // 背景图片：Base64格式的图片数据URL字符串
  imageObj: null as HTMLImageElement | null, // 背景图片对象：用于Canvas绘制的图片DOM元素
  blur: 0,                             // 背景模糊度：应用于图片背景的模糊效果，单位为像素
  gradient: {                          // 渐变背景配置
    startColor: '#3b82f6',             // 起始颜色：默认为蓝色
    endColor: '#8b5cf6',               // 结束颜色：默认为紫色
    direction: GRADIENT_DIRECTION.TO_BOTTOM_RIGHT // 渐变方向：默认为左上到右下
  }
})

// 图标设置 - 用于控制封面中心图标的各项属性
const iconConfig = reactive<IconConfig>({
  code: 'fluent-emoji-flat:four-leaf-clover', // 图标代码：使用Iconify图标库的标识符，指定要显示的图标
  size: 100,                            // 图标大小：控制图标的显示尺寸，单位为像素
  shadowSize: 100,                      // 阴影大小：控制图标阴影的模糊半径，值越大阴影越模糊扩散
  shadowColor: '#ffffff',               // 阴影颜色：指定图标阴影的颜色，默认为白色
  position: {                           // 图标位置：控制图标在画布中的位置
    x: 50,                              // 水平位置：以百分比表示，50表示水平居中
    y: 50                               // 垂直位置：以百分比表示，50表示垂直居中
  },
  svg: ''                               // 图标SVG内容：存储从Iconify API获取的SVG代码，用于在Canvas中渲染图标
})

// 标题设置 - 用于控制封面标题文本的各项属性
const titleConfig = reactive<TitleConfig>({
  text: '封面  制作',           // 标题文本：显示在封面上的文字内容
  font: 'Maple Mono CN',       // 字体名称：指定标题文本使用的字体
  size: 80,                    // 字体大小：控制标题文本的显示尺寸，单位为像素
  color: '#ffffff',            // 字体颜色：指定标题文本的颜色，默认为白色
  position: {                  // 标题位置：控制标题在画布中的位置
    x: 50,                     // 水平位置：以百分比表示，50表示水平居中
    y: 50                      // 垂直位置：以百分比表示，50表示垂直居中
  },
  effects: {                   // 文本效果：控制标题文本的样式效果
    bold: true,                // 粗体：true表示使用粗体，false表示不使用
    italic: true               // 斜体：true表示使用斜体，false表示不使用
  }
})

// 水印设置 - 用于控制封面水印的各项属性
const watermarkConfig = reactive<WatermarkConfig>({
  text: '@baiwumm',           // 水印文本：显示在封面上的水印内容
  font: 'Maple Mono CN',      // 字体名称：指定水印文本使用的字体
  size: 24,                   // 字体大小：控制水印文本的显示尺寸，单位为像素
  color: '#ffffff',           // 字体颜色：指定水印文本的颜色，默认为白色
  opacity: 80,                // 不透明度：控制水印的透明度，范围0-100，100表示完全不透明
  position: {                 // 水印位置：控制水印在画布中的位置
    x: 98,                    // 水平位置：以百分比表示，90表示靠右
    y: 98                     // 垂直位置：以百分比表示，95表示靠下
  },
  effects: {                  // 文本效果：控制水印文本的样式效果
    bold: true,               // 粗体：true表示使用粗体，false表示不使用
    italic: true              // 斜体：true表示使用斜体，false表示不使用
  }
})

// 导出设置 - 用于控制导出图片的各项属性
const exportConfig = reactive<ExportConfig>({
  width: 1920,                 // 导出宽度：导出图片的宽度，单位为像素
  height: 1080,                // 导出高度：导出图片的高度，单位为像素
  format: 'webp',              // 导出格式：支持'png'、'jpeg'、'webp'等格式
  fileName: '封面设计',         // 文件名：导出图片的文件名
  useRandomFileName: true,    // 是否使用随机文件名：true表示使用随机生成的文件名
  randomFileNameLength: 32,     // 随机文件名长度：随机生成的文件名的字符数
  randomFileNameOptions: {     // 随机文件名选项：控制随机文件名包含的字符类型
    includeNumbers: true,      // 是否包含数字：true表示包含数字
    includeLowercase: true,    // 是否包含小写字母：true表示包含小写字母
    includeUppercase: true     // 是否包含大写字母：true表示包含大写字母
  },
  currentRandomFileName: ''    // 当前随机文件名：当前生成的随机文件名
})

// 预览面板引用
const previewPanelRef = ref<InstanceType<typeof PreviewPanel> | null>(null)

// 加载图标
const loadIcon = async () => {
  if (!iconConfig.code) {
    iconConfig.svg = ''
    updateCanvas()
    return
  }

  try {
    // 从 Iconify API 获取 SVG
    const response = await fetch(`https://api.iconify.design/${iconConfig.code}.svg`)
    if (response.ok) {
      iconConfig.svg = await response.text()
    } else {
      iconConfig.svg = ''
    }
    updateCanvas()
  } catch (error) {
    console.error('加载图标失败:', error)
    iconConfig.svg = ''
    updateCanvas()
  }
}

// 处理图片上传
const handleImageUpload = (options: any) => {
  const file = options.file.file
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        // 创建新的对象引用更新背景对象，确保响应式更新
        backgroundConfig.image = imageDataUrl
        backgroundConfig.imageObj = img
        updateCanvas()
      }
      img.src = imageDataUrl
    }
    reader.readAsDataURL(file)
  }
}

// 更新画布 - 公共入口点
const updateCanvas = () => {
  if (previewPanelRef.value) {
    previewPanelRef.value.updateCanvas()
  }
}

// 画布更新事件处理
const onCanvasUpdate = () => {
  // 可以在这里添加额外的处理逻辑
}

// 导出图片
const exportImage = async () => {
  // 调用预览面板的导出方法
  if (previewPanelRef.value) {
    previewPanelRef.value.exportImage(exportConfig);
  }
}

// 暗黑主题状态
const isDarkMode = ref(false)
const theme = ref<any>(null)

// 处理头部面板的操作事件
const handleHeaderAction = (action: string) => {
  console.log('头部操作:', action)
  // 可以根据不同的操作执行相应的逻辑
  // 例如：打开帮助文档、显示关于信息等
}

// 处理主题切换
const handleThemeChange = (isDark: boolean) => {
  isDarkMode.value = isDark
  theme.value = isDark ? darkTheme : null
}

// 组件挂载时初始化
onMounted(() => {
  // 初始化画布
  updateCanvas()

  // 加载初始图标
  if (iconConfig.code) {
    loadIcon()
  }
})
</script>
