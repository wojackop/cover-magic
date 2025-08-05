<template>
    <n-card size="large" hoverable class="h-full !rounded-lg">
        <n-space vertical>
            <!-- 导出尺寸设置 -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <div class="mb-2 text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                        <Icon icon="material-symbols:width" class="text-lg" />
                        导出宽度
                    </div>
                    <n-input-number v-model:value="localExportConfig.width" :min="100" :max="3840" :step="10"
                        class="w-full" @update:value="updateExportConfig" />
                </div>
                <div>
                    <div class="mb-2 text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                        <Icon icon="material-symbols:height" class="text-lg" />
                        导出高度
                    </div>
                    <n-input-number v-model:value="localExportConfig.height" :min="100" :max="2160" :step="10"
                        class="w-full" @update:value="updateExportConfig" />
                </div>
            </div>

            <!-- 导出格式选择 -->
            <div>
                <div class="mb-2 text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                    <Icon icon="material-symbols:format-paint" class="text-lg" />
                    导出格式
                </div>
                <n-select v-model:value="localExportConfig.format" :options="formatOptions" class="w-full"
                    @update:value="updateExportConfig" />
            </div>

            <!-- 图片质量设置 -->
            <div>
                <div class="flex items-center justify-between mb-1">
                    <div class="text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                        <Icon icon="material-symbols:high-quality" class="text-lg" />
                        图片质量
                    </div>
                    <span class="text-xs dark:text-gray-400 text-gray-500">
                        {{ Math.round(localExportConfig.quality * 100) }}%
                    </span>
                </div>
                <n-slider v-model:value="localExportConfig.quality" :min="0.1" :max="1" :step="0.05" :tooltip="false"
                    :marks="{
                        0.1: '低',
                        0.5: '中',
                        0.9: '高',
                        1: '原始'
                    }" @update:value="updateExportConfig" />
            </div>

            <!-- 文件名设置 -->
            <div>
                <div class="mb-2 text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                    <Icon icon="material-symbols:drive-file-rename-outline" class="text-lg" />
                    文件名
                </div>
                <n-input v-model:value="localExportConfig.fileName" placeholder="输入文件名" class="w-full"
                    :disabled="localExportConfig.useRandomFileName" @update:value="updateExportConfig">
                    <template #suffix>
                        <span class="text-sm dark:text-gray-400 text-gray-500 font-mono">.{{ localExportConfig.format
                            }}</span>
                    </template>
                </n-input>
            </div>

            <!-- 随机文件名设置 -->
            <div>
                <n-checkbox v-model:checked="localExportConfig.useRandomFileName" @update:checked="updateExportConfig">
                    使用随机文件名
                </n-checkbox>
            </div>

            <!-- 随机文件名长度设置 -->
            <div v-if="localExportConfig.useRandomFileName">
                <div class="mb-2 text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                    <Icon icon="material-symbols:format-size" class="text-lg" />
                    随机文件名长度
                </div>
                <n-slider v-model:value="localExportConfig.randomFileNameLength" :min="4" :max="32" :step="1"
                    :tooltip="true" @update:value="updateExportConfig" />
            </div>

            <!-- 随机文件名选项 -->
            <div v-if="localExportConfig.useRandomFileName" class="grid grid-cols-3 gap-2">
                <n-checkbox v-model:checked="localExportConfig.randomFileNameOptions.includeNumbers"
                    @update:checked="updateRandomFileNameOptions('includeNumbers', $event)">
                    数字
                </n-checkbox>
                <n-checkbox v-model:checked="localExportConfig.randomFileNameOptions.includeLowercase"
                    @update:checked="updateRandomFileNameOptions('includeLowercase', $event)">
                    小写字母
                </n-checkbox>
                <n-checkbox v-model:checked="localExportConfig.randomFileNameOptions.includeUppercase"
                    @update:checked="updateRandomFileNameOptions('includeUppercase', $event)">
                    大写字母
                </n-checkbox>
            </div>

            <!-- 随机文件名预览 -->
            <div v-if="localExportConfig.useRandomFileName" class="flex items-center gap-1">
                <div class="text-sm dark:text-gray-300 text-gray-600 flex items-center gap-1">
                    <Icon icon="material-symbols:preview" class="text-lg" />
                    预览：
                </div>
                <div
                    class="text-sm font-mono px-1 py-1 rounded dark:bg-gray-700 dark:text-gray-200 bg-gray-100 text-gray-800">
                    {{ localExportConfig.currentRandomFileName || '生成中...' }}.{{ localExportConfig.format }}
                </div>
                <n-button size="small" @click="generateAndCacheRandomFileName">
                    <Icon icon="material-symbols:refresh" class="text-base" />
                </n-button>
            </div>

            <!-- 导出按钮 -->
            <div class="mt-4">
                <n-button type="primary" block @click="handleExportImage">
                    <Icon icon="material-symbols:download" class="mr-1" />
                    导出图片
                </n-button>
            </div>
        </n-space>
    </n-card>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { NButton, NInput, NSlider, NSelect, NCheckbox, NInputNumber, NCard, NSpace } from 'naive-ui'
