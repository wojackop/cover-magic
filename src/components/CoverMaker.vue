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
          <n-card size="large" hoverable class="h-full">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon icon="material-symbols:image" class="text-xl text-purple-600" />
                <span class="font-semibold">背景设置</span>
              </div>
            </template>
            <n-space vertical size="large">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">背景类型</label>
                <n-space>
                  <n-button strong secondary round :type="backgroundType === 'color' ? 'primary' : 'default'"
                    @click="backgroundType = 'color'; updateCanvas()">
                    <template #icon>
                      <Icon icon="material-symbols:palette" />
                    </template>
                    纯色
                  </n-button>
                  <n-button strong secondary round :type="backgroundType === 'color' ? 'default' : 'primary'"
                    @click="backgroundType = 'image'; updateCanvas()">
                    <template #icon>
                      <Icon icon="material-symbols:image" />
                    </template>
                    图片
                  </n-button>
                </n-space>
              </div>

              <div v-if="backgroundType === 'color'">
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:palette" class="text-lg" />
                  背景颜色
                </label>
                <n-color-picker 
                  v-model:value="backgroundColor" 
                  @update:value="updateCanvas"
                  :swatches="colorSwatches"
                  :show-alpha="false"
                />
                
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:opacity" class="text-lg" />
                    背景透明度
                  </label>
                  <n-slider v-model:value="backgroundOpacity" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ backgroundOpacity }}%</span>
                </div>
              </div>

              <div v-if="backgroundType === 'image'">
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:upload" class="text-lg" />
                  上传图片
                </label>
                <n-upload @change="handleImageUpload" accept="image/*" :show-file-list="false">
                  <n-upload-dragger>
                    <div style="margin-bottom: 12px">
                      <Icon icon="material-symbols:folder-open" style="font-size: 48px; color: #999;" />
                    </div>
                    <div>点击或拖拽文件到此区域上传</div>
                    <div style="margin-top: 8px; color: #999">支持 JPG、PNG、GIF 等图片格式</div>
                  </n-upload-dragger>
                </n-upload>
              </div>

              <div v-if="backgroundType === 'image' && backgroundImage">
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:blur-on" class="text-lg" />
                  模糊度
                </label>
                <n-slider v-model:value="blurAmount" :min="0" :max="20" :step="1" @update:value="updateCanvas" />
                <span class="text-sm text-gray-500">{{ blurAmount }}px</span>
              </div>
            </n-space>
          </n-card>
        </n-grid-item>

        <!-- 图标设置 -->
        <n-grid-item>
          <n-card size="large" hoverable class="h-full">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon icon="material-symbols:star" class="text-xl text-yellow-600" />
                <span class="font-semibold">图标设置</span>
              </div>
            </template>
            <n-space vertical size="large">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:code" class="text-lg" />
                  图标代码
                </label>
                <n-input v-model:value="iconCode" placeholder="如: fluent-emoji-flat:four-leaf-clover" @input="loadIcon">
                  <template #prefix>
                    <Icon icon="material-symbols:search" />
                  </template>
                  <template #suffix>
                    <Icon :icon="iconCode" />
                  </template>
                </n-input>
              </div>

              <n-grid cols="2" :x-gap="16">
                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:photo-size-select-large" class="text-lg" />
                    大小
                  </label>
                  <n-slider v-model:value="iconSize" :min="20" :max="200" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ iconSize }}px</span>
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:shadow" class="text-lg" />
                    阴影大小
                  </label>
                  <n-slider v-model:value="iconShadowSize" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ iconShadowSize }}px</span>
                </n-grid-item>
              </n-grid>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:palette" class="text-lg" />
                  阴影颜色
                </label>
                <n-color-picker 
                  v-model:value="iconShadowColor" 
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
                  <n-slider v-model:value="iconX" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ iconX }}%</span>
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:swap-vert" class="text-lg" />
                    垂直位置
                  </label>
                  <n-slider v-model:value="iconY" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ iconY }}%</span>
                </n-grid-item>
              </n-grid>
            </n-space>
          </n-card>
        </n-grid-item>

        <!-- 标题设置 -->
        <n-grid-item>
          <n-card size="large" hoverable class="h-full">
            <template #header>
              <div class="flex items-center gap-2">
                <Icon icon="material-symbols:title" class="text-xl text-green-600" />
                <span class="font-semibold">标题设置</span>
              </div>
            </template>
            <n-space vertical size="large">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Icon icon="material-symbols:text-fields" class="text-lg" />
                  标题文本
                </label>
                <n-input v-model:value="titleText" placeholder="输入标题..." @input="updateCanvas">
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
                <n-select v-model:value="titleFont" @update:value="updateCanvas" :options="fontOptions" />
              </div>

              <div>
                <n-space>
                  <n-checkbox v-model:checked="titleBold" @update:checked="updateCanvas">
                    <span class="flex items-center gap-2">
                      <Icon icon="material-symbols:format-bold" class="text-lg" />
                      加粗
                    </span>
                  </n-checkbox>
                  <n-checkbox v-model:checked="titleItalic" @update:checked="updateCanvas">
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
                  <n-slider v-model:value="titleSize" :min="16" :max="120" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ titleSize }}px</span>
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:palette" class="text-lg" />
                    颜色
                  </label>
                  <n-color-picker 
                    v-model:value="titleColor" 
                    @update:value="updateCanvas"
                    :swatches="colorSwatches"
                    :show-alpha="false"
                  />
                </n-grid-item>
              </n-grid>

              <n-grid cols="2" :x-gap="16">
                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:swap-horiz" class="text-lg" />
                    水平位置
                  </label>
                  <n-slider v-model:value="titleX" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ titleX }}%</span>
                </n-grid-item>

                <n-grid-item>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:swap-vert" class="text-lg" />
                    垂直位置
                  </label>
                  <n-slider v-model:value="titleY" :min="0" :max="100" :step="1" @update:value="updateCanvas" />
                  <span class="text-sm text-gray-500">{{ titleY }}%</span>
                </n-grid-item>
              </n-grid>
            </n-space>
          </n-card>
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
  NUpload,
  NUploadDragger,
  NCard,
  NSpace,
  NGrid,
  NGridItem
} from 'naive-ui'

