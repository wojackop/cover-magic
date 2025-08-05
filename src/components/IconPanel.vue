<template>
  <n-card size="large" hoverable class="h-full !rounded-lg">
    <n-space vertical size="large">
      <n-tabs type="bar" animated size="small" @update:value="handleTabChange">
        <n-tab-pane name="icon-code">
          <template #tab>
            <div class="flex items-center gap-1">
              <Icon icon="material-symbols:code" class="text-lg" />
              <span>图标代码</span>
            </div>
          </template>
          <div class="mt-4">
            <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Icon icon="material-symbols:code" class="text-lg" />
              图标代码
            </label>
            <n-input-group>
              <n-input :value="iconConfig.code" placeholder="如: fluent-emoji-flat:four-leaf-clover"
                @input="value => { updateIconProperty('code', value); loadIcon() }">
                <template #prefix>
                  <Icon :icon="iconConfig.code" />
                </template>
              </n-input>
              <n-button type="primary" tag="a" href="https://yesicon.app/" target="_blank">
                图标库
              </n-button>
            </n-input-group>
          </div>
        </n-tab-pane>
        
        <n-tab-pane name="custom-icon">
          <template #tab>
            <div class="flex items-center gap-1">
              <Icon icon="material-symbols:image" class="text-lg" />
              <span>自定义图标</span>
            </div>
          </template>
          <div class="mt-4">
            <n-upload
              accept="image/*"
              :default-upload="false"
              :show-file-list="false"
              @change="handleCustomIconUpload"
            >
              <n-button type="primary" class="w-full">
                <template #icon>
                  <Icon icon="material-symbols:upload" />
                </template>
                上传自定义图标
              </n-button>
            </n-upload>
            
            <div v-if="customIconPreview" class="mt-4 flex justify-center">
              <div class="relative">
                <img :src="customIconPreview" class="max-h-24 object-contain rounded border p-2" />
              </div>
            </div>
            
            <div v-if="!customIconPreview" class="mt-4 text-center text-sm text-gray-500">
              支持 PNG、SVG、JPEG 等图片格式
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:photo-size-select-large" class="text-lg" />
            大小
          </label>
          <n-slider :value="iconConfig.size" :min="20" :max="200" :step="1"
            @update:value="value => updateIconProperty('size', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.size }}px</span>
        </n-grid-item>

        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:shadow" class="text-lg" />
            阴影大小
          </label>
          <n-slider :value="iconConfig.shadowSize" :min="0" :max="100" :step="1"
            @update:value="value => updateIconProperty('shadowSize', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.shadowSize }}px</span>
        </n-grid-item>
      </n-grid>

      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:palette" class="text-lg" />
          阴影颜色
        </label>
        <n-color-picker :value="iconConfig.shadowColor" :swatches="colorSwatches" :show-alpha="false"
          @update:value="value => updateIconProperty('shadowColor', value)" />
      </div>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:swap-horiz" class="text-lg" />
            水平位置
          </label>
          <n-slider :value="iconConfig.position.x" :min="0" :max="100" :step="1"
            @update:value="value => updateIconPosition('x', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.position.x }}%</span>
        </n-grid-item>

        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:swap-vert" class="text-lg" />
            垂直位置
          </label>
          <n-slider :value="iconConfig.position.y" :min="0" :max="100" :step="1"
            @update:value="value => updateIconPosition('y', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.position.y }}%</span>
        </n-grid-item>
      </n-grid>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  NInput,
  NSlider,
  NColorPicker,
  NCard,
  NSpace,
  NGrid,
  NGridItem,
  NInputGroup,
  NButton,
  NTabs,
  NTabPane,
  NUpload,
  useMessage
} from 'naive-ui'
import { ref } from 'vue'

import type { IconConfig, Position } from '@/lib/type'
import type { UploadFileInfo } from 'naive-ui'

import { colorSwatches } from '@/lib/constant'

// 从App.vue中注入消息API
const message = useMessage()

// 自定义图标预览URL
const customIconPreview = ref<string | null>(null)

