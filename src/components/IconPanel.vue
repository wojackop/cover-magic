<template>
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
        <n-input :value="icon.code" placeholder="如: fluent-emoji-flat:four-leaf-clover" @input="value => {updateIconProperty('code', value); loadIcon()}">
          <template #prefix>
            <Icon icon="material-symbols:search" />
          </template>
          <template #suffix>
            <Icon :icon="icon.code" />
          </template>
        </n-input>
      </div>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:photo-size-select-large" class="text-lg" />
            大小
          </label>
          <n-slider :value="icon.size" :min="20" :max="200" :step="1" @update:value="value => updateIconProperty('size', value)" />
          <span class="text-sm text-gray-500">{{ icon.size }}px</span>
        </n-grid-item>

        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:shadow" class="text-lg" />
            阴影大小
          </label>
          <n-slider :value="icon.shadowSize" :min="0" :max="100" :step="1" @update:value="value => updateIconProperty('shadowSize', value)" />
          <span class="text-sm text-gray-500">{{ icon.shadowSize }}px</span>
        </n-grid-item>
      </n-grid>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Icon icon="material-symbols:palette" class="text-lg" />
          阴影颜色
        </label>
        <n-color-picker 
          :value="icon.shadowColor" 
          @update:value="value => updateIconProperty('shadowColor', value)"
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
          <n-slider :value="icon.position.x" :min="0" :max="100" :step="1" @update:value="value => updateIconPosition('x', value)" />
          <span class="text-sm text-gray-500">{{ icon.position.x }}%</span>
        </n-grid-item>

        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:swap-vert" class="text-lg" />
            垂直位置
          </label>
          <n-slider :value="icon.position.y" :min="0" :max="100" :step="1" @update:value="value => updateIconPosition('y', value)" />
          <span class="text-sm text-gray-500">{{ icon.position.y }}%</span>
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
  NGridItem
} from 'naive-ui'
import { colorSwatches } from '@/lib/constant'

// 图标设置类型定义
interface IconPosition {
  x: number
  y: number
}

interface Icon {
  code: string
  size: number
  shadowSize: number
  shadowColor: string
  position: IconPosition
}

// Props
interface Props {
  icon: Icon
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'update:icon', value: Icon): void
  (e: 'icon-load'): void
  (e: 'canvas-update'): void
}

const emit = defineEmits<Emits>()

// 通用图标属性更新处理函数
const updateIconProperty = <T extends keyof Omit<Icon, 'position'>>(property: T, value: Icon[T]) => {
  const newIcon = { ...props.icon, [property]: value }
  emit('update:icon', newIcon)
  emit('canvas-update')
}

// 更新位置属性
const updateIconPosition = (axis: keyof IconPosition, value: number) => {
  const newPosition = { ...props.icon.position, [axis]: value }
  const newIcon = { ...props.icon, position: newPosition }
  emit('update:icon', newIcon)
  emit('canvas-update')
}

// 加载图标
const loadIcon = () => {
  emit('icon-load')
}
</script>