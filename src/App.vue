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
          <WatermarkPanel
            :watermarkConfig="watermarkConfig"
            @update:watermarkConfig="(newWatermarkConfig) => { 
              Object.assign(watermarkConfig, newWatermarkConfig); 
              updateCanvas();
            }"
            @canvas-update="updateCanvas"
          />
        </n-grid-item>

        <!-- 导出设置 -->
        <n-grid-item>
          <ExportPanel
            :exportConfig="exportConfig"
            @update:exportConfig="(newExportConfig) => { 
              Object.assign(exportConfig, newExportConfig); 
            }"
            @export-image="exportImage"
          />
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { 
  NButton, 
  NInput, 
  NSlider, 
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
import WatermarkPanel from '@/components/WatermarkPanel.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import type { BackgroundConfig, IconConfig, TitleConfig, WatermarkConfig, ExportConfig } from '@/lib/type'

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

// 水印设置 - 用于控制封面水印的各项属性
const watermarkConfig = reactive<WatermarkConfig>({
  text: '@baiwumm',           // 水印文本：显示在封面上的水印内容
  font: 'Maple Mono CN',      // 字体名称：指定水印文本使用的字体
  size: 24,                   // 字体大小：控制水印文本的显示尺寸，单位为像素
  color: '#ffffff',           // 字体颜色：指定水印文本的颜色，默认为白色
  opacity: 80,                // 不透明度：控制水印的透明度，范围0-100，100表示完全不透明
  position: {                 // 水印位置：控制水印在画布中的位置
    x: 90,                    // 水平位置：以百分比表示，90表示靠右
    y: 95                     // 垂直位置：以百分比表示，95表示靠下
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
  animationStates.watermarkSize.target = watermarkConfig.size;
  animationStates.watermarkX.target = watermarkConfig.position.x;
  animationStates.watermarkY.target = watermarkConfig.position.y;
  animationStates.watermarkOpacity.target = watermarkConfig.opacity;
  
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
          ctx.lineWidth = titleConfig.size * 2 * 0.01 // 根据字体大小调整描边宽度
          ctx.strokeText(titleConfig.text, titlePosX, titlePosY)
        }
        ctx.fillText(titleConfig.text, titlePosX, titlePosY)
      }
      ctx.restore()
    }

    // 绘制水印
    if (watermarkConfig.text) {
      const watermarkPosX = (currentWatermarkX / 100) * canvas.width
      const watermarkPosY = (currentWatermarkY / 100) * canvas.height
      const watermarkOpacity = watermarkConfig.opacity / 100

      ctx.save()
      ctx.globalAlpha = watermarkOpacity
      ctx.fillStyle = watermarkConfig.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 构建字体字符串
      let fontWeight = watermarkConfig.effects.bold ? 'bold' : 'normal'
      
      // 改进字体回退机制
      let fontFamily = ''
      switch (watermarkConfig.font) {
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
          fontFamily = `"${watermarkConfig.font}", Arial, sans-serif`
      }
      
      ctx.font = `${fontWeight} ${watermarkConfig.size}px ${fontFamily}`
      
      // 如果需要斜体，使用变换
      if (watermarkConfig.effects.italic) {
        ctx.translate(watermarkPosX, watermarkPosY)
        ctx.transform(1, 0, -0.2, 1, 0, 0)
        
        // 特殊处理 Maple Mono CN 的加粗效果
        if (watermarkConfig.effects.bold && watermarkConfig.font === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = watermarkConfig.color
          ctx.lineWidth = watermarkConfig.size * 0.01 // 根据字体大小调整描边宽度
          ctx.strokeText(watermarkConfig.text, 0, 0)
        }
        ctx.fillText(watermarkConfig.text, 0, 0)
      } else {
        // 特殊处理 Maple Mono CN 的加粗效果
        if (watermarkConfig.effects.bold && watermarkConfig.font === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = watermarkConfig.color
          ctx.lineWidth = watermarkConfig.size * 0.01 // 根据字体大小调整描边宽度
          ctx.strokeText(watermarkConfig.text, watermarkPosX, watermarkPosY)
        }
        ctx.fillText(watermarkConfig.text, watermarkPosX, watermarkPosY)
      }
      ctx.restore()
    }
}

