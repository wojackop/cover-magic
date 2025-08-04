<template>
  <n-card size="large" hoverable class="h-full !rounded-lg">
    <n-space vertical size="large">
      <div>
        <label class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
          <Icon icon="material-symbols:category" class="text-lg" />
          背景类型
        </label>
        <n-space wrap>
          <n-button strong secondary round
            :type="backgroundConfig.type === BACKGROUND_TYPE.COLOR ? 'primary' : 'default'"
            @click="updateBackgroundProperty('type', BACKGROUND_TYPE.COLOR)">
            <template #icon>
              <Icon icon="material-symbols:palette" />
            </template>
            纯色
          </n-button>
          <n-button strong secondary round
            :type="backgroundConfig.type === BACKGROUND_TYPE.GRADIENT ? 'primary' : 'default'"
            @click="updateBackgroundProperty('type', BACKGROUND_TYPE.GRADIENT)">
            <template #icon>
              <Icon icon="material-symbols:gradient" />
            </template>
            渐变
          </n-button>
          <n-button strong secondary round
            :type="backgroundConfig.type === BACKGROUND_TYPE.IMAGE ? 'primary' : 'default'"
            @click="updateBackgroundProperty('type', BACKGROUND_TYPE.IMAGE)">
            <template #icon>
              <Icon icon="material-symbols:image" />
            </template>
            图片
          </n-button>
        </n-space>
      </div>

      <div v-if="backgroundConfig.type === BACKGROUND_TYPE.COLOR">
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:palette" class="text-lg" />
          背景颜色
        </label>
        <n-color-picker :value="backgroundConfig.color" :swatches="colorSwatches" :show-alpha="false"
          @update:value="(value) => updateBackgroundProperty('color', value)" />

        <div class="mt-4">
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:opacity" class="text-lg" />
            背景透明度
          </label>
          <n-slider :value="backgroundConfig.opacity" :min="0" :max="100" :step="1"
            @update:value="(value) => updateBackgroundProperty('opacity', value)" />
          <span class="text-sm text-gray-500">{{ backgroundConfig.opacity }}%</span>
        </div>
      </div>

      <div v-if="backgroundConfig.type === BACKGROUND_TYPE.GRADIENT">
        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:gradient-sharp" class="text-lg" />
            起始颜色
          </label>
          <n-color-picker :value="backgroundConfig.gradient.startColor" :swatches="colorSwatches" :show-alpha="false"
            @update:value="(value) => updateGradientProperty('startColor', value)" />
        </div>

        <div class="mt-4">
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:gradient" class="text-lg" />
            结束颜色
          </label>
          <n-color-picker :value="backgroundConfig.gradient.endColor" :swatches="colorSwatches" :show-alpha="false"
            @update:value="(value) => updateGradientProperty('endColor', value)" />
        </div>

        <div class="mt-4">
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:arrow-forward" class="text-lg" />
            渐变方向
          </label>
          <n-select v-model:value="backgroundConfig.gradient.direction" :options="gradientDirectionOptions"
            @update:value="(value) => updateGradientProperty('direction', value)" />
        </div>

        <div class="mt-4">
          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Icon icon="material-symbols:opacity" class="text-lg" />
            背景透明度
          </label>
          <n-slider :value="backgroundConfig.opacity" :min="0" :max="100" :step="1"
            @update:value="(value) => updateBackgroundProperty('opacity', value)" />
          <span class="text-sm text-gray-500">{{ backgroundConfig.opacity }}%</span>
        </div>
      </div>

      <div v-if="backgroundConfig.type === 'image'">
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:upload" class="text-lg" />
          上传图片
        </label>
        <n-upload accept="image/*" :show-file-list="false" @change="handleImageUpload">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <Icon icon="material-symbols:folder-open" style="font-size: 48px; color: #999" />
            </div>
            <div>点击或拖拽文件到此区域上传</div>
            <div style="margin-top: 8px; color: #999">支持 JPG、PNG、GIF 等图片格式</div>
          </n-upload-dragger>
        </n-upload>
      </div>

      <div v-if="backgroundConfig.type === 'image' && backgroundConfig.image">
        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Icon icon="material-symbols:blur-on" class="text-lg" />
          模糊度
        </label>
        <n-slider :value="backgroundConfig.blur" :min="0" :max="20" :step="1"
          @update:value="(value) => updateBackgroundProperty('blur', value)" />
        <span class="text-sm text-gray-500">{{ backgroundConfig.blur }}px</span>
      </div>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NButton, NColorPicker, NSlider, NUpload, NUploadDragger, NCard, NSpace, NSelect } from "naive-ui";

import type { BackgroundConfig, GradientConfig } from "@/lib/type";

import { colorSwatches, gradientDirectionOptions, BACKGROUND_TYPE } from "@/lib/constant";

// Props
type Props = {
  backgroundConfig: BackgroundConfig;
};

const props = defineProps<Props>();

// Emits
interface Emits {
  // eslint-disable-next-line no-unused-vars
  (_e: "update:backgroundConfig", value: BackgroundConfig): void;
  // eslint-disable-next-line no-unused-vars
  (_e: "imageUpload", options: any): void;
  // eslint-disable-next-line no-unused-vars
  (_e: "canvasUpdate"): void;
}

const emit = defineEmits<Emits>();

// 通用背景属性更新处理函数
const updateBackgroundProperty = <T extends keyof BackgroundConfig>(property: T, value: BackgroundConfig[T]) => {
  const newBackgroundConfig = { ...props.backgroundConfig, [property]: value };
  emit("update:backgroundConfig", newBackgroundConfig);
  emit("canvasUpdate");
};

// 渐变属性更新处理函数
const updateGradientProperty = <T extends keyof GradientConfig>(property: T, value: GradientConfig[T]) => {
  const newGradient = { ...props.backgroundConfig.gradient, [property]: value };
  const newBackgroundConfig = {
    ...props.backgroundConfig,
    gradient: newGradient,
  };
  emit("update:backgroundConfig", newBackgroundConfig);
  emit("canvasUpdate");
};

const handleImageUpload = (options: any) => {
  emit("imageUpload", options);
};
</script>
