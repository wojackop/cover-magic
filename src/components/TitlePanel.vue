<template>
  <n-card size="large" hoverable class="h-full !rounded-lg">
    <n-space vertical size="large">
      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:text-fields" class="text-lg" />
          标题文本
        </label>
        <n-input
          :value="titleConfig.text"
          placeholder="输入标题..."
          @input="(value) => updateTitleProperty('text', value)"
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
          :value="titleConfig.font"
          :options="fontOptions"
          @update:value="(value) => updateTitleProperty('font', value)"
        />
      </div>

      <div>
        <n-space>
          <n-checkbox :checked="titleConfig.effects.bold" @update:checked="(value) => updateTitleEffect('bold', value)">
            <span class="flex items-center gap-1">
              <Icon icon="material-symbols:format-bold" class="text-lg" />
              加粗
            </span>
          </n-checkbox>
          <n-checkbox
            :checked="titleConfig.effects.italic"
            @update:checked="(value) => updateTitleEffect('italic', value)"
          >
            <span class="flex items-center gap-1">
              <Icon icon="material-symbols:format-italic" class="text-lg" />
              斜体
            </span>
          </n-checkbox>
        </n-space>
      </div>

      <div>
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:3d-rotation" class="text-lg" />
          立体字效果
        </label>
        <n-slider
          :value="titleConfig.effects.textShadow || 0"
          :min="0"
          :max="10"
          :step="0.5"
          @update:value="(value) => updateTitleEffect('textShadow', value)"
        />
        <span class="text-sm text-gray-500">{{ titleConfig.effects.textShadow || 0 }}</span>
      </div>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:format-size" class="text-lg" />
            字体大小
          </label>
          <n-slider
            :value="titleConfig.size"
            :min="16"
            :max="120"
            :step="1"
            @update:value="(value) => updateTitleProperty('size', value)"
          />
          <span class="text-sm text-gray-500">{{ titleConfig.size }}px</span>
        </n-grid-item>

        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:palette" class="text-lg" />
            颜色
          </label>
          <n-color-picker
            :value="titleConfig.color"
            :swatches="colorSwatches"
            :show-alpha="false"
            @update:value="(value) => updateTitleProperty('color', value)"
          />
        </n-grid-item>
      </n-grid>

      <n-grid cols="2" :x-gap="16">
        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:swap-horiz" class="text-lg" />
            水平位置
          </label>
          <n-slider
            :value="titleConfig.position.x"
            :min="0"
            :max="100"
            :step="1"
            @update:value="(value) => updateTitlePosition('x', value)"
          />
          <span class="text-sm text-gray-500">{{ titleConfig.position.x }}%</span>
        </n-grid-item>

        <n-grid-item>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:swap-vert" class="text-lg" />
            垂直位置
          </label>
          <n-slider
            :value="titleConfig.position.y"
            :min="0"
            :max="100"
            :step="1"
            @update:value="(value) => updateTitlePosition('y', value)"
          />
          <span class="text-sm text-gray-500">{{ titleConfig.position.y }}%</span>
        </n-grid-item>
      </n-grid>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NInput, NSlider, NColorPicker, NSelect, NCheckbox, NCard, NSpace, NGrid, NGridItem } from "naive-ui";

import type { TextEffects, Position, TitleConfig } from "@/lib/type";

import { colorSwatches, fontOptions } from "@/lib/constant";

/**
 * Props 类型定义
 */
type Props = {
  /**
   * 标题配置对象，包含标题的所有属性
   * @property {string} text - 标题文本内容
   * @property {string} font - 字体名称
   * @property {number} size - 字体大小（像素）
   * @property {string} color - 字体颜色（十六进制）
   * @property {Position} position - 标题位置坐标
   * @property {TextEffects} effects - 文本效果设置
   */
  titleConfig: TitleConfig;
};

const props = defineProps<Props>();

/**
 * Emits 类型定义
 */
interface Emits {
  /**
   * 更新标题配置事件
   * @param {string} e - 事件名称 'update:titleConfig'
   * @param {TitleConfig} value - 更新后的标题配置对象
   */
  // eslint-disable-next-line no-unused-vars
  (e: "update:titleConfig", value: TitleConfig): void;

  /**
   * 通知画布更新事件
   * @param {string} e - 事件名称 'canvas-update'
   */
  // eslint-disable-next-line no-unused-vars
  (e: "canvas-update"): void;
}

const emit = defineEmits<Emits>();

/**
 * 更新标题基本属性
 * 用于更新标题的文本、字体、大小、颜色等基本属性
 *
 * @template T - 属性名类型，限制为TitleConfig中除position和effects外的属性
 * @param {T} property - 要更新的属性名
 * @param {TitleConfig[T]} value - 属性的新值
 */
const updateTitleProperty = <T extends keyof Omit<TitleConfig, "position" | "effects">>(
  property: T,
  value: TitleConfig[T]
) => {
  const newTitleConfig = { ...props.titleConfig, [property]: value };
  emit("update:titleConfig", newTitleConfig);
  emit("canvas-update");
};

/**
 * 更新标题位置属性
 * 用于更新标题在画布中的水平(x)或垂直(y)位置
 *
 * @param {keyof Position} axis - 坐标轴，'x'表示水平位置，'y'表示垂直位置
 * @param {number} value - 位置值，范围0-100，表示百分比
 */
const updateTitlePosition = (axis: keyof Position, value: number) => {
  const newPosition = { ...props.titleConfig.position, [axis]: value };
  const newTitleConfig = { ...props.titleConfig, position: newPosition };
  emit("update:titleConfig", newTitleConfig);
  emit("canvas-update");
};

/**
 * 更新标题文本效果
 * 用于更新标题的粗体、斜体等文本效果
 *
 * @param {keyof TextEffects} effect - 效果类型，如'bold'表示粗体，'italic'表示斜体，'textShadow'表示立体字效果
 * @param {boolean | number} value - 效果状态或值，对于布尔效果(bold/italic/uppercase)为true/false，对于数值效果(textShadow)为数字
 */
const updateTitleEffect = (effect: keyof TextEffects, value: boolean | number) => {
  const newEffects = { ...props.titleConfig.effects, [effect]: value };
  const newTitleConfig = { ...props.titleConfig, effects: newEffects };
  emit("update:titleConfig", newTitleConfig);
  emit("canvas-update");
};
</script>