// 更新画布 - 公共入口点
const updateCanvas = () => {
  debouncedUpdateCanvas()
}

// 导出图片
const exportImage = async () => {
  const canvas = previewCanvas.value
  if (!canvas) return
  
  // 创建一个新的离屏画布，用于导出
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = exportConfig.width
  exportCanvas.height = exportConfig.height
  
  const exportCtx = exportCanvas.getContext('2d', { alpha: false })
  if (!exportCtx) return
  
  // 等待字体加载完成
  await waitForFont()
  
  // 清空导出画布
  exportCtx.fillStyle = '#ffffff'
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
  
  // 绘制背景
  if (backgroundConfig.type === 'color') {
    // 绘制纯色背景，应用透明度
    const opacity = backgroundConfig.opacity / 100
    const color = backgroundConfig.color
    
    // 将十六进制颜色转换为 rgba 格式
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    
    exportCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
  } else if (backgroundConfig.imageObj) {
    // 绘制背景图片
    exportCtx.filter = `blur(${backgroundConfig.blur}px)`
    exportCtx.drawImage(backgroundConfig.imageObj, 0, 0, exportCanvas.width, exportCanvas.height)
    exportCtx.filter = 'none'
  }
  
  // 绘制图标
  if (iconConfig.svg) {
    const iconPosX = (iconConfig.position.x / 100) * exportCanvas.width
    const iconPosY = (iconConfig.position.y / 100) * exportCanvas.height
    const iconSize = iconConfig.size * (exportCanvas.width / canvas.width) // 按比例缩放
    
    // 设置阴影
    if (iconConfig.shadowSize > 0) {
      exportCtx.shadowColor = iconConfig.shadowColor
      exportCtx.shadowBlur = iconConfig.shadowSize * (exportCanvas.width / canvas.width) // 按比例缩放
      exportCtx.shadowOffsetX = 0
      exportCtx.shadowOffsetY = 0
    }
    
    // 如果缓存的图标存在且可用，直接使用
    if (iconImageCache) {
      // 绘制图标，保持宽高比
      const aspectRatio = iconImageCache.width / iconImageCache.height
      let drawWidth = iconSize
      let drawHeight = iconSize
      
      if (aspectRatio > 1) {
        drawHeight = iconSize / aspectRatio
      } else {
        drawWidth = iconSize * aspectRatio
      }
      
      exportCtx.drawImage(iconImageCache, iconPosX - drawWidth / 2, iconPosY - drawHeight / 2, drawWidth, drawHeight)
    } else {
      // 如果没有缓存，创建新的图标
      const svgBlob = new Blob([iconConfig.svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          // 绘制图标，保持宽高比
          const aspectRatio = img.width / img.height
          let drawWidth = iconSize
          let drawHeight = iconSize
          
          if (aspectRatio > 1) {
            drawHeight = iconSize / aspectRatio
          } else {
            drawWidth = iconSize * aspectRatio
          }
          
          exportCtx.drawImage(img, iconPosX - drawWidth / 2, iconPosY - drawHeight / 2, drawWidth, drawHeight)
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
    
    // 清除阴影
    exportCtx.shadowColor = 'transparent'
    exportCtx.shadowBlur = 0
    exportCtx.shadowOffsetX = 0
    exportCtx.shadowOffsetY = 0
  }
  
  // 绘制标题
  if (titleConfig.text) {
    const titlePosX = (titleConfig.position.x / 100) * exportCanvas.width
    const titlePosY = (titleConfig.position.y / 100) * exportCanvas.height
    const titleSize = titleConfig.size * (exportCanvas.width / canvas.width) // 按比例缩放
    
    exportCtx.fillStyle = titleConfig.color
    exportCtx.textAlign = 'center'
    exportCtx.textBaseline = 'middle'
    
    // 构建字体字符串
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
    
    exportCtx.font = `${fontWeight} ${titleSize}px ${fontFamily}`
    
    exportCtx.save()
    // 如果需要斜体，使用变换
    if (titleConfig.effects.italic) {
      exportCtx.translate(titlePosX, titlePosY)
      exportCtx.transform(1, 0, -0.2, 1, 0, 0)
      
      // 特殊处理 Maple Mono CN 的加粗效果
      if (titleConfig.effects.bold && titleConfig.font === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        exportCtx.strokeStyle = titleConfig.color
        exportCtx.lineWidth = titleSize * 0.01 // 根据字体大小调整描边宽度
        exportCtx.strokeText(titleConfig.text, 0, 0)
      }
      exportCtx.fillText(titleConfig.text, 0, 0)
    } else {
      // 特殊处理 Maple Mono CN 的加粗效果
      if (titleConfig.effects.bold && titleConfig.font === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        exportCtx.strokeStyle = titleConfig.color
        exportCtx.lineWidth = titleSize * 0.01 // 根据字体大小调整描边宽度
        exportCtx.strokeText(titleConfig.text, titlePosX, titlePosY)
      }
      exportCtx.fillText(titleConfig.text, titlePosX, titlePosY)
    }
    exportCtx.restore()
  }
  
  // 绘制水印
  if (watermarkConfig.text) {
    const watermarkPosX = (watermarkConfig.position.x / 100) * exportCanvas.width
    const watermarkPosY = (watermarkConfig.position.y / 100) * exportCanvas.height
    const watermarkSize = watermarkConfig.size * (exportCanvas.width / canvas.width) // 按比例缩放
    const watermarkOpacity = watermarkConfig.opacity / 100
    
    exportCtx.save()
    exportCtx.globalAlpha = watermarkOpacity
    exportCtx.fillStyle = watermarkConfig.color
    exportCtx.textAlign = 'center'
    exportCtx.textBaseline = 'middle'
    
    // 构建字体字符串
    let fontWeight = watermarkConfig.effects.bold ? 'bold' : 'normal'
    
    // 改进字体回退机制
    let fontFamily = ''
    switch (watermarkConfig.font) {
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
        fontFamily = `"${watermarkConfig.font}", Arial, sans-serif`
    }
    
    exportCtx.font = `${fontWeight} ${watermarkSize}px ${fontFamily}`
    
    // 如果需要斜体，使用变换
    if (watermarkConfig.effects.italic) {
      exportCtx.translate(watermarkPosX, watermarkPosY)
      exportCtx.transform(1, 0, -0.2, 1, 0, 0)
      
      // 特殊处理 Maple Mono CN 的加粗效果
      if (watermarkConfig.effects.bold && watermarkConfig.font === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        exportCtx.strokeStyle = watermarkConfig.color
        exportCtx.lineWidth = watermarkSize * 0.01 // 根据字体大小调整描边宽度
        exportCtx.strokeText(watermarkConfig.text, 0, 0)
      }
      exportCtx.fillText(watermarkConfig.text, 0, 0)
    } else {
      // 特殊处理 Maple Mono CN 的加粗效果
      if (watermarkConfig.effects.bold && watermarkConfig.font === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        exportCtx.strokeStyle = watermarkConfig.color
        exportCtx.lineWidth = watermarkSize * 0.01 // 根据字体大小调整描边宽度
        exportCtx.strokeText(watermarkConfig.text, watermarkPosX, watermarkPosY)
      }
      exportCtx.fillText(watermarkConfig.text, watermarkPosX, watermarkPosY)
    }
    exportCtx.restore()
  }
  
// 获取最终文件名
  const getFinalFileName = () => {
    return exportConfig.useRandomFileName && exportConfig.currentRandomFileName
      ? exportConfig.currentRandomFileName
      : exportConfig.fileName
  }
  
  // 导出图片
  const dataURL = exportCanvas.toDataURL(`image/${exportConfig.format}`, 1.0)
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = dataURL
  link.download = `${getFinalFileName()}.${exportConfig.format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 组件挂载时初始化
onMounted(async () => {
  // 等待字体加载
  await waitForFont()
  
  // 初始化画布
  updateCanvas()
  
  // 加载初始图标
  if (iconConfig.code) {
    loadIcon()
  }
})
</script>
