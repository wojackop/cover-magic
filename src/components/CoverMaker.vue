<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
    <!-- 顶部标题栏 -->
    <div class="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <h1 class="text-3xl font-bold text-gray-800 text-center">🎨 封面制作工具</h1>
        <p class="text-gray-600 text-center mt-2">专业的封面设计工具，支持实时预览和高质量导出</p>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- 预览区域 -->
      <div class="mb-8">
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <div class="flex justify-center">
            <canvas 
              ref="previewCanvas"
              class="border-2 border-gray-300 rounded-lg shadow-lg w-full max-w-4xl"
              :width="800"
              :height="450"
              style="width: 100%; height: auto; max-width: 800px;"
            ></canvas>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <!-- 背景设置 -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-2xl">🎭</span> 背景设置
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">背景类型</label>
              <div class="flex space-x-2">
                <button 
                  @click="backgroundType = 'color'"
                  :class="backgroundType === 'color' ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white shadow-md transform scale-105' : 'px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200'"
                >
                  🎨 纯色
                </button>
                <button 
                  @click="backgroundType = 'image'"
                  :class="backgroundType === 'image' ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white shadow-md transform scale-105' : 'px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200'"
                >
                  🖼️ 图片
                </button>
              </div>
            </div>
            
            <div v-if="backgroundType === 'color'">
              <label class="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
              <input 
                v-model="backgroundColor" 
                type="color" 
                class="w-full h-12 rounded-lg border-2 border-gray-300"
                @input="updateCanvas"
              >
            </div>
            
            <div v-if="backgroundType === 'image'">
              <label class="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
              <input 
                @change="handleImageUpload" 
                type="file" 
                accept="image/*"
                class="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-all file:duration-200"
              >
            </div>
            
            <div v-if="backgroundType === 'image' && backgroundImage">
              <label class="block text-sm font-medium text-gray-700 mb-2">模糊度</label>
              <input 
                v-model="blurAmount" 
                type="range" 
                min="0" 
                max="20" 
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                @input="updateCanvas"
              >
              <span class="text-sm text-gray-500">{{ blurAmount }}px</span>
            </div>
          </div>
        </div>

        <!-- 图标设置 -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-2xl">⭐</span> 图标设置
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">图标代码</label>
              <input 
                v-model="iconCode" 
                type="text"
                placeholder="如: fluent-emoji-flat:four-leaf-clover"
                class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                @input="loadIcon"
              >
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">大小</label>
                <input 
                  v-model="iconSize" 
                  type="range" 
                  min="20" 
                  max="200" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ iconSize }}px</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">阴影大小</label>
                <input 
                  v-model="iconShadowSize" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ iconShadowSize }}px</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">阴影颜色</label>
              <input 
                v-model="iconShadowColor" 
                type="color" 
                class="w-full h-12 rounded-lg border-2 border-gray-300"
                @input="updateCanvas"
              >
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">水平位置</label>
                <input 
                  v-model="iconX" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ iconX }}%</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">垂直位置</label>
                <input 
                  v-model="iconY" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ iconY }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 标题设置 -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-2xl">📝</span> 标题设置
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">标题文本</label>
              <input 
                v-model="titleText" 
                type="text" 
                placeholder="输入标题..."
                class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                @input="updateCanvas"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">字体</label>
              <select v-model="titleFont" class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200" @change="updateCanvas">
                <option value="Arial, sans-serif">无衬线字体</option>
                <option value="serif">衬线字体</option>
                <option value="monospace">等宽字体</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
                <input 
                  v-model="titleSize" 
                  type="range" 
                  min="16" 
                  max="80" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ titleSize }}px</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                <input 
                  v-model="titleColor" 
                  type="color" 
                  class="w-full h-12 rounded-lg border-2 border-gray-300"
                  @input="updateCanvas"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">水平位置</label>
                <input 
                  v-model="titleX" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ titleX }}%</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">垂直位置</label>
                <input 
                  v-model="titleY" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ titleY }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 水印设置 -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-2xl">💧</span> 水印设置
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">水印文本</label>
              <input 
                v-model="watermarkText" 
                type="text" 
                placeholder="输入水印..."
                class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                @input="updateCanvas"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">字体</label>
              <select v-model="watermarkFont" class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200" @change="updateCanvas">
                <option value="Arial, sans-serif">无衬线字体</option>
                <option value="serif">衬线字体</option>
                <option value="monospace">等宽字体</option>
              </select>
            </div>
            
            <div>
              <label class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                <input 
                  v-model="watermarkItalic" 
                  type="checkbox"
                  class="w-5 h-5 rounded border-gray-300 bg-white text-blue-500 focus:ring-blue-400 focus:ring-2"
                  @change="updateCanvas"
                >
                <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span class="text-lg">✨</span> 斜体
                </span>
              </label>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
                <input 
                  v-model="watermarkSize" 
                  type="range" 
                  min="10" 
                  max="40" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ watermarkSize }}px</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">透明度</label>
                <input 
                  v-model="watermarkOpacity" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ watermarkOpacity }}%</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">颜色</label>
              <input 
                v-model="watermarkColor" 
                type="color" 
                class="w-full h-12 rounded-lg border-2 border-gray-300"
                @input="updateCanvas"
              >
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">水平位置</label>
                <input 
                  v-model="watermarkX" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ watermarkX }}%</span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">垂直位置</label>
                <input 
                  v-model="watermarkY" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
                  @input="updateCanvas"
                >
                <span class="text-sm text-gray-500">{{ watermarkY }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 导出设置 -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg lg:col-span-2 xl:col-span-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-2xl">📤</span> 导出设置
          </h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">宽度</label>
                <input 
                  v-model="exportWidth" 
                  type="number" 
                  min="100" 
                  max="4000"
                  class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">高度</label>
                <input 
                  v-model="exportHeight" 
                  type="number" 
                  min="100" 
                  max="4000"
                  class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">格式</label>
              <select v-model="exportFormat" class="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-200">
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
            
            <button 
              @click="exportImage"
              class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span class="text-xl">🚀</span>
              导出图片
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// 背景设置
const backgroundType = ref<'color' | 'image'>('color')
const backgroundColor = ref('#000000')
const backgroundImage = ref<string>('')
const backgroundImageObj = ref<HTMLImageElement | null>(null)
const blurAmount = ref(0)

// 图标设置
const iconCode = ref('fluent-emoji-flat:four-leaf-clover')
const iconSize = ref(80)
const iconShadowSize = ref(50)
const iconShadowColor = ref('#ffffff')
const iconX = ref(50)
const iconY = ref(50)
const iconSvg = ref<string>('')

// 标题设置
const titleText = ref('谜叶        象限')
const titleFont = ref('Arial, sans-serif')
const titleSize = ref(50)
const titleColor = ref('#ffffff')
const titleX = ref(50)
const titleY = ref(50)

// 水印设置
const watermarkText = ref('@baiwumm')
const watermarkFont = ref('monospace')
const watermarkSize = ref(18)
const watermarkOpacity = ref(30)
const watermarkColor = ref('#ffffff')
const watermarkX = ref(90)
const watermarkY = ref(93)
const watermarkItalic = ref(false)

// 导出设置
const exportWidth = ref(800)
const exportHeight = ref(450)
const exportFormat = ref('png')

// 画布引用和缓存变量
const previewCanvas = ref<HTMLCanvasElement>()
let iconImageCache: HTMLImageElement | null = null
let updateTimer: number | null = null
let isUpdating = false

// 加载图标
const loadIcon = async () => {
  if (!iconCode.value) {
    iconSvg.value = ''
    iconImageCache = null // 清除缓存
    updateCanvas()
    return
  }

  try {
    // 从 Iconify API 获取 SVG
    const response = await fetch(`https://api.iconify.design/${iconCode.value}.svg`)
    if (response.ok) {
      iconSvg.value = await response.text()
      iconImageCache = null // 清除旧缓存
    } else {
      iconSvg.value = ''
      iconImageCache = null
    }
    updateCanvas()
  } catch (error) {
    console.error('加载图标失败:', error)
    iconSvg.value = ''
    iconImageCache = null
    updateCanvas()
  }
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      backgroundImage.value = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        backgroundImageObj.value = img
        updateCanvas()
      }
      img.src = backgroundImage.value
    }
    reader.readAsDataURL(file)
  }
}

