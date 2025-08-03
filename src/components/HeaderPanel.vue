<template>
    <div class="bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800 shadow-md">

        <div class="container mx-auto px-6 py-6">
            <!-- 标题和功能图标区域 -->
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="flex flex-col items-center md:items-start mb-6 md:mb-0">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="bg-blue-500/80 backdrop-blur-md p-3 rounded-xl shadow-lg">
                            <Icon icon="material-symbols:palette" class="text-4xl text-white" />
                        </div>
                        <n-gradient-text :size="40" type="success" class="text-3xl md:text-4xl !font-bold">
                            {{ props.title || '封面制作工具' }}
                        </n-gradient-text>
                    </div>
                    <p class="text-gray-700 text-lg mt-2 max-w-lg">
                        {{ props.subtitle || '专业的封面设计工具，支持实时预览和高质量导出' }}
                    </p>
                </div>

                <div class="flex flex-wrap justify-center gap-4">
                    <button @click="emit('header-action', 'design')"
                        class="group bg-white/50 hover:bg-white/70 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div class="bg-blue-500 group-hover:bg-blue-400 p-2 rounded-lg transition-colors">
                            <Icon icon="material-symbols:design-services" class="text-2xl text-white" />
                        </div>
                        <div>
                            <div class="font-medium">设计</div>
                            <div class="text-xs text-gray-600">创建精美封面</div>
                        </div>
                    </button>

                    <button @click="emit('header-action', 'preview')"
                        class="group bg-white/50 hover:bg-white/70 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div class="bg-indigo-500 group-hover:bg-indigo-400 p-2 rounded-lg transition-colors">
                            <Icon icon="material-symbols:preview" class="text-2xl text-white" />
                        </div>
                        <div>
                            <div class="font-medium">预览</div>
                            <div class="text-xs text-gray-600">实时查看效果</div>
                        </div>
                    </button>

                    <button @click="emit('header-action', 'export')"
                        class="group bg-white/50 hover:bg-white/70 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div class="bg-green-500 group-hover:bg-green-400 p-2 rounded-lg transition-colors">
                            <Icon icon="material-symbols:download" class="text-2xl text-white" />
                        </div>
                        <div>
                            <div class="font-medium">导出</div>
                            <div class="text-xs text-gray-600">保存您的作品</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 功能介绍区域 -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-blue-200/50 shadow-sm">
        <div class="container mx-auto px-6 py-6">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="bg-blue-500/20 p-2 rounded-lg">
                        <Icon icon="material-symbols:info" class="text-xl text-blue-600" />
                    </div>
                    <h2 class="text-xl font-bold text-gray-800">功能亮点</h2>
                </div>
                <div class="text-sm text-blue-600 font-medium">专业封面设计工具</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- 背景设计卡片 -->
                <div
                    class="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                    <div class="flex items-start gap-4">
                        <div class="bg-blue-500/90 text-white p-3 rounded-lg shadow-sm">
                            <Icon icon="material-symbols:brush" class="text-2xl" />
                        </div>
                        <div>
                            <h3 class="font-bold text-blue-800 mb-2">背景设计</h3>
                            <ul class="space-y-2">
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    自定义纯色背景
                                </li>
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    上传自定义图片
                                </li>
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    多方向渐变背景
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 内容编辑卡片 -->
                <div
                    class="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
                    <div class="flex items-start gap-4">
                        <div class="bg-indigo-500/90 text-white p-3 rounded-lg shadow-sm">
                            <Icon icon="material-symbols:format-shapes" class="text-2xl" />
                        </div>
                        <div>
                            <h3 class="font-bold text-indigo-800 mb-2">内容编辑</h3>
                            <ul class="space-y-2">
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    丰富的图标库
                                </li>
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    自定义标题文本
                                </li>
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    水印保护功能
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 导出选项卡片 -->
                <div
                    class="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                    <div class="flex items-start gap-4">
                        <div class="bg-blue-600/90 text-white p-3 rounded-lg shadow-sm">
                            <Icon icon="material-symbols:deployed-code" class="text-2xl" />
                        </div>
                        <div>
                            <h3 class="font-bold text-blue-800 mb-2">导出选项</h3>
                            <ul class="space-y-2">
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    多种格式导出
                                </li>
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    自定义尺寸
                                </li>
                                <li class="flex items-center gap-2 text-sm text-gray-700">
                                    <Icon icon="material-symbols:check-circle" class="text-green-500" />
                                    高质量图像
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { NGradientText } from 'naive-ui'

// 定义组件的 props
const props = defineProps<{
    title?: string // 标题文本，可选
    subtitle?: string // 副标题文本，可选
}>()

// 定义组件的事件
const emit = defineEmits<{
    (e: 'header-action', action: string): void // 头部操作事件
}>()
</script>