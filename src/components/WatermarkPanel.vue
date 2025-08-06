<template>
  <n-card size="large" hoverable class="h-full !rounded-lg">
    <n-space vertical size="large">
      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:text-fields" class="text-lg" />
          水印文本
        </label>
        <n-input
          :value="watermarkConfig.text"
          placeholder="输入水印..."
          @update:value="updateWatermarkProperty('text', $event)"
        >
          <template #prefix>
            <Icon icon="material-symbols:edit" />
          </template>
        </n-input>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:font-download" class="text-lg" />
          字体
        </label>
        <n-select
          :value="watermarkConfig.font"
          :options="fontOptions"
          @update:value="updateWatermarkProperty('font', $event)"
        />
      </div>

      <div>
        <n-space>
          <n-checkbox :checked="watermarkConfig.effects.bold" @update:checked="updateWatermarkEffect('bold', $event)">
            <span class="flex items-center gap-1">
              <Icon icon="material-symbols:format-bold" class="text-lg" />
              加粗
            </span>
          </n-checkbox>
          <n-checkbox
            :checked="watermarkConfig.effects.italic"
            @update:checked="updateWatermarkEffect('italic', $event)"
          >
            <span class="flex items-center gap-1">
              <Icon icon="material-symbols:format-italic" class="text-lg" />
              斜体
            </span>
          </n-checkbox>
          <n-checkbox
            :checked="watermarkConfig.effects.uppercase"
            @update:checked="updateWatermarkEffect('uppercase', $event)"
          >
            <span class="flex items-center gap-1">
              <Icon icon="material-symbols:text-format" class="text-lg" />
              大写
            </span>
          </n-checkbox>
        </n-space>
      </div>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:format-size" class="text-lg" />
            字体大小
          </label>
          <n-slider
            :value="watermarkConfig.size"
            :min="10"
            :max="100"
            :step="1"
            @update:value="updateWatermarkProperty('size', $event)"
          />
          <span class="text-sm text-gray-500">{{ watermarkConfig.size }}px</span>
        </n-grid-item>

        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:opacity" class="text-lg" />
            透明度
          </label>
          <n-slider
            :value="watermarkConfig.opacity"
            :min="0"
            :max="100"
            :step="1"
            @update:value="updateWatermarkProperty('opacity', $event)"
          />
          <span class="text-sm text-gray-500">{{ watermarkConfig.opacity }}%</span>
        </n-grid-item>
      </n-grid>

      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:palette" class="text-lg" />
          颜色
        </label>
        <n-color-picker
          :value="watermarkConfig.color"
          :swatches="colorSwatches"
          :show-alpha="false"
          @update:value="updateWatermarkProperty('color', $event)"
        />
      </div>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:swap-horiz" class="text-lg" />
            水平位置
          </label>
          <n-slider
            :value="watermarkConfig.position.x"
            :min="0"
            :max="100"
            :step="1"
            @update:value="updateWatermarkPosition('x', $event)"
          />
          <span class="text-sm text-gray-500">{{ watermarkConfig.position.x }}%</span>
        </n-grid-item>

        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:swap-vert" class="text-lg" />
            垂直位置
          </label>
          <n-slider
            :value="watermarkConfig.position.y"
            :min="0"
            :max="100"
            :step="1"
            @update:value="updateWatermarkPosition('y', $event)"
          />
          <span class="text-sm text-gray-500">{{ watermarkConfig.position.y }}%</span>
        </n-grid-item>
      </n-grid>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NInput, NSlider, NColorPicker, NSelect, NCheckbox, NCard, NSpace, NGrid, NGridItem } from "naive-ui";

import type { WatermarkConfig, Position, TextEffects } from "@/lib/type";

import { colorSwatches, fontOptions } from "@/lib/constant";

// 定义组件的属性
interface Props {
  // 水印配置对象，包含水印的所有属性
  watermarkConfig: WatermarkConfig;
}

// 定义组件的事件
interface Emits {
  // 当水印配置更新时触发
  "update:watermarkConfig": [newWatermarkConfig: WatermarkConfig];
  // 当画布需要更新时触发
  "canvas-update": [];
}

// 声明组件的属性和事件
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 更新水印属性的方法
const updateWatermarkProperty = <K extends keyof WatermarkConfig>(property: K, value: WatermarkConfig[K]) => {
  // 创建新的配置对象，保持响应式
  const newWatermarkConfig = { ...props.watermarkConfig };
  // 更新指定属性
  newWatermarkConfig[property] = value;
  // 触发更新事件
  emit("update:watermarkConfig", newWatermarkConfig);
  // 触发画布更新事件
  emit("canvas-update");
};

// 更新水印位置的方法
const updateWatermarkPosition = (axis: keyof Position, value: number) => {
  // 创建新的配置对象，保持响应式
  const newWatermarkConfig = { ...props.watermarkConfig };
  // 更新位置属性
  newWatermarkConfig.position = {
    ...newWatermarkConfig.position,
    [axis]: value,
  };
  // 触发更新事件
  emit("update:watermarkConfig", newWatermarkConfig);
  // 触发画布更新事件
  emit("canvas-update");
};

// 更新水印文本效果的方法
const updateWatermarkEffect = (effect: keyof TextEffects, value: boolean) => {
  // 创建新的配置对象，保持响应式
  const newWatermarkConfig = { ...props.watermarkConfig };
  // 更新文本效果属性
  newWatermarkConfig.effects = {
    ...newWatermarkConfig.effects,
    [effect]: value,
  };
  // 触发更新事件
  emit("update:watermarkConfig", newWatermarkConfig);
  // 触发画布更新事件
  emit("canvas-update");
};
</script>