// 绘制阴影
const drawShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  if (iconShadowSize.value > 0) {
    ctx.shadowColor = iconShadowColor.value
    ctx.shadowBlur = iconShadowSize.value
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
  if (!iconSvg.value) return

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
    
    ctx.drawImage(iconImageCache, x - drawWidth/2, y - drawHeight/2, drawWidth, drawHeight)
    
    // 清除阴影
    clearShadow(ctx)
    return
  }

  // 如果没有缓存，创建新的图标
  return new Promise<void>((resolve) => {
    const svgBlob = new Blob([iconSvg.value], { type: 'image/svg+xml' })
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
      
      ctx.drawImage(img, x - drawWidth/2, y - drawHeight/2, drawWidth, drawHeight)
      
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

// 防抖更新画布
const debouncedUpdateCanvas = () => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  
  updateTimer = setTimeout(() => {
    updateCanvasImmediate()
  }, 16) // 约60fps的更新频率
}

// 立即更新画布（内部使用）
const updateCanvasImmediate = async () => {
  if (isUpdating) return
  isUpdating = true
  
  await nextTick()
  
  const canvas = previewCanvas.value
  if (!canvas) {
    isUpdating = false
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    isUpdating = false
    return
  }

  // 使用requestAnimationFrame确保平滑渲染
  requestAnimationFrame(async () => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制背景
    if (backgroundType.value === 'color') {
      ctx.fillStyle = backgroundColor.value
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (backgroundImageObj.value) {
      // 绘制背景图片
      ctx.filter = `blur(${blurAmount.value}px)`
      ctx.drawImage(backgroundImageObj.value, 0, 0, canvas.width, canvas.height)
      ctx.filter = 'none'
    }

    // 绘制图标
    if (iconSvg.value) {
      const iconPosX = (iconX.value / 100) * canvas.width
      const iconPosY = (iconY.value / 100) * canvas.height
      await drawIcon(ctx, iconPosX, iconPosY, iconSize.value)
    }

    // 绘制标题
    if (titleText.value) {
      const titlePosX = (titleX.value / 100) * canvas.width
      const titlePosY = (titleY.value / 100) * canvas.height
      
      ctx.font = `bold ${titleSize.value}px ${titleFont.value}`
      ctx.fillStyle = titleColor.value
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(titleText.value, titlePosX, titlePosY)
    }

    // 绘制水印
    if (watermarkText.value) {
      const watermarkPosX = (watermarkX.value / 100) * canvas.width
      const watermarkPosY = (watermarkY.value / 100) * canvas.height
      
      const fontStyle = watermarkItalic.value ? 'italic' : 'normal'
      ctx.font = `${fontStyle} ${watermarkSize.value}px ${watermarkFont.value}`
      ctx.fillStyle = watermarkColor.value
      ctx.globalAlpha = watermarkOpacity.value / 100
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(watermarkText.value, watermarkPosX, watermarkPosY)
      ctx.globalAlpha = 1
    }
    
    isUpdating = false
  })
}

// 对外暴露的更新函数
const updateCanvas = debouncedUpdateCanvas

// 导出图片
const exportImage = () => {
  const canvas = document.createElement('canvas')
  canvas.width = exportWidth.value
  canvas.height = exportHeight.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const scaleX = exportWidth.value / 800
  const scaleY = exportHeight.value / 450

  // 绘制背景
  if (backgroundType.value === 'color') {
    ctx.fillStyle = backgroundColor.value
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else if (backgroundImageObj.value) {
    ctx.filter = `blur(${blurAmount.value * Math.min(scaleX, scaleY)}px)`
    ctx.drawImage(backgroundImageObj.value, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'
  }

  // 绘制图标
  if (iconSvg.value) {
    const iconPosX = (iconX.value / 100) * canvas.width
    const iconPosY = (iconY.value / 100) * canvas.height
    const scaledIconSize = iconSize.value * Math.min(scaleX, scaleY)
    
    const svgBlob = new Blob([iconSvg.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    
    img.onload = () => {
      // 设置阴影
      if (iconShadowSize.value > 0) {
        ctx.shadowColor = iconShadowColor.value
        ctx.shadowBlur = iconShadowSize.value * Math.min(scaleX, scaleY)
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }
      
      // 绘制图标，保持宽高比
      const aspectRatio = img.width / img.height
      let drawWidth = scaledIconSize
      let drawHeight = scaledIconSize
      
      if (aspectRatio > 1) {
        drawHeight = scaledIconSize / aspectRatio
      } else {
        drawWidth = scaledIconSize * aspectRatio
      }
      
      ctx.drawImage(img, iconPosX - drawWidth/2, iconPosY - drawHeight/2, drawWidth, drawHeight)
      
      // 清除阴影
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      
      // 绘制标题
      if (titleText.value) {
        const titlePosX = (titleX.value / 100) * canvas.width
        const titlePosY = (titleY.value / 100) * canvas.height
        
        ctx.font = `bold ${titleSize.value * Math.min(scaleX, scaleY)}px ${titleFont.value}`
        ctx.fillStyle = titleColor.value
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(titleText.value, titlePosX, titlePosY)
      }

      // 绘制水印
      if (watermarkText.value) {
        const watermarkPosX = (watermarkX.value / 100) * canvas.width
        const watermarkPosY = (watermarkY.value / 100) * canvas.height
        
        const fontStyle = watermarkItalic.value ? 'italic' : 'normal'
        ctx.font = `${fontStyle} ${watermarkSize.value * Math.min(scaleX, scaleY)}px ${watermarkFont.value}`
        ctx.fillStyle = watermarkColor.value
        ctx.globalAlpha = watermarkOpacity.value / 100
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(watermarkText.value, watermarkPosX, watermarkPosY)
        ctx.globalAlpha = 1
      }

      // 导出图片
      const link = document.createElement('a')
      link.download = `cover.${exportFormat.value}`
      link.href = canvas.toDataURL(`image/${exportFormat.value}`)
      link.click()
      
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  } else {
    // 没有图标时直接绘制文字
    // 绘制标题
    if (titleText.value) {
      const titlePosX = (titleX.value / 100) * canvas.width
      const titlePosY = (titleY.value / 100) * canvas.height
      
      ctx.font = `bold ${titleSize.value * Math.min(scaleX, scaleY)}px ${titleFont.value}`
      ctx.fillStyle = titleColor.value
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(titleText.value, titlePosX, titlePosY)
    }

    // 绘制水印
    if (watermarkText.value) {
      const watermarkPosX = (watermarkX.value / 100) * canvas.width
      const watermarkPosY = (watermarkY.value / 100) * canvas.height
      
      const fontStyle = watermarkItalic.value ? 'italic' : 'normal'
      ctx.font = `${fontStyle} ${watermarkSize.value * Math.min(scaleX, scaleY)}px ${watermarkFont.value}`
      ctx.fillStyle = watermarkColor.value
      ctx.globalAlpha = watermarkOpacity.value / 100
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(watermarkText.value, watermarkPosX, watermarkPosY)
      ctx.globalAlpha = 1
    }

    // 导出图片
    const link = document.createElement('a')
    link.download = `cover.${exportFormat.value}`
    link.href = canvas.toDataURL(`image/${exportFormat.value}`)
    link.click()
  }
}

// 组件挂载后初始化
onMounted(async () => {
  await loadIcon()
  updateCanvas()
})
</script>

<style scoped>
/* 自定义滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: #e5e7eb;
  border-radius: 4px;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-track {
  width: 100%;
  height: 8px;
  cursor: pointer;
  background: #e5e7eb;
  border-radius: 4px;
}

/* 输入框聚焦效果 */
input:focus, select:focus {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 卡片悬停效果 */
.bg-white\/90:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
</style>
