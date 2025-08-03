<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- 顶部标题栏 -->
    <div class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <h1 class="text-3xl font-bold text-gray-800 text-center flex items-center justify-center gap-3">
          <Icon icon="material-symbols:palette" class="text-4xl text-blue-600" />
          封面制作工具
        </h1>
        <p class="text-gray-600 text-center mt-2">专业的封面设计工具，支持实时预览和高质量导出</p>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- 预览区域 -->
      <n-card class="mb-8" size="large">
        <template #header>
          <div class="flex items-center gap-2">
            <Icon icon="material-symbols:preview" class="text-xl text-blue-600" />
            <span class="font-semibold">实时预览</span>
          </div>
        </template>
        <div class="flex justify-center">
          <canvas ref="previewCanvas" class="border-2 border-gray-300 rounded-lg shadow-lg w-full max-w-4xl"
            :width="800" :height="450" style="width: 100%; height: auto; max-width: 800px;"></canvas>
        </div>
      </n-card>

      <!-- 控制面板 -->
      <n-grid cols="1 s:1 m:2 l:2 xl:3 2xl:3" responsive="screen" :x-gap="24" :y-gap="24">
        <!-- 背景设置 -->
        <n-grid-item>
          <BackgroundPanel
            :backgroundConfig="backgroundConfig"
            @update:backgroundConfig="(newBackgroundConfig) => { 
              Object.assign(backgroundConfig, newBackgroundConfig); 
              updateCanvas();
            }"
            @image-upload="handleImageUpload"
            @canvas-update="updateCanvas"
          />
        </n-grid-item>

        <!-- 图标设置 -->
        <n-grid-item>
          <IconPanel
            :iconConfig="iconConfig"
            @update:iconConfig="(newIconConfig) => { 
              Object.assign(iconConfig, newIconConfig); 
              updateCanvas();
            }"
            @icon-load="loadIcon"
            @canvas-update="updateCanvas"
          />
        </n-grid-item>

        <!-- 标题设置 -->
        <n-grid-item>
          <TitlePanel
            :titleConfig="titleConfig"
            @update:titleConfig="(newTitleConfig) => { 
              Object.assign(titleConfig, newTitleConfig); 
              updateCanvas();
            }"
            @canvas-update="updateCanvas"
          />
        </n-grid-item>

        <!-- 水印设置 -->
        <n-grid-item>
          <n-card size="large" hoverable class="h-full">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon icon="material-symbols:water-drop" class="text-xl text-blue-500" />
                <span class="font-semibold">水印设置</span>
              </div>
            </template>
            <n-space vertical size="large">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:text-fields" class="text-lg" />
                  水印文本
                </label>
                <n-input v-model:value="watermarkText" placeholder="输入水印..." @input="updateCanvas">
                  <template #prefix>
                    <Icon icon="material-symbols:edit" />
                  </template>
                </n-input>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:font-download" class="text-lg" />
                  字体
                </label>
                <n-select v-model:value="watermarkFont" @update:value="updateCanvas" :options="fontOptions" />
              </div>

              <div>
                <n-space>
                  <n-checkbox v-model:checked="watermarkBold" @update:checked="updateCanvas">
                    <span class="flex items-center gap-2">
                      <Icon icon="material-symbols:format-bold" class="text-lg" />
                      加粗
                    </span>
                  </n-checkbox>
                  <n-checkbox v-model:checked="watermarkItalic" @update:checked="updateCanvas">
                    <span class="flex items-center gap-2">
                      <Icon icon="material-symbols:format-italic" class="text-lg" />
                      斜体
                    </span>
                  </n-checkbox>
                </n-space>
              </div>

              <n-grid cols="2" :x-gap="16">
                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:format-size" class="text-lg" />
                    字体大小
                  </label>
                  <n-slider v-model:value="watermarkSize" :min="10" :max="40" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ watermarkSize }}px</span>
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:opacity" class="text-lg" />
                    透明度
                  </label>
                  <n-slider v-model:value="watermarkOpacity" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ watermarkOpacity }}%</span>
                </n-grid-item>
              </n-grid>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:palette" class="text-lg" />
                  颜色
                </label>
                <n-color-picker 
                  v-model:value="watermarkColor" 
                  @update:value="updateCanvas"
                  :swatches="colorSwatches"
                  :show-alpha="false"
                />
              </div>

              <n-grid cols="2" :x-gap="16">
                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:swap-horiz" class="text-lg" />
                    水平位置
                  </label>
                  <n-slider v-model:value="watermarkX" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ watermarkX }}%</span>
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:swap-vert" class="text-lg" />
                    垂直位置
                  </label>
                  <n-slider v-model:value="watermarkY" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ watermarkY }}%</span>
                </n-grid-item>
              </n-grid>
            </n-space>
          </n-card>
        </n-grid-item>

        <!-- 导出设置 -->
        <n-grid-item>
          <n-card size="large" hoverable class="h-full">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon icon="material-symbols:download" class="text-xl text-red-600" />
                <span class="font-semibold">导出设置</span>
              </div>
            </template>
            <n-space vertical size="large">
              <n-grid cols="2" :x-gap="16">
                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:width" class="text-lg" />
                    宽度
                  </label>
                  <n-input-number v-model:value="exportWidth" :min="100" :max="4000" />
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:height" class="text-lg" />
                    高度
                  </label>
                  <n-input-number v-model:value="exportHeight" :min="100" :max="4000" />
                </n-grid-item>
              </n-grid>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:image" class="text-lg" />
                  格式
                </label>
                <n-select v-model:value="exportFormat" :options="[
                  { label: 'PNG', value: 'png' },
                  { label: 'JPG', value: 'jpeg' },
                  { label: 'WEBP', value: 'webp' }
                ]" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:drive-file-rename-outline" class="text-lg" />
                  文件名设置
                </label>
                <n-space vertical size="small">
                  <n-checkbox v-model:checked="useRandomFileName">
                    使用随机文件名
                  </n-checkbox>
                  
                  <div v-if="!useRandomFileName">
                    <n-input 
                      v-model:value="exportFileName" 
                      placeholder="输入文件名 (4-60个字符)" 
                      :maxlength="60"
                      show-count
                    />
                  </div>
                  
                  <div v-if="useRandomFileName">
                    <n-space vertical size="small">
                      <div>
                        <label class="text-xs text-gray-600 mb-1 block">随机名称长度</label>
                        <n-slider 
                          v-model:value="randomFileNameLength" 
                          :min="4" 
                          :max="60" 
                          :step="1" 
                        />
                        <span class="text-xs text-gray-500">{{ randomFileNameLength }}个字符</span>
                      </div>
                      
                      <div>
                        <label class="text-xs text-gray-600 mb-1 block">包含字符类型</label>
                        <n-space>
                          <n-checkbox v-model:checked="randomFileNameOptions.includeNumbers" size="small">
                            数字
                          </n-checkbox>
                          <n-checkbox v-model:checked="randomFileNameOptions.includeLowercase" size="small">
                            小写
                          </n-checkbox>
                          <n-checkbox v-model:checked="randomFileNameOptions.includeUppercase" size="small">
                            大写
                          </n-checkbox>
                        </n-space>
                      </div>
                      
                      <n-button size="small" @click="generateAndCacheRandomFileName()" secondary>
                        <template #icon>
                          <Icon icon="material-symbols:refresh" />
                        </template>
                        预览随机名称: {{ currentRandomFileName || generateAndCacheRandomFileName() }}
                      </n-button>
                    </n-space>
                  </div>
                </n-space>
              </div>

              <n-button @click="exportImage" type="primary" size="large" block strong>
                <template #icon>
                  <Icon icon="material-symbols:rocket-launch" />
                </template>
                导出图片
              </n-button>
            </n-space>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { 
  NButton, 
  NInput, 
  NSlider, 
  NColorPicker, 
  NSelect, 
  NCheckbox, 
  NInputNumber,
  NCard,
  NSpace,
  NGrid,
  NGridItem
} from 'naive-ui'
import BackgroundPanel from '@/components/BackgroundPanel.vue'
import IconPanel from '@/components/IconPanel.vue'
import TitlePanel from '@/components/TitlePanel.vue'
import { colorSwatches,fontOptions } from '@/lib/constant'
import type { BackgroundConfig,IconConfig,TitleConfig } from '@/lib/type'

