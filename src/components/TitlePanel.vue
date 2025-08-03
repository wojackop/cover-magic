<template>
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
        <n-input :value="titleConfig.text" placeholder="输入标题..." @input="value => updateTitleProperty('text', value)">
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
        <n-select :value="titleConfig.font" @update:value="value => updateTitleProperty('font', value)" :options="fontOptions" />
      </div>

      <div>
        <n-space>
          <n-checkbox :checked="titleConfig.effects.bold" @update:checked="value => updateTitleEffect('bold', value)">
            <span class="flex items-center gap-2">
              <Icon icon="material-symbols:format-bold" class="text-lg" />
              加粗
            </span>
          </n-checkbox>
          <n-checkbox :checked="titleConfig.effects.italic" @update:checked="value => updateTitleEffect('italic', value)">
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
          <n-slider :value="titleConfig.size" :min="16" :max="120" :step="1" @update:value="value => updateTitleProperty('size', value)" />
          <span class="text-sm text-gray-500">{{ titleConfig.size }}px</span>
        </n-grid-item>

        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:palette" class="text-lg" />
            颜色
          </label>
          <n-color-picker 
            :value="titleConfig.color" 
            @update:value="value => updateTitleProperty('color', value)"
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
          <n-slider :value="titleConfig.position.x" :min="0" :max="100" :step="1" @update:value="value => updateTitlePosition('x', value)" />
          <span class="text-sm text-gray-500">{{ titleConfig.position.x }}%</span>
        </n-grid-item>

        <n-grid-item>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Icon icon="material-symbols:swap-vert" class="text-lg" />
            垂直位置
          </label>
          <n-slider :value="titleConfig.position.y" :min="0" :max="100" :step="1" @update:value="value => updateTitlePosition('y', value)" />
          <span class="text-sm text-gray-500">{{ titleConfig.position.y }}%</span>
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
  NSelect,
  NCheckbox, 
  NCard,
  NSpace,
  NGrid,
  NGridItem
} from 'naive-ui'
import { colorSwatches, fontOptions } from '@/lib/constant'
import type { TextEffects,Position,TitleConfig } from '@/lib/type'

// Props 类型定义
type Props = {
  titleConfig: TitleConfig  // 标题数据对象
}

const props = defineProps<Props>()

// Emits 类型定义
interface Emits {
  (e: 'update:titleConfig', value: TitleConfig): void  // 更新标题数据
  (e: 'canvas-update'): void               // 通知画布更新
}

const emit = defineEmits<Emits>()

// 通用标题属性更新处理函数
const updateTitleProperty = <T extends keyof Omit<TitleConfig, 'position' | 'effects'>>(property: T, value: TitleConfig[T]) => {
  const newTitleConfig = { ...props.titleConfig, [property]: value }
  emit('update:titleConfig', newTitleConfig)
  emit('canvas-update')
}

// 更新位置属性
const updateTitlePosition = (axis: keyof Position, value: number) => {
  const newPosition = { ...props.titleConfig.position, [axis]: value }
  const newTitleConfig = { ...props.titleConfig, position: newPosition }
  emit('update:titleConfig', newTitleConfig)
  emit('canvas-update')
}

// 更新效果属性
const updateTitleEffect = (effect: keyof TextEffects, value: boolean) => {
  const newEffects = { ...props.titleConfig.effects, [effect]: value }
  const newTitleConfig = { ...props.titleConfig, effects: newEffects }
  emit('update:titleConfig', newTitleConfig)
  emit('canvas-update')
}
</script>