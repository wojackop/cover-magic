<template>
  <n-card size="large" hoverable class="h-full !rounded-lg">
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
        <n-input :value="iconConfig.code" placeholder="如: fluent-emoji-flat:four-leaf-clover" @input="value => {updateIconProperty('code', value); loadIcon()}">
          <template #prefix>
            <Icon icon="material-symbols:search" />
          </template>
          <template #suffix>
            <Icon :icon="iconConfig.code" />
          </template>
        </n-input>
      </div>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:photo-size-select-large" class="text-lg" />
            大小
          </label>
          <n-slider :value="iconConfig.size" :min="20" :max="200" :step="1" @update:value="value => updateIconProperty('size', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.size }}px</span>
        </n-grid-item>

        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:shadow" class="text-lg" />
            阴影大小
          </label>
          <n-slider :value="iconConfig.shadowSize" :min="0" :max="100" :step="1" @update:value="value => updateIconProperty('shadowSize', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.shadowSize }}px</span>
        </n-grid-item>
      </n-grid>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Icon icon="material-symbols:palette" class="text-lg" />
          阴影颜色
        </label>
        <n-color-picker 
          :value="iconConfig.shadowColor" 
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
          <n-slider :value="iconConfig.position.x" :min="0" :max="100" :step="1" @update:value="value => updateIconPosition('x', value)" />
          <span class="text-sm text-gray-500">{{ iconConfig.position.x }}%</span>
        </n-grid-item>

        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:swap-vert" class="text-lg" />
            垂直位置
          </label>
          <n-slider :value="iconConfig.position.y" :min="0" :max="100" :step="1" @update:value="value => updateIconPosition('y', value)" />
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
  NGridItem
} from 'naive-ui'
import { colorSwatches } from '@/lib/constant'
import type { IconConfig,Position } from '@/lib/type'

// Props
type Props = {
  iconConfig: IconConfig
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'update:iconConfig', value: IconConfig): void
  (e: 'icon-load'): void
  (e: 'canvas-update'): void
}

const emit = defineEmits<Emits>()

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
</script>