import { BACKGROUND_TYPE } from '@/lib/enum'

// 背景设置 - 用于控制封面背景的各项属性
const backgroundConfig = reactive<BackgroundConfig>({
  type: BACKGROUND_TYPE.COLOR,  // 背景类型：'color'表示纯色背景，'image'表示图片背景
  color: '#000000',                    // 背景颜色：十六进制颜色值，默认为黑色
  opacity: 100,                        // 背景不透明度：范围0-100，100表示完全不透明
  image: '' as string,                 // 背景图片：Base64格式的图片数据URL字符串
  imageObj: null as HTMLImageElement | null, // 背景图片对象：用于Canvas绘制的图片DOM元素
  blur: 0                              // 背景模糊度：应用于图片背景的模糊效果，单位为像素
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
  text: '谜叶  象限',           // 标题文本：显示在封面上的文字内容
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

// 水印设置
const watermarkText = ref('@baiwumm')

// 水印样式配置
const watermarkStyle = reactive({
  font: 'Maple Mono CN',
  size: 24,
  color: '#ffffff',
  opacity: 80,
  position: {
    x: 90,
    y: 95
  },
  effects: {
    bold: true,
    italic: true
  }
})

// 为了保持向后兼容，创建计算属性
const watermarkFont = computed({
  get: () => watermarkStyle.font,
  set: (value) => watermarkStyle.font = value
})
const watermarkSize = computed({
  get: () => watermarkStyle.size,
  set: (value) => watermarkStyle.size = value
})
const watermarkColor = computed({
  get: () => watermarkStyle.color,
  set: (value) => watermarkStyle.color = value
})
const watermarkOpacity = computed({
  get: () => watermarkStyle.opacity,
  set: (value) => watermarkStyle.opacity = value
})
const watermarkX = computed({
  get: () => watermarkStyle.position.x,
  set: (value) => watermarkStyle.position.x = value
})
const watermarkY = computed({
  get: () => watermarkStyle.position.y,
  set: (value) => watermarkStyle.position.y = value
})
const watermarkBold = computed({
  get: () => watermarkStyle.effects.bold,
  set: (value) => watermarkStyle.effects.bold = value
})
const watermarkItalic = computed({
  get: () => watermarkStyle.effects.italic,
  set: (value) => watermarkStyle.effects.italic = value
})

// 导出设置
const exportWidth = ref(1920)
const exportHeight = ref(1080)
const exportFormat = ref('webp')
const exportFileName = ref('封面设计')
const useRandomFileName = ref(false)
const randomFileNameLength = ref(8)
const randomFileNameOptions = reactive({
  includeNumbers: true,
  includeLowercase: true,
  includeUppercase: true
})

// 画布引用和缓存变量
const previewCanvas = ref<HTMLCanvasElement>()
let iconImageCache: HTMLImageElement | null = null
let updateTimer: number | null = null
let isUpdating = false
let fontLoaded = false

// 检测字体是否加载完成
const checkFontLoaded = async () => {
  if (fontLoaded) return true
  
  try {
    // 使用 document.fonts.ready 检测字体加载
    await document.fonts.ready
    
    // 额外检查 Maple Mono CN 字体是否可用
    const testCanvas = document.createElement('canvas')
    const testCtx = testCanvas.getContext('2d')
    if (testCtx) {
      testCtx.font = '16px Maple Mono CN'
      const mapleWidth = testCtx.measureText('测试').width
      
      testCtx.font = '16px monospace'
      const fallbackWidth = testCtx.measureText('测试').width
      
      // 如果宽度不同，说明 Maple Mono CN 已加载
      fontLoaded = Math.abs(mapleWidth - fallbackWidth) > 0.1
    }
    
    return fontLoaded
  } catch (error) {
    console.warn('字体检测失败:', error)
    fontLoaded = true // 假设已加载，避免无限等待
    return true
  }
}

// 等待字体加载的辅助函数
const waitForFont = async (maxWait = 3000) => {
  const startTime = Date.now()
  
  while (!fontLoaded && (Date.now() - startTime) < maxWait) {
    await checkFontLoaded()
    if (!fontLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return fontLoaded
}

  // 加载图标
const loadIcon = async () => {
  if (!iconConfig.code) {
    iconConfig.svg = ''
    iconImageCache = null // 清除缓存
    updateCanvas()
    return
  }

  try {
    // 从 Iconify API 获取 SVG
    const response = await fetch(`https://api.iconify.design/${iconConfig.code}.svg`)
    if (response.ok) {
      iconConfig.svg = await response.text()
      iconImageCache = null // 清除旧缓存
    } else {
      iconConfig.svg = ''
      iconImageCache = null
    }
    updateCanvas()
  } catch (error) {
    console.error('加载图标失败:', error)
    iconConfig.svg = ''
    iconImageCache = null
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

// 绘制阴影
const drawShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  if (iconConfig.shadowSize > 0) {
    ctx.shadowColor = iconConfig.shadowColor
    ctx.shadowBlur = iconConfig.shadowSize
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }
}

// 清除阴影
const clearShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

// 绘制 SVG 图标（使用缓存）
const drawIcon = async (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  if (!iconConfig.svg) return

  // 如果缓存的图标存在且可用，直接使用
  if (iconImageCache) {
    // 设置阴影
    drawShadow(ctx, x, y, size)

    // 绘制图标，保持宽高比
    const aspectRatio = iconImageCache.width / iconImageCache.height
    let drawWidth = size
    let drawHeight = size

    if (aspectRatio > 1) {
      drawHeight = size / aspectRatio
    } else {
      drawWidth = size * aspectRatio
    }

    ctx.drawImage(iconImageCache, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)

    // 清除阴影
    clearShadow(ctx)
    return
  }

  // 如果没有缓存，创建新的图标
  return new Promise<void>((resolve) => {
    const svgBlob = new Blob([iconConfig.svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      // 缓存图标
      iconImageCache = img

      // 设置阴影
      drawShadow(ctx, x, y, size)

      // 绘制图标，保持宽高比
      const aspectRatio = img.width / img.height
      let drawWidth = size
      let drawHeight = size

      if (aspectRatio > 1) {
        drawHeight = size / aspectRatio
      } else {
        drawWidth = size * aspectRatio
      }

      ctx.drawImage(img, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)

      // 清除阴影
      clearShadow(ctx)

      URL.revokeObjectURL(url)
      resolve()
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve()
    }

    img.src = url
  })
}

// 存储动画状态
interface AnimationState {
  value: number;
  target: number;
  velocity: number;
}

// 创建动画状态对象
const createAnimationState = (initialValue: number = 0): AnimationState => ({
  value: initialValue,
  target: initialValue,
  velocity: 0
});

// 存储所有需要动画的属性状态
const animationStates = reactive({
  titleSize: createAnimationState(),
  titleX: createAnimationState(),
  titleY: createAnimationState(),
  watermarkSize: createAnimationState(),
  watermarkX: createAnimationState(),
  watermarkY: createAnimationState(),
  iconSize: createAnimationState(),
  iconX: createAnimationState(),
  iconY: createAnimationState(),
  watermarkOpacity: createAnimationState(),
  backgroundBlur: createAnimationState()
});

// 弹簧动画参数
const SPRING_STIFFNESS = 200; // 弹簧刚度
const SPRING_DAMPING = 20;   // 阻尼系数
const SPRING_MASS = 1;       // 质量
const SPRING_PRECISION = 0.01; // 精度阈值

// 动画帧率
const FPS = 120;

// 是否正在执行动画循环
let animationLoopRunning = false;

// 弹簧动画更新函数 - 使用物理模型实现更自然的动画
const updateSpringAnimation = (state: AnimationState, dt: number): boolean => {
  // 计算弹簧力
  const displacement = state.target - state.value;
  
  // 如果位移很小，直接到达目标位置
  if (Math.abs(displacement) < SPRING_PRECISION && Math.abs(state.velocity) < SPRING_PRECISION) {
    state.value = state.target;
    state.velocity = 0;
    return false; // 动画完成
  }
  
  // 计算弹簧力 (F = -kx)
  const springForce = SPRING_STIFFNESS * displacement;
  
  // 计算阻尼力 (F = -cv)
  const dampingForce = -SPRING_DAMPING * state.velocity;
  
  // 合力
  const force = springForce + dampingForce;
  
  // 加速度 (F = ma, a = F/m)
  const acceleration = force / SPRING_MASS;
  
  // 更新速度 (v = v0 + at)
  state.velocity += acceleration * dt;
  
  // 更新位置 (x = x0 + vt)
  state.value += state.velocity * dt;
  
  return true; // 动画继续
}

// 更新动画目标值
const updateAnimationTargets = () => {
  // 更新标题相关动画目标
  animationStates.titleSize.target = titleConfig.size;
  animationStates.titleX.target = titleConfig.position.x;
  animationStates.titleY.target = titleConfig.position.y;
  
  // 更新水印相关动画目标
  animationStates.watermarkSize.target = watermarkSize.value;
  animationStates.watermarkX.target = watermarkX.value;
  animationStates.watermarkY.target = watermarkY.value;
  animationStates.watermarkOpacity.target = watermarkOpacity.value;
  
  // 更新图标相关动画目标
  animationStates.iconSize.target = iconConfig.size;
  animationStates.iconX.target = iconConfig.position.x;
  animationStates.iconY.target = iconConfig.position.y;
  
  // 更新背景模糊动画目标
  animationStates.backgroundBlur.target = backgroundConfig.blur;
  
  // 如果是首次更新，直接设置当前值等于目标值
  if (animationStates.titleSize.value === 0) {
    Object.keys(animationStates).forEach(key => {
      const state = animationStates[key as keyof typeof animationStates];
      state.value = state.target;
    });
  }
  
  // 启动动画循环（如果尚未运行）
  startAnimationLoop();
};

// 启动动画循环
const startAnimationLoop = () => {
  if (animationLoopRunning) return;
  
  animationLoopRunning = true;
  let lastTime = performance.now();
  
  const animationLoop = async () => {
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // 秒为单位，限制最大时间步长
    lastTime = currentTime;
    
    // 更新所有动画状态
    let anyActive = false;
    Object.keys(animationStates).forEach(key => {
      const state = animationStates[key as keyof typeof animationStates];
      if (updateSpringAnimation(state, deltaTime)) {
        anyActive = true;
      }
    });
    
    // 渲染当前帧
    await renderCurrentFrame();
    
    // 如果还有活动的动画，继续循环
    if (anyActive) {
      requestAnimationFrame(animationLoop);
    } else {
      animationLoopRunning = false;
    }
  };
  
  // 开始动画循环
  requestAnimationFrame(animationLoop);
};

// 防抖更新画布 - 只更新目标值，不直接渲染
const debouncedUpdateCanvas = () => {
  if (updateTimer) {
    clearTimeout(updateTimer);
  }
  
  updateTimer = setTimeout(() => {
    updateAnimationTargets();
  }, 5); // 使用更短的延迟，提高响应性
};

// 渲染当前帧
const renderCurrentFrame = async () => {
  if (isUpdating) return;
  isUpdating = true;
  
  await nextTick();
  
  const canvas = previewCanvas.value;
  if (!canvas) {
    isUpdating = false;
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    isUpdating = false;
    return;
  }
  
  // 等待字体加载完成
  await waitForFont();
  
  // 使用requestAnimationFrame确保平滑渲染
  requestAnimationFrame(async () => {
    // 获取当前动画值
    const currentTitleSize = animationStates.titleSize.value;
    const currentTitleX = animationStates.titleX.value;
    const currentTitleY = animationStates.titleY.value;
    const currentWatermarkSize = animationStates.watermarkSize.value;
    const currentWatermarkX = animationStates.watermarkX.value;
    const currentWatermarkY = animationStates.watermarkY.value;
    const currentIconSize = animationStates.iconSize.value;
    const currentIconX = animationStates.iconX.value;
    const currentIconY = animationStates.iconY.value;
    
    // 渲染当前帧
    await renderFrame(
      currentTitleSize, currentTitleX, currentTitleY,
      currentWatermarkSize, currentWatermarkX, currentWatermarkY,
      currentIconSize, currentIconX, currentIconY
    );
    
    isUpdating = false;
  });
};

// 渲染单个帧
const renderFrame = async (
  currentTitleSize: number, currentTitleX: number, currentTitleY: number,
  currentWatermarkSize: number, currentWatermarkX: number, currentWatermarkY: number,
  currentIconSize: number, currentIconX: number, currentIconY: number
) => {
  const canvas = previewCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) return
  
  // 清空画布 - 使用填充而不是clearRect以减少闪烁
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 绘制背景
  if (backgroundConfig.type === 'color') {
    // 绘制纯色背景，应用透明度
    const opacity = backgroundConfig.opacity / 100
    const color = backgroundConfig.color
    
    // 将十六进制颜色转换为 rgba 格式
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else if (backgroundConfig.imageObj) {
    // 绘制背景图片
    ctx.filter = `blur(${backgroundConfig.blur}px)`
    ctx.drawImage(backgroundConfig.imageObj, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'
  }

  // 绘制图标
    if (iconConfig.svg) {
      const iconPosX = (currentIconX / 100) * canvas.width
      const iconPosY = (currentIconY / 100) * canvas.height
      await drawIcon(ctx, iconPosX, iconPosY, currentIconSize)
    }

    // 绘制标题
    if (titleConfig.text) {
      const titlePosX = (currentTitleX / 100) * canvas.width
      const titlePosY = (currentTitleY / 100) * canvas.height

      ctx.save()
      ctx.fillStyle = titleConfig.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 构建字体字符串 - 只设置加粗，斜体用变换实现
      let fontWeight = titleConfig.effects.bold ? 'bold' : 'normal'
      
      // 改进字体回退机制
      let fontFamily = ''
      switch (titleConfig.font) {
        case 'Maple Mono CN':
          fontFamily = '"Maple Mono CN", "Courier New", "Consolas", monospace'
          break
        case 'Fira Code':
          fontFamily = '"Fira Code", "Courier New", "Consolas", monospace'
          break
        case 'Lato':
          fontFamily = '"Lato", "Helvetica Neue", "Arial", sans-serif'
          break
        case 'Microsoft YaHei':
          fontFamily = '"Microsoft YaHei", "微软雅黑", "SimHei", "Arial Unicode MS", sans-serif'
          break
        case 'PingFang SC':
          fontFamily = '"PingFang SC", "苹方", "Helvetica Neue", "Arial", sans-serif'
          break
        case 'Source Han Sans CN':
          fontFamily = '"Source Han Sans CN", "思源黑体", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif'
          break
        case 'Arial':
          fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif'
          break
        case 'Helvetica':
          fontFamily = 'Helvetica, "Helvetica Neue", Arial, sans-serif'
          break
        case 'monospace':
          fontFamily = '"Courier New", Consolas, "Liberation Mono", monospace'
          break
        case 'serif':
          fontFamily = '"Times New Roman", Times, "Songti SC", serif'
          break
      default:
        fontFamily = `"${titleConfig.font}", Arial, sans-serif`
      }
      
      ctx.font = `${fontWeight} ${titleConfig.size}px ${fontFamily}`
      
      // 如果需要斜体，使用变换
      if (titleConfig.effects.italic) {
        ctx.translate(titlePosX, titlePosY)
        ctx.transform(1, 0, -0.2, 1, 0, 0)
        
        // 特殊处理 Maple Mono CN 的加粗效果
        if (titleConfig.effects.bold && titleConfig.font === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = titleConfig.color
          ctx.lineWidth = titleConfig.size * 2 * 0.01 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
          ctx.strokeText(titleConfig.text, 0, 0)
        }
        ctx.fillText(titleConfig.text, 0, 0)
      } else {
        // 特殊处理 Maple Mono CN 的加粗效果
        if (titleConfig.effects.bold && titleConfig.font === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = titleConfig.color
          ctx.lineWidth = titleConfig.size * 2 * 0.01 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
          ctx.strokeText(titleConfig.text, titlePosX, titlePosY)
        }
        ctx.fillText(titleConfig.text, titlePosX, titlePosY)
      }
      
      ctx.restore()
    }

    // 绘制水印 - 确保可见
    if (watermarkText.value.trim()) {
      const watermarkPosX = (currentWatermarkX / 100) * canvas.width
      const watermarkPosY = (currentWatermarkY / 100) * canvas.height

      ctx.save()
      ctx.fillStyle = watermarkColor.value
      ctx.globalAlpha = watermarkOpacity.value / 100
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 构建字体字符串 - 只设置加粗，斜体用变换实现
      let fontWeight = watermarkBold.value ? 'bold' : 'normal'
      
      // 改进字体回退机制
      let fontFamily = ''
      switch (watermarkFont.value) {
        case 'Maple Mono CN':
          fontFamily = '"Maple Mono CN", "Courier New", "Consolas", monospace'
          break
        case 'Fira Code':
          fontFamily = '"Fira Code", "Courier New", "Consolas", monospace'
          break
        case 'Lato':
          fontFamily = '"Lato", "Helvetica Neue", "Arial", sans-serif'
          break
        case 'Microsoft YaHei':
          fontFamily = '"Microsoft YaHei", "微软雅黑", "SimHei", "Arial Unicode MS", sans-serif'
          break
        case 'PingFang SC':
          fontFamily = '"PingFang SC", "苹方", "Helvetica Neue", "Arial", sans-serif'
          break
        case 'Source Han Sans CN':
          fontFamily = '"Source Han Sans CN", "思源黑体", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif'
          break
        case 'Arial':
          fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif'
          break
        case 'Helvetica':
          fontFamily = 'Helvetica, "Helvetica Neue", Arial, sans-serif'
          break
        case 'monospace':
          fontFamily = '"Courier New", Consolas, "Liberation Mono", monospace'
          break
        case 'serif':
          fontFamily = '"Times New Roman", Times, "Songti SC", serif'
          break
        default:
          fontFamily = `"${watermarkFont.value}", Arial, sans-serif`
      }
      
      ctx.font = `${fontWeight} ${currentWatermarkSize}px ${fontFamily}`
      
      // 如果需要斜体，使用变换
      if (watermarkItalic.value) {
        ctx.translate(watermarkPosX, watermarkPosY)
        ctx.transform(1, 0, -0.2, 1, 0, 0)
        
        // 特殊处理 Maple Mono CN 的加粗效果
        if (watermarkBold.value && watermarkFont.value === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = watermarkColor.value
          ctx.lineWidth = watermarkSize.value * 2 * 0.02 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
          ctx.strokeText(watermarkText.value, 0, 0)
        }
        ctx.fillText(watermarkText.value, 0, 0)
      } else {
        // 特殊处理 Maple Mono CN 的加粗效果
        if (watermarkBold.value && watermarkFont.value === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = watermarkColor.value
          ctx.lineWidth = watermarkSize.value * 2 * 0.02 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
          ctx.strokeText(watermarkText.value, watermarkPosX, watermarkPosY)
        }
        ctx.fillText(watermarkText.value, watermarkPosX, watermarkPosY)
      }
      
      ctx.restore()
    }

}

// 对外暴露的更新函数
const updateCanvas = debouncedUpdateCanvas

// 生成随机文件名
const generateRandomFileName = () => {
  const numbers = '0123456789'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  let chars = ''
  if (randomFileNameOptions.includeNumbers) chars += numbers
  if (randomFileNameOptions.includeLowercase) chars += lowercase
  if (randomFileNameOptions.includeUppercase) chars += uppercase
  
  if (chars === '') {
    chars = numbers + lowercase // 默认包含数字和小写字母
  }
  
  let result = ''
  const length = Math.max(4, Math.min(60, randomFileNameLength.value))
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// 存储当前预览的随机文件名
const currentRandomFileName = ref('')

// 生成并缓存随机文件名
const generateAndCacheRandomFileName = () => {
  currentRandomFileName.value = generateRandomFileName()
  return currentRandomFileName.value
}

// 获取最终的文件名
const getFinalFileName = () => {
  if (useRandomFileName.value) {
    // 如果还没有生成过随机文件名，或者设置发生了变化，重新生成
    if (!currentRandomFileName.value) {
      return generateAndCacheRandomFileName()
    }
    return currentRandomFileName.value
  }
  
  const customName = exportFileName.value.trim()
  if (customName === '') {
    return '封面设计'
  }
  
  // 限制文件名长度在4-60个字符之间
  if (customName.length < 4) {
    return customName + '_封面'
  }
  if (customName.length > 60) {
    return customName.substring(0, 60)
  }
  
  return customName
}

// 导出图片
const exportImage = async () => {
  // 确保字体已加载
  await waitForFont()
  
  const canvas = document.createElement('canvas')
  canvas.width = exportWidth.value
  canvas.height = exportHeight.value
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return

  // 绘制背景
  if (backgroundConfig.type === 'image' && backgroundConfig.imageObj) {
    // 绘制图片背景
    ctx.save()
    
    if (backgroundConfig.blur > 0) {
      ctx.filter = `blur(${backgroundConfig.blur}px)`
    }
    
    ctx.drawImage(backgroundConfig.imageObj, 0, 0, canvas.width, canvas.height)
    ctx.restore()
  } else if (backgroundConfig.type === 'color') {
    // 绘制纯色背景，应用透明度
    const opacity = backgroundConfig.opacity / 100
    const color = backgroundConfig.color
    
    // 将十六进制颜色转换为 rgba 格式
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // 绘制图标
  if (iconConfig.svg) {
    const iconPosX = (iconConfig.position.x / 100) * canvas.width
    const iconPosY = (iconConfig.position.y / 100) * canvas.height
    const scaledIconSize = (iconConfig.size / 800) * canvas.width // 根据画布大小缩放
    await drawIconToCanvas(ctx, iconPosX, iconPosY, scaledIconSize)
  }

  // 绘制标题
  if (titleConfig.text) {
    const titlePosX = (titleConfig.position.x / 100) * canvas.width
    const titlePosY = (titleConfig.position.y / 100) * canvas.height
    const scaledTitleSize = (titleConfig.size / 800) * canvas.width // 根据画布大小缩放

    // 保存当前状态
    ctx.save()
    
    // 构建字体样式 - 使用相同的字体回退机制
    const fontWeight = titleConfig.effects.bold ? 'bold' : 'normal'
    
    let fontFamily = ''
    switch (titleConfig.font) {
      case 'Maple Mono CN':
        fontFamily = '"Maple Mono CN", "Courier New", "Consolas", monospace'
        break
      case 'Fira Code':
        fontFamily = '"Fira Code", "Courier New", "Consolas", monospace'
        break
      case 'Lato':
        fontFamily = '"Lato", "Helvetica Neue", "Arial", sans-serif'
        break
      case 'Microsoft YaHei':
        fontFamily = '"Microsoft YaHei", "微软雅黑", "SimHei", "Arial Unicode MS", sans-serif'
        break
      case 'PingFang SC':
        fontFamily = '"PingFang SC", "苹方", "Helvetica Neue", "Arial", sans-serif'
        break
      case 'Source Han Sans CN':
        fontFamily = '"Source Han Sans CN", "思源黑体", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif'
        break
      case 'Arial':
        fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif'
        break
      case 'Helvetica':
        fontFamily = 'Helvetica, "Helvetica Neue", Arial, sans-serif'
        break
      case 'monospace':
        fontFamily = '"Courier New", Consolas, "Liberation Mono", monospace'
        break
      case 'serif':
        fontFamily = '"Times New Roman", Times, "Songti SC", serif'
        break
      default:
        fontFamily = `"${titleConfig.font}", Arial, sans-serif`
    }
    
    ctx.font = `${fontWeight} ${scaledTitleSize}px ${fontFamily}`
    ctx.fillStyle = titleConfig.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 如果需要斜体，使用变换
    if (titleConfig.effects.italic) {
      ctx.translate(titlePosX, titlePosY)
      ctx.transform(1, 0, -0.2, 1, 0, 0)
      
      // 特殊处理 Maple Mono CN 的加粗效果
      if (titleConfig.effects.bold && titleConfig.font === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        ctx.strokeStyle = titleConfig.color
        ctx.lineWidth = 0.8
        ctx.strokeText(titleConfig.text, 0, 0)
      }
      ctx.fillText(titleConfig.text, 0, 0)
    } else {
      // 特殊处理 Maple Mono CN 的加粗效果
      if (titleConfig.effects.bold && titleConfig.font === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        ctx.strokeStyle = titleConfig.color
        ctx.lineWidth = 0.8
        ctx.strokeText(titleConfig.text, titlePosX, titlePosY)
      }
      ctx.fillText(titleConfig.text, titlePosX, titlePosY)
    }
    
    // 恢复状态
    ctx.restore()
  }

  // 绘制水印
  if (watermarkText.value) {
    const watermarkPosX = (watermarkX.value / 100) * canvas.width
    const watermarkPosY = (watermarkY.value / 100) * canvas.height
    const scaledWatermarkSize = (watermarkSize.value / 800) * canvas.width // 根据画布大小缩放

    // 保存当前状态
    ctx.save()
    
    // 构建字体样式 - 使用相同的字体回退机制
    const fontWeight = watermarkBold.value ? 'bold' : 'normal'
    
    let fontFamily = ''
    switch (watermarkFont.value) {
      case 'Maple Mono CN':
        fontFamily = '"Maple Mono CN", "Courier New", "Consolas", monospace'
        break
      case 'Fira Code':
        fontFamily = '"Fira Code", "Courier New", "Consolas", monospace'
        break
      case 'Lato':
        fontFamily = '"Lato", "Helvetica Neue", "Arial", sans-serif'
        break
      case 'Microsoft YaHei':
        fontFamily = '"Microsoft YaHei", "微软雅黑", "SimHei", "Arial Unicode MS", sans-serif'
        break
      case 'PingFang SC':
        fontFamily = '"PingFang SC", "苹方", "Helvetica Neue", "Arial", sans-serif'
        break
      case 'Source Han Sans CN':
        fontFamily = '"Source Han Sans CN", "思源黑体", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif'
        break
      case 'Arial':
        fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif'
        break
      case 'Helvetica':
        fontFamily = 'Helvetica, "Helvetica Neue", Arial, sans-serif'
        break
      case 'monospace':
        fontFamily = '"Courier New", Consolas, "Liberation Mono", monospace'
        break
      case 'serif':
        fontFamily = '"Times New Roman", Times, "Songti SC", serif'
        break
      default:
        fontFamily = `"${watermarkFont.value}", Arial, sans-serif`
    }
    
    ctx.font = `${fontWeight} ${scaledWatermarkSize}px ${fontFamily}`
    ctx.fillStyle = watermarkColor.value
    ctx.globalAlpha = watermarkOpacity.value / 100
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 如果需要斜体，使用变换
    if (watermarkItalic.value) {
      ctx.translate(watermarkPosX, watermarkPosY)
      ctx.transform(1, 0, -0.2, 1, 0, 0)
      
      // 特殊处理 Maple Mono CN 的加粗效果
      if (watermarkBold.value && watermarkFont.value === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        ctx.strokeStyle = watermarkColor.value
        ctx.lineWidth = 0.5
        ctx.strokeText(watermarkText.value, 0, 0)
      }
      ctx.fillText(watermarkText.value, 0, 0)
    } else {
      // 特殊处理 Maple Mono CN 的加粗效果
      if (watermarkBold.value && watermarkFont.value === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        ctx.strokeStyle = watermarkColor.value
        ctx.lineWidth = 0.5
        ctx.strokeText(watermarkText.value, watermarkPosX, watermarkPosY)
      }
      ctx.fillText(watermarkText.value, watermarkPosX, watermarkPosY)
    }
    
    ctx.globalAlpha = 1
    
    // 恢复状态
    ctx.restore()
  }

  // 导出图片 - 处理透明度和格式兼容性
  let mimeType = exportFormat.value === 'jpeg' ? 'image/jpeg' : `image/${exportFormat.value}`
  let quality = 0.9
  
  // 如果是 JPEG 格式且背景有透明度，需要先绘制白色背景
  if (exportFormat.value === 'jpeg' && backgroundConfig.type === 'color' && backgroundConfig.opacity < 100) {
    // 创建一个新的画布来处理 JPEG 的透明度问题
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')
    
    if (tempCtx) {
      // 先绘制白色背景
      tempCtx.fillStyle = '#ffffff'
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
      
      // 然后绘制原始内容
      tempCtx.drawImage(canvas, 0, 0)
      
      // 使用临时画布导出
      const dataURL = tempCanvas.toDataURL(mimeType, quality)
      
      // 创建下载链接
      const link = document.createElement('a')
      const finalFileName = getFinalFileName()
      link.download = `${finalFileName}.jpg`
      link.href = dataURL
      link.click()
      return
    }
  }
  
  const dataURL = canvas.toDataURL(mimeType, quality)
  
  // 创建下载链接
  const link = document.createElement('a')
  const finalFileName = getFinalFileName()
  link.download = `${finalFileName}.${exportFormat.value === 'jpeg' ? 'jpg' : exportFormat.value}`
  link.href = dataURL
  link.click()
}

// 专门用于导出的图标绘制函数
const drawIconToCanvas = async (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  if (!iconConfig.svg) return

  return new Promise<void>((resolve) => {
    const svgBlob = new Blob([iconConfig.svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      // 设置阴影
      if (iconConfig.shadowSize > 0) {
        const scaledShadowSize = (iconConfig.shadowSize / 800) * ctx.canvas.width
        ctx.shadowColor = iconConfig.shadowColor
        ctx.shadowBlur = scaledShadowSize
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // 绘制图标，保持宽高比
      const aspectRatio = img.width / img.height
      let drawWidth = size
      let drawHeight = size

      if (aspectRatio > 1) {
        drawHeight = size / aspectRatio
      } else {
        drawWidth = size * aspectRatio
      }

      ctx.drawImage(img, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)

      // 清除阴影
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      URL.revokeObjectURL(url)
      resolve()
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve()
    }

    img.src = url
  })
}

// 监听随机文件名设置变化，清除缓存
watch([randomFileNameLength, randomFileNameOptions], () => {
  if (useRandomFileName.value) {
    currentRandomFileName.value = '' // 清除缓存，强制重新生成
  }
}, { deep: true })

// 监听是否使用随机文件名的变化
watch(useRandomFileName, (newValue) => {
  if (newValue) {
    // 切换到随机文件名时，生成一个新的
    generateAndCacheRandomFileName()
  } else {
    // 切换到自定义文件名时，清除随机文件名缓存
    currentRandomFileName.value = ''
  }
})

// 初始化动画状态
const initAnimationStates = () => {
  // 初始化标题相关动画状态
  animationStates.titleSize.value = animationStates.titleSize.target = titleConfig.size;
  animationStates.titleX.value = animationStates.titleX.target = titleConfig.position.x;
  animationStates.titleY.value = animationStates.titleY.target = titleConfig.position.y;
  
  // 初始化水印相关动画状态
  animationStates.watermarkSize.value = animationStates.watermarkSize.target = watermarkSize.value;
  animationStates.watermarkX.value = animationStates.watermarkX.target = watermarkX.value;
  animationStates.watermarkY.value = animationStates.watermarkY.target = watermarkY.value;
  animationStates.watermarkOpacity.value = animationStates.watermarkOpacity.target = watermarkOpacity.value;
  
  // 初始化图标相关动画状态
  animationStates.iconSize.value = animationStates.iconSize.target = iconConfig.size;
  animationStates.iconX.value = animationStates.iconX.target = iconConfig.position.x;
  animationStates.iconY.value = animationStates.iconY.target = iconConfig.position.y;
  
  // 初始化背景模糊动画状态
  animationStates.backgroundBlur.value = animationStates.backgroundBlur.target = backgroundConfig.blur;
};

// 组件挂载时初始化
onMounted(async () => {
  // 初始化动画状态
  initAnimationStates();
  
  // 先加载图标
  await loadIcon()
  
  // 等待字体加载完成后再更新画布
  await waitForFont()
  
  // 初始渲染
  renderCurrentFrame();
  
  // 如果字体仍未加载完成，设置一个延迟重试
  if (!fontLoaded) {
    setTimeout(async () => {
      await checkFontLoaded()
      renderCurrentFrame();
    }, 1000)
  }
  
  // 如果默认使用随机文件名，初始化生成一个
  if (useRandomFileName.value) {
    generateAndCacheRandomFileName()
  }
})
</script>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