// 保存图标代码和SVG
const savedIconCode = ref<string>('fluent-emoji-flat:four-leaf-clover');
const savedIconSvg = ref<string>('');
const savedCustomSvg = ref<string>('');

// Props
type Props = {
  iconConfig: IconConfig
}

const props = defineProps<Props>()

// Emits
interface Emits {
  // eslint-disable-next-line no-unused-vars
  (e: 'update:iconConfig', value: IconConfig): void
  // eslint-disable-next-line no-unused-vars
  (e: 'icon-load'): void
  // eslint-disable-next-line no-unused-vars
  (e: 'canvas-update'): void
}

const emit = defineEmits<Emits>()

// 处理标签页切换
const handleTabChange = (tabName: string) => {
  if (tabName === 'icon-code') {
    // 切换到图标代码标签页
    if (savedIconCode.value) {
      // 恢复保存的图标代码
      updateIconProperty('code', savedIconCode.value);
      updateIconProperty('svg', savedIconSvg.value);
      emit('icon-load');
    }
  } else if (tabName === 'custom-icon') {
    // 切换到自定义图标标签页
    if (props.iconConfig.code) {
      // 保存当前图标代码
      savedIconCode.value = props.iconConfig.code;
      savedIconSvg.value = props.iconConfig.svg;
    }
    
    // 如果有自定义图标，应用它
    if (customIconPreview.value) {
      // 应用自定义图标
      updateIconProperty('code', '');
      
      // 重新应用保存的SVG
      if (savedCustomSvg.value) {
        updateIconProperty('svg', savedCustomSvg.value);
        emit('canvas-update');
      }
    }
  }
};

// 通用图标属性更新处理函数
const updateIconProperty = <T extends keyof Omit<IconConfig, 'position'>>(property: T, value: IconConfig[T]) => {
  const newIconConfig = { ...props.iconConfig, [property]: value }
  emit('update:iconConfig', newIconConfig)
  emit('canvas-update')
}

// 更新位置属性
const updateIconPosition = (axis: keyof Position, value: number) => {
  const newPosition = { ...props.iconConfig.position, [axis]: value }
  const newIconConfig = { ...props.iconConfig, position: newPosition }
  emit('update:iconConfig', newIconConfig)
  emit('canvas-update')
}

// 加载图标
const loadIcon = () => {
  emit('icon-load')
}

// 处理自定义图标上传
const handleCustomIconUpload = ({ file }: { file: UploadFileInfo }) => {
  if (!file.file) {
    message.error('上传失败，请重试')
    return
  }

  // 检查文件大小（限制为2MB）
  if (file.file.size > 2 * 1024 * 1024) {
    message.error('图标文件过大，请上传小于2MB的文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) {
      customIconPreview.value = result
      
      // 创建一个新的图像对象
      const img = new Image()
      img.onload = () => {
        // 将自定义图标转换为SVG格式
        const svgContent = createSVGFromImage(img, result)
        
        // 保存自定义SVG
        savedCustomSvg.value = svgContent;
        
        // 使用自定义SVG
        updateIconProperty('code', '')
        updateIconProperty('svg', svgContent)
        emit('canvas-update')
      }
      img.src = result
    }
  }
  reader.onerror = () => {
    message.error('读取文件失败，请重试')
  }
  reader.readAsDataURL(file.file)
}

// 从图像创建SVG
const createSVGFromImage = (img: HTMLImageElement, dataUrl: string): string => {
  // 提取图像类型
  const imageType = dataUrl.split(';')[0].split('/')[1]
  
  // 如果是SVG，直接使用
  if (imageType === 'svg+xml') {
    // 从data URL中提取SVG内容
    const svgContent = atob(dataUrl.split(',')[1])
    return svgContent
  }
  
  // 对于其他图像类型，创建一个包含图像的SVG
  const svgWidth = img.width
  const svgHeight = img.height
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
    <image href="${dataUrl}" width="${svgWidth}" height="${svgHeight}" />
  </svg>`
}
</script>