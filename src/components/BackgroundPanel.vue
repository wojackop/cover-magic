<template>
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
                    <n-button strong secondary round :type="background.type === 'color' ? 'primary' : 'default'"
                        @click="updateBackgroundProperty('type', 'color')">
                        <template #icon>
                            <Icon icon="material-symbols:palette" />
                        </template>
                        纯色
                    </n-button>
                    <n-button strong secondary round :type="background.type === 'color' ? 'default' : 'primary'"
                        @click="updateBackgroundProperty('type', 'image')">
                        <template #icon>
                            <Icon icon="material-symbols:image" />
                        </template>
                        图片
                    </n-button>
                </n-space>
            </div>

            <div v-if="background.type === 'color'">
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:palette" class="text-lg" />
                    背景颜色
                </label>
                <n-color-picker :value="background.color" @update:value="value => updateBackgroundProperty('color', value)"
                    :swatches="colorSwatches" :show-alpha="false" />

                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Icon icon="material-symbols:opacity" class="text-lg" />
                        背景透明度
                    </label>
                    <n-slider :value="background.opacity" :min="0" :max="100" :step="1"
                        @update:value="value => updateBackgroundProperty('opacity', value)" />
                    <span class="text-sm text-gray-500">{{ background.opacity }}%</span>
                </div>
            </div>

            <div v-if="background.type === 'image'">
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

            <div v-if="background.type === 'image' && background.image">
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Icon icon="material-symbols:blur-on" class="text-lg" />
                    模糊度
                </label>
                <n-slider :value="background.blur" :min="0" :max="20" :step="1" @update:value="value => updateBackgroundProperty('blur', value)" />
                <span class="text-sm text-gray-500">{{ background.blur }}px</span>
            </div>
        </n-space>
    </n-card>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { colorSwatches } from '@/lib/constant'
import {
    NButton,
    NColorPicker,
    NSlider,
    NUpload,
    NUploadDragger,
    NCard,
    NSpace
} from 'naive-ui'

// 背景设置类型定义
interface Background {
    type: 'color' | 'image'
    color: string
    opacity: number
    image: string
    imageObj: HTMLImageElement | null
    blur: number
}

// Props
interface Props {
    background: Background
}

const props = defineProps<Props>()

// Emits
interface Emits {
    (e: 'update:background', value: Background): void
    (e: 'imageUpload', options: any): void
    (e: 'canvasUpdate'): void
}

const emit = defineEmits<Emits>()

// 通用背景属性更新处理函数
const updateBackgroundProperty = <T extends keyof Background>(property: T, value: Background[T]) => {
    const newBackground = { ...props.background, [property]: value }
    emit('update:background', newBackground)
    emit('canvasUpdate')
}

const handleImageUpload = (options: any) => {
    emit('imageUpload', options)
}
</script>