// 背景设置
const backgroundType = ref<'color' | 'image'>('color')
const backgroundColor = ref('#000000')
const backgroundOpacity = ref(100)
const backgroundImage = ref<string>('')
const backgroundImageObj = ref<HTMLImageElement | null>(null)
const blurAmount = ref(0)

// 图标设置
const iconCode = ref('fluent-emoji-flat:four-leaf-clover')
const iconSize = ref(100)
const iconShadowSize = ref(100)
const iconShadowColor = ref('#ffffff')
const iconX = ref(50)
const iconY = ref(50)
const iconSvg = ref<string>('')

// 标题设置
const titleText = ref('谜叶  象限')

// 字体选项（共享）
const fontOptions = [
  { label: 'Maple Mono CN (默认)', value: 'Maple Mono CN' },
  { label: 'Fira Code', value: 'Fira Code' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: '苹方', value: 'PingFang SC' },
  { label: '思源黑体', value: 'Source Han Sans CN' },
  { label: '等宽字体', value: 'monospace' },
  { label: '衬线字体', value: 'serif' }
]

// 标题样式配置
const titleStyle = reactive({
  font: 'Maple Mono CN',
  size: 80,
  color: '#ffffff',
  position: {
    x: 50,
    y: 50
  },
  effects: {
    bold: true,
    italic: true
  }
})

// 为了保持向后兼容，创建计算属性
const titleFont = computed({
  get: () => titleStyle.font,
  set: (value) => titleStyle.font = value
})
const titleSize = computed({
  get: () => titleStyle.size,
  set: (value) => titleStyle.size = value
})
const titleColor = computed({
  get: () => titleStyle.color,
  set: (value) => titleStyle.color = value
})
const titleX = computed({
  get: () => titleStyle.position.x,
  set: (value) => titleStyle.position.x = value
})
const titleY = computed({
  get: () => titleStyle.position.y,
  set: (value) => titleStyle.position.y = value
})
const titleBold = computed({
  get: () => titleStyle.effects.bold,
  set: (value) => titleStyle.effects.bold = value
})
const titleItalic = computed({
  get: () => titleStyle.effects.italic,
  set: (value) => titleStyle.effects.italic = value
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

// 常用颜色预设
const colorSwatches = [
  // 基础色
  '#000000', '#ffffff', '#808080', '#c0c0c0',
  // 红色系
  '#ff0000', '#ff6b6b', '#ff8a80', '#ffcdd2',
  // 橙色系
  '#ff9800', '#ffb74d', '#ffcc02', '#fff3c4',
  // 黄色系
  '#ffeb3b', '#fff176', '#ffff8d', '#fffde7',
  // 绿色系
  '#4caf50', '#81c784', '#a5d6a7', '#e8f5e8',
  // 蓝色系
  '#2196f3', '#64b5f6', '#90caf9', '#e3f2fd',
  // 紫色系
  '#9c27b0', '#ba68c8', '#ce93d8', '#f3e5f5',
  // 渐变色
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  // 深色系
  '#212121', '#424242', '#616161', '#757575',
  // 浅色系
  '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd'
]

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
const handleImageUpload = (options: any) => {
  const file = options.file.file
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

    ctx.drawImage(iconImageCache, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)

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

  // 等待字体加载完成
  await waitForFont()

  // 使用requestAnimationFrame确保平滑渲染
  requestAnimationFrame(async () => {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制背景
    if (backgroundType.value === 'color') {
      // 绘制纯色背景，应用透明度
      const opacity = backgroundOpacity.value / 100
      const color = backgroundColor.value
      
      // 将十六进制颜色转换为 rgba 格式
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
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

      ctx.save()
      ctx.fillStyle = titleColor.value
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 构建字体字符串 - 只设置加粗，斜体用变换实现
      let fontWeight = titleBold.value ? 'bold' : 'normal'
      
      // 改进字体回退机制
      let fontFamily = ''
      switch (titleFont.value) {
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
          fontFamily = `"${titleFont.value}", Arial, sans-serif`
      }
      
      ctx.font = `${fontWeight} ${titleSize.value}px ${fontFamily}`
      
      // 如果需要斜体，使用变换
      if (titleItalic.value) {
        ctx.translate(titlePosX, titlePosY)
        ctx.transform(1, 0, -0.2, 1, 0, 0)
        
        // 特殊处理 Maple Mono CN 的加粗效果
        if (titleBold.value && titleFont.value === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = titleColor.value
          ctx.lineWidth = titleSize.value * 2 * 0.01 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
          ctx.strokeText(titleText.value, 0, 0)
        }
        ctx.fillText(titleText.value, 0, 0)
      } else {
        // 特殊处理 Maple Mono CN 的加粗效果
        if (titleBold.value && titleFont.value === 'Maple Mono CN') {
          // 使用描边模拟加粗效果
          ctx.strokeStyle = titleColor.value
          ctx.lineWidth = titleSize.value * 2 * 0.01 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
          ctx.strokeText(titleText.value, titlePosX, titlePosY)
        }
        ctx.fillText(titleText.value, titlePosX, titlePosY)
      }
      
      ctx.restore()
    }

    // 绘制水印 - 确保可见
    if (watermarkText.value.trim()) {
      const watermarkPosX = (watermarkX.value / 100) * canvas.width
      const watermarkPosY = (watermarkY.value / 100) * canvas.height

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
      
      ctx.font = `${fontWeight} ${watermarkSize.value}px ${fontFamily}`
      
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

    isUpdating = false
  })
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
  if (backgroundType.value === 'image' && backgroundImageObj.value) {
    // 绘制图片背景
    ctx.save()
    
    if (blurAmount.value > 0) {
      ctx.filter = `blur(${blurAmount.value}px)`
    }
    
    ctx.drawImage(backgroundImageObj.value, 0, 0, canvas.width, canvas.height)
    ctx.restore()
  } else if (backgroundType.value === 'color') {
    // 绘制纯色背景，应用透明度
    const opacity = backgroundOpacity.value / 100
    const color = backgroundColor.value
    
    // 将十六进制颜色转换为 rgba 格式
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // 绘制图标
  if (iconSvg.value) {
    const iconPosX = (iconX.value / 100) * canvas.width
    const iconPosY = (iconY.value / 100) * canvas.height
    const scaledIconSize = (iconSize.value / 800) * canvas.width // 根据画布大小缩放
    await drawIconToCanvas(ctx, iconPosX, iconPosY, scaledIconSize)
  }

  // 绘制标题
  if (titleText.value) {
    const titlePosX = (titleX.value / 100) * canvas.width
    const titlePosY = (titleY.value / 100) * canvas.height
    const scaledTitleSize = (titleSize.value / 800) * canvas.width // 根据画布大小缩放

    // 保存当前状态
    ctx.save()
    
    // 构建字体样式 - 使用相同的字体回退机制
    const fontWeight = titleBold.value ? 'bold' : 'normal'
    
    let fontFamily = ''
    switch (titleFont.value) {
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
        fontFamily = `"${titleFont.value}", Arial, sans-serif`
    }
    
    ctx.font = `${fontWeight} ${scaledTitleSize}px ${fontFamily}`
    ctx.fillStyle = titleColor.value
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 如果需要斜体，使用变换
    if (titleItalic.value) {
      ctx.translate(titlePosX, titlePosY)
      ctx.transform(1, 0, -0.2, 1, 0, 0)
      
      // 特殊处理 Maple Mono CN 的加粗效果
      if (titleBold.value && titleFont.value === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        ctx.strokeStyle = titleColor.value
        ctx.lineWidth = 0.8
        ctx.strokeText(titleText.value, 0, 0)
      }
      ctx.fillText(titleText.value, 0, 0)
    } else {
      // 特殊处理 Maple Mono CN 的加粗效果
      if (titleBold.value && titleFont.value === 'Maple Mono CN') {
        // 使用描边模拟加粗效果
        ctx.strokeStyle = titleColor.value
        ctx.lineWidth = 0.8
        ctx.strokeText(titleText.value, titlePosX, titlePosY)
      }
      ctx.fillText(titleText.value, titlePosX, titlePosY)
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
  if (exportFormat.value === 'jpeg' && backgroundType.value === 'color' && backgroundOpacity.value < 100) {
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
  if (!iconSvg.value) return

  return new Promise<void>((resolve) => {
    const svgBlob = new Blob([iconSvg.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      // 设置阴影
      if (iconShadowSize.value > 0) {
        const scaledShadowSize = (iconShadowSize.value / 800) * ctx.canvas.width
        ctx.shadowColor = iconShadowColor.value
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

// 组件挂载时初始化
onMounted(async () => {
  // 先加载图标
  await loadIcon()
  
  // 等待字体加载完成后再更新画布
  await waitForFont()
  
  // 初始渲染
  updateCanvas()
  
  // 如果字体仍未加载完成，设置一个延迟重试
  if (!fontLoaded) {
    setTimeout(async () => {
      await checkFontLoaded()
      updateCanvas()
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