import { reactive, watch, onMounted } from 'vue'

import type { ExportConfig, RandomFileNameOptions } from '@/lib/type'

import { formatOptions } from '@/lib/constant'

// 定义组件的 props
const props = defineProps<{
    exportConfig: ExportConfig
}>()

// 定义组件的事件
const emit = defineEmits<{
    'update:exportConfig': [newExportConfig: ExportConfig]
    'export-image': []
}>()

// 创建本地配置副本
const localExportConfig = reactive<ExportConfig>({ ...props.exportConfig })

// 更新导出配置
const updateExportConfig = () => {
    emit('update:exportConfig', { ...localExportConfig })
}

// 更新随机文件名选项
const updateRandomFileNameOptions = (key: keyof RandomFileNameOptions, value: boolean) => {
    localExportConfig.randomFileNameOptions[key] = value

    // 确保至少有一个选项被选中
    const options = localExportConfig.randomFileNameOptions
    if (!options.includeNumbers && !options.includeLowercase && !options.includeUppercase) {
        // 如果所有选项都被取消，则默认选中数字
        options.includeNumbers = true
    }

    updateExportConfig()
    generateAndCacheRandomFileName()
}

// 生成随机文件名
const generateRandomFileName = (options: RandomFileNameOptions, length: number): string => {
    let chars = ''
    if (options.includeNumbers) chars += '0123456789'
    if (options.includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (options.includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // 如果没有选择任何字符集，默认使用数字
    if (chars.length === 0) chars = '0123456789'

    let result = ''
    const charsLength = chars.length

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength))
    }

    return result
}

// 生成并缓存随机文件名
const generateAndCacheRandomFileName = () => {
    if (localExportConfig.useRandomFileName) {
        localExportConfig.currentRandomFileName = generateRandomFileName(
            localExportConfig.randomFileNameOptions,
            localExportConfig.randomFileNameLength
        )
        updateExportConfig()
    }
}

// 处理导出图片
const handleExportImage = () => {
    emit('export-image')
}

// 监听配置变化
watch(() => props.exportConfig, (newConfig) => {
    // 更新本地配置
    Object.assign(localExportConfig, newConfig)
}, { deep: true })

// 监听随机文件名相关配置变化
watch([
    () => localExportConfig.useRandomFileName,
    () => localExportConfig.randomFileNameLength,
    () => localExportConfig.randomFileNameOptions
], () => {
    if (localExportConfig.useRandomFileName) {
        generateAndCacheRandomFileName()
    }
}, { deep: true })

// 组件挂载时初始化
onMounted(() => {
    // 如果使用随机文件名且当前没有随机文件名，则生成一个
    if (localExportConfig.useRandomFileName && !localExportConfig.currentRandomFileName) {
        generateAndCacheRandomFileName()
    }
})
</script>