<template>
    <n-card class="mb-8" size="large">
        <template #header>
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:preview" class="text-xl text-blue-600" />
                <span class="font-semibold">实时预览</span>
            </div>
        </template>
        <div class="flex justify-center">
            <canvas ref="previewCanvas" class="border-2 border-gray-300 rounded-lg shadow-lg w-full max-w-4xl"
                :width="800" :height="450" style="width: 100%; height: auto; max-width: 800px;"></canvas>
        </div>
    </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { BackgroundConfig, IconConfig, TitleConfig, WatermarkConfig, ExportConfig } from '@/lib/type'
import { NCard } from 'naive-ui'

// 定义组件的属性
const props = defineProps<{
    // 背景配置：控制封面背景的各项属性
    backgroundConfig: BackgroundConfig,
    // 图标配置：控制封面中心图标的各项属性
    iconConfig: IconConfig,
    // 标题配置：控制封面标题文本的各项属性
    titleConfig: TitleConfig,
    // 水印配置：控制封面水印的各项属性
    watermarkConfig: WatermarkConfig
}>()

// 定义组件的事件
const emit = defineEmits<{
    // 画布更新事件：当画布内容发生变化时触发
    (e: 'canvas-update'): void
}>()

// 画布引用和缓存变量
const previewCanvas = ref<HTMLCanvasElement>()
let iconImageCache: HTMLImageElement | null = null
let updateTimer: number | null = null
let isUpdating = false
let fontLoaded = false

/**
 * 获取带有回退选项的字体系列字符串
 * @param font 主要字体名称
 * @returns 包含回退字体的完整字体系列字符串
 */
const getFontFamilyWithFallback = (font: string): string => {
    switch (font) {
        case 'Maple Mono CN':
            return '"Maple Mono CN", "Courier New", "Consolas", monospace'
        case 'Fira Code':
            return '"Fira Code", "Courier New", "Consolas", monospace'
        case 'Lato':
            return '"Lato", "Helvetica Neue", "Arial", sans-serif'
        case 'Microsoft YaHei':
            return '"Microsoft YaHei", "微软雅黑", "SimHei", "Arial Unicode MS", sans-serif'
        case 'PingFang SC':
            return '"PingFang SC", "苹方", "Helvetica Neue", "Arial", sans-serif'
        case 'Source Han Sans CN':
            return '"Source Han Sans CN", "思源黑体", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif'
        case 'Arial':
            return 'Arial, "Helvetica Neue", Helvetica, sans-serif'
        case 'Helvetica':
            return 'Helvetica, "Helvetica Neue", Arial, sans-serif'
        case 'monospace':
            return '"Courier New", Consolas, "Liberation Mono", monospace'
        case 'serif':
            return '"Times New Roman", Times, "Songti SC", serif'
        default:
            return `"${font}", Arial, sans-serif`
    }
}

// 检测字体是否加载完成
const checkFontLoaded = async () => {
    if (fontLoaded) return true

    try {
        // 使用 document.fonts.ready 检测字体加载
        await document.fonts.ready

        // 额外检查 Maple Mono CN 字体是否可用
        const testCanvas = document.createElement('canvas')
        const testCtx = testCanvas.getContext('2d')
        if (testCtx) {
            testCtx.font = '16px Maple Mono CN'
            const mapleWidth = testCtx.measureText('测试').width

            testCtx.font = '16px monospace'
            const fallbackWidth = testCtx.measureText('测试').width

            // 如果宽度不同，说明 Maple Mono CN 已加载
            fontLoaded = Math.abs(mapleWidth - fallbackWidth) > 0.1
        }

        return fontLoaded
    } catch (error) {
        console.warn('字体检测失败:', error)
        fontLoaded = true // 假设已加载，避免无限等待
        return true
    }
}

// 等待字体加载的辅助函数
const waitForFont = async (maxWait = 3000) => {
    const startTime = Date.now()

    while (!fontLoaded && (Date.now() - startTime) < maxWait) {
        await checkFontLoaded()
        if (!fontLoaded) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }

    return fontLoaded
}

// 绘制阴影
const drawShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    if (props.iconConfig.shadowSize > 0) {
        ctx.shadowColor = props.iconConfig.shadowColor
        ctx.shadowBlur = props.iconConfig.shadowSize
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
    }
}

// 清除阴影
const clearShadow = (ctx: CanvasRenderingContext2D) => {
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
}

// 绘制 SVG 图标（使用缓存）
const drawIcon = async (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    if (!props.iconConfig.svg) return

    // 如果缓存的图标存在且可用，直接使用
    if (iconImageCache) {
        // 设置阴影
        drawShadow(ctx, x, y, size)

        // 绘制图标，保持宽高比
        const aspectRatio = iconImageCache.width / iconImageCache.height
        let drawWidth = size
        let drawHeight = size

        if (aspectRatio > 1) {
            drawHeight = size / aspectRatio
        } else {
            drawWidth = size * aspectRatio
        }

        ctx.drawImage(iconImageCache, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)

        // 清除阴影
        clearShadow(ctx)
        return
    }

    // 如果没有缓存，创建新的图标
    return new Promise<void>((resolve) => {
        const svgBlob = new Blob([props.iconConfig.svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(svgBlob)
        const img = new Image()

        img.onload = () => {
            // 缓存图标
            iconImageCache = img

            // 设置阴影
            drawShadow(ctx, x, y, size)

            // 绘制图标，保持宽高比
            const aspectRatio = img.width / img.height
            let drawWidth = size
            let drawHeight = size

            if (aspectRatio > 1) {
                drawHeight = size / aspectRatio
            } else {
                drawWidth = size * aspectRatio
            }

            ctx.drawImage(img, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight)

            // 清除阴影
            clearShadow(ctx)

            URL.revokeObjectURL(url)
            resolve()
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            resolve()
        }

        img.src = url
    })
}

// 存储动画状态
interface AnimationState {
    value: number;
    target: number;
    velocity: number;
}

// 创建动画状态对象
const createAnimationState = (initialValue: number = 0): AnimationState => ({
    value: initialValue,
    target: initialValue,
    velocity: 0
});

// 存储所有需要动画的属性状态
const animationStates = {
    titleSize: createAnimationState(),
    titleX: createAnimationState(),
    titleY: createAnimationState(),
    watermarkSize: createAnimationState(),
    watermarkX: createAnimationState(),
    watermarkY: createAnimationState(),
    iconSize: createAnimationState(),
    iconX: createAnimationState(),
    iconY: createAnimationState(),
    watermarkOpacity: createAnimationState(),
    backgroundBlur: createAnimationState()
};

// 弹簧动画参数
const SPRING_STIFFNESS = 200; // 弹簧刚度
const SPRING_DAMPING = 20;   // 阻尼系数
const SPRING_MASS = 1;       // 质量
const SPRING_PRECISION = 0.01; // 精度阈值

// 是否正在执行动画循环
let animationLoopRunning = false;

// 弹簧动画更新函数 - 使用物理模型实现更自然的动画
const updateSpringAnimation = (state: AnimationState, dt: number): boolean => {
    // 计算弹簧力
    const displacement = state.target - state.value;

    // 如果位移很小，直接到达目标位置
    if (Math.abs(displacement) < SPRING_PRECISION && Math.abs(state.velocity) < SPRING_PRECISION) {
        state.value = state.target;
        state.velocity = 0;
        return false; // 动画完成
    }

    // 计算弹簧力 (F = -kx)
    const springForce = SPRING_STIFFNESS * displacement;

    // 计算阻尼力 (F = -cv)
    const dampingForce = -SPRING_DAMPING * state.velocity;

    // 合力
    const force = springForce + dampingForce;

    // 加速度 (F = ma, a = F/m)
    const acceleration = force / SPRING_MASS;

    // 更新速度 (v = v0 + at)
    state.velocity += acceleration * dt;

    // 更新位置 (x = x0 + vt)
    state.value += state.velocity * dt;

    return true; // 动画继续
}

// 更新动画目标值
const updateAnimationTargets = () => {
    // 更新标题相关动画目标
    animationStates.titleSize.target = props.titleConfig.size;
    animationStates.titleX.target = props.titleConfig.position.x;
    animationStates.titleY.target = props.titleConfig.position.y;

    // 更新水印相关动画目标
    animationStates.watermarkSize.target = props.watermarkConfig.size;
    animationStates.watermarkX.target = props.watermarkConfig.position.x;
    animationStates.watermarkY.target = props.watermarkConfig.position.y;
    animationStates.watermarkOpacity.target = props.watermarkConfig.opacity;

    // 更新图标相关动画目标
    animationStates.iconSize.target = props.iconConfig.size;
    animationStates.iconX.target = props.iconConfig.position.x;
    animationStates.iconY.target = props.iconConfig.position.y;

    // 更新背景模糊动画目标
    animationStates.backgroundBlur.target = props.backgroundConfig.blur;

    // 如果是首次更新，直接设置当前值等于目标值
    if (animationStates.titleSize.value === 0) {
        Object.keys(animationStates).forEach(key => {
            const state = animationStates[key as keyof typeof animationStates];
            state.value = state.target;
        });
    }

    // 启动动画循环（如果尚未运行）
    startAnimationLoop();
};

// 启动动画循环
const startAnimationLoop = () => {
    if (animationLoopRunning) return;

    animationLoopRunning = true;
    let lastTime = performance.now();

    const animationLoop = async () => {
        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // 秒为单位，限制最大时间步长
        lastTime = currentTime;

        // 更新所有动画状态
        let anyActive = false;
        Object.keys(animationStates).forEach(key => {
            const state = animationStates[key as keyof typeof animationStates];
            if (updateSpringAnimation(state, deltaTime)) {
                anyActive = true;
            }
        });

        // 渲染当前帧
        await renderCurrentFrame();

        // 如果还有活动的动画，继续循环
        if (anyActive) {
            requestAnimationFrame(animationLoop);
        } else {
            animationLoopRunning = false;
        }
    };

    // 开始动画循环
    requestAnimationFrame(animationLoop);
};

// 防抖更新画布 - 只更新目标值，不直接渲染
const debouncedUpdateCanvas = () => {
    if (updateTimer) {
        clearTimeout(updateTimer);
    }

    updateTimer = setTimeout(() => {
        updateAnimationTargets();
    }, 5); // 使用更短的延迟，提高响应性
};

// 渲染当前帧
const renderCurrentFrame = async () => {
    if (isUpdating) return;
    isUpdating = true;

    await nextTick();

    const canvas = previewCanvas.value;
    if (!canvas) {
        isUpdating = false;
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        isUpdating = false;
        return;
    }

    // 等待字体加载完成
    await waitForFont();

    // 使用requestAnimationFrame确保平滑渲染
    requestAnimationFrame(async () => {
        // 获取当前动画值
        const currentTitleSize = animationStates.titleSize.value;
        const currentTitleX = animationStates.titleX.value;
        const currentTitleY = animationStates.titleY.value;
        const currentWatermarkSize = animationStates.watermarkSize.value;
        const currentWatermarkX = animationStates.watermarkX.value;
        const currentWatermarkY = animationStates.watermarkY.value;
        const currentIconSize = animationStates.iconSize.value;
        const currentIconX = animationStates.iconX.value;
        const currentIconY = animationStates.iconY.value;

        // 渲染当前帧
        await renderFrame(
            currentTitleSize, currentTitleX, currentTitleY,
            currentWatermarkSize, currentWatermarkX, currentWatermarkY,
            currentIconSize, currentIconX, currentIconY
        );

        isUpdating = false;
    });
};

// 渲染单个帧
const renderFrame = async (
    currentTitleSize: number, currentTitleX: number, currentTitleY: number,
    currentWatermarkSize: number, currentWatermarkX: number, currentWatermarkY: number,
    currentIconSize: number, currentIconX: number, currentIconY: number
) => {
    const canvas = previewCanvas.value
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // 清空画布 - 使用填充而不是clearRect以减少闪烁
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 绘制背景
    if (props.backgroundConfig.type === 'color') {
        // 绘制纯色背景，应用透明度
        const opacity = props.backgroundConfig.opacity / 100
        const color = props.backgroundConfig.color

        // 将十六进制颜色转换为 rgba 格式
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (props.backgroundConfig.imageObj) {
        // 绘制背景图片
        ctx.filter = `blur(${props.backgroundConfig.blur}px)`
        ctx.drawImage(props.backgroundConfig.imageObj, 0, 0, canvas.width, canvas.height)
        ctx.filter = 'none'
    }

    // 绘制图标
    if (props.iconConfig.svg) {
        const iconPosX = (currentIconX / 100) * canvas.width
        const iconPosY = (currentIconY / 100) * canvas.height
        await drawIcon(ctx, iconPosX, iconPosY, currentIconSize)
    }

    // 绘制标题
    if (props.titleConfig.text) {
        const titlePosX = (currentTitleX / 100) * canvas.width
        const titlePosY = (currentTitleY / 100) * canvas.height

        ctx.save()
        ctx.fillStyle = props.titleConfig.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 构建字体字符串 - 只设置加粗，斜体用变换实现
        let fontWeight = props.titleConfig.effects.bold ? 'bold' : 'normal'

        // 获取带回退的字体系列
        const fontFamily = getFontFamilyWithFallback(props.titleConfig.font)

        ctx.font = `${fontWeight} ${props.titleConfig.size}px ${fontFamily}`

        // 如果需要斜体，使用变换
        if (props.titleConfig.effects.italic) {
            ctx.translate(titlePosX, titlePosY)
            ctx.transform(1, 0, -0.2, 1, 0, 0)

            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.titleConfig.effects.bold && props.titleConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                ctx.strokeStyle = props.titleConfig.color
                ctx.lineWidth = props.titleConfig.size * 2 * 0.01 // 根据字体大小调整描边宽度（导出时使用2倍缩放）
                ctx.strokeText(props.titleConfig.text, 0, 0)
            }
            ctx.fillText(props.titleConfig.text, 0, 0)
        } else {
            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.titleConfig.effects.bold && props.titleConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                ctx.strokeStyle = props.titleConfig.color
                ctx.lineWidth = props.titleConfig.size * 2 * 0.01 // 根据字体大小调整描边宽度
                ctx.strokeText(props.titleConfig.text, titlePosX, titlePosY)
            }
            ctx.fillText(props.titleConfig.text, titlePosX, titlePosY)
        }
        ctx.restore()
    }

    // 绘制水印
    if (props.watermarkConfig.text) {
        const watermarkPosX = (currentWatermarkX / 100) * canvas.width
        const watermarkPosY = (currentWatermarkY / 100) * canvas.height
        const watermarkOpacity = props.watermarkConfig.opacity / 100

        ctx.save()
        ctx.globalAlpha = watermarkOpacity
        ctx.fillStyle = props.watermarkConfig.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 构建字体字符串
        let fontWeight = props.watermarkConfig.effects.bold ? 'bold' : 'normal'

        // 获取带回退的字体系列
        const fontFamily = getFontFamilyWithFallback(props.watermarkConfig.font)

        ctx.font = `${fontWeight} ${props.watermarkConfig.size}px ${fontFamily}`

        // 如果需要斜体，使用变换
        if (props.watermarkConfig.effects.italic) {
            ctx.translate(watermarkPosX, watermarkPosY)
            ctx.transform(1, 0, -0.2, 1, 0, 0)

            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.watermarkConfig.effects.bold && props.watermarkConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                ctx.strokeStyle = props.watermarkConfig.color
                ctx.lineWidth = props.watermarkConfig.size * 0.01 // 根据字体大小调整描边宽度
                ctx.strokeText(props.watermarkConfig.text, 0, 0)
            }
            ctx.fillText(props.watermarkConfig.text, 0, 0)
        } else {
            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.watermarkConfig.effects.bold && props.watermarkConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                ctx.strokeStyle = props.watermarkConfig.color
                ctx.lineWidth = props.watermarkConfig.size * 0.01 // 根据字体大小调整描边宽度
                ctx.strokeText(props.watermarkConfig.text, watermarkPosX, watermarkPosY)
            }
            ctx.fillText(props.watermarkConfig.text, watermarkPosX, watermarkPosY)
        }
        ctx.restore()
    }
}

// 更新画布 - 公共入口点
const updateCanvas = () => {
    debouncedUpdateCanvas()
    emit('canvas-update')
}

// 监听配置变化，更新画布
watch(() => [
    props.backgroundConfig,
    props.iconConfig,
    props.titleConfig,
    props.watermarkConfig
], () => {
    updateCanvas()
}, { deep: true })

// 当图标SVG内容变化时，清除缓存
watch(() => props.iconConfig.svg, () => {
    iconImageCache = null
})

// 组件挂载时初始化
onMounted(async () => {
    // 等待字体加载
    await waitForFont()

    // 初始化画布
    updateCanvas()
})

// 导出图片函数
const exportImage = async (exportConfig: ExportConfig) => {
    const canvas = previewCanvas.value
    if (!canvas) return

    // 创建一个新的离屏画布，用于导出
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = exportConfig.width
    exportCanvas.height = exportConfig.height

    const exportCtx = exportCanvas.getContext('2d', { alpha: false })
    if (!exportCtx) return

    // 清空导出画布
    exportCtx.fillStyle = '#ffffff'
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)

    // 绘制背景
    if (props.backgroundConfig.type === 'color') {
        // 绘制纯色背景，应用透明度
        const opacity = props.backgroundConfig.opacity / 100
        const color = props.backgroundConfig.color

        // 将十六进制颜色转换为 rgba 格式
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)

        exportCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    } else if (props.backgroundConfig.imageObj) {
        // 绘制背景图片
        exportCtx.filter = `blur(${props.backgroundConfig.blur}px)`
        exportCtx.drawImage(props.backgroundConfig.imageObj, 0, 0, exportCanvas.width, exportCanvas.height)
        exportCtx.filter = 'none'
    }

    // 绘制图标
    if (props.iconConfig.svg) {
        const iconPosX = (props.iconConfig.position.x / 100) * exportCanvas.width
        const iconPosY = (props.iconConfig.position.y / 100) * exportCanvas.height
        const iconSize = props.iconConfig.size * (exportCanvas.width / canvas.width) // 按比例缩放

        // 使用 SVG 数据 URL 创建图像
        const svgBlob = new Blob([props.iconConfig.svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(svgBlob)
        const img = new Image()

        await new Promise<void>((resolve) => {
            img.onload = () => {
                // 设置阴影
                if (props.iconConfig.shadowSize > 0) {
                    exportCtx.shadowColor = props.iconConfig.shadowColor
                    exportCtx.shadowBlur = props.iconConfig.shadowSize * (exportCanvas.width / canvas.width) // 按比例缩放
                    exportCtx.shadowOffsetX = 0
                    exportCtx.shadowOffsetY = 0
                }

                // 绘制图标，保持宽高比
                const aspectRatio = img.width / img.height
                let drawWidth = iconSize
                let drawHeight = iconSize

                if (aspectRatio > 1) {
                    drawHeight = iconSize / aspectRatio
                } else {
                    drawWidth = iconSize * aspectRatio
                }

                exportCtx.drawImage(img, iconPosX - drawWidth / 2, iconPosY - drawHeight / 2, drawWidth, drawHeight)

                // 清除阴影
                exportCtx.shadowColor = 'transparent'
                exportCtx.shadowBlur = 0
                exportCtx.shadowOffsetX = 0
                exportCtx.shadowOffsetY = 0

                URL.revokeObjectURL(url)
                resolve()
            }

            img.onerror = () => {
                URL.revokeObjectURL(url)
                resolve()
            }

            img.src = url
        })
    }

    // 绘制标题
    if (props.titleConfig.text) {
        const titlePosX = (props.titleConfig.position.x / 100) * exportCanvas.width
        const titlePosY = (props.titleConfig.position.y / 100) * exportCanvas.height
        const titleSize = props.titleConfig.size * (exportCanvas.width / canvas.width) // 按比例缩放

        exportCtx.fillStyle = props.titleConfig.color
        exportCtx.textAlign = 'center'
        exportCtx.textBaseline = 'middle'

        // 构建字体字符串
        let fontWeight = props.titleConfig.effects.bold ? 'bold' : 'normal'

        // 获取带回退的字体系列
        const fontFamily = getFontFamilyWithFallback(props.titleConfig.font)

        exportCtx.font = `${fontWeight} ${titleSize}px ${fontFamily}`

        exportCtx.save()
        // 如果需要斜体，使用变换
        if (props.titleConfig.effects.italic) {
            exportCtx.translate(titlePosX, titlePosY)
            exportCtx.transform(1, 0, -0.2, 1, 0, 0)

            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.titleConfig.effects.bold && props.titleConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                exportCtx.strokeStyle = props.titleConfig.color
                exportCtx.lineWidth = titleSize * 0.01 // 根据字体大小调整描边宽度
                exportCtx.strokeText(props.titleConfig.text, 0, 0)
            }
            exportCtx.fillText(props.titleConfig.text, 0, 0)
        } else {
            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.titleConfig.effects.bold && props.titleConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                exportCtx.strokeStyle = props.titleConfig.color
                exportCtx.lineWidth = titleSize * 0.01 // 根据字体大小调整描边宽度
                exportCtx.strokeText(props.titleConfig.text, titlePosX, titlePosY)
            }
            exportCtx.fillText(props.titleConfig.text, titlePosX, titlePosY)
        }
        exportCtx.restore()
    }

    // 绘制水印
    if (props.watermarkConfig.text) {
        const watermarkPosX = (props.watermarkConfig.position.x / 100) * exportCanvas.width
        const watermarkPosY = (props.watermarkConfig.position.y / 100) * exportCanvas.height
        const watermarkSize = props.watermarkConfig.size * (exportCanvas.width / canvas.width) // 按比例缩放
        const watermarkOpacity = props.watermarkConfig.opacity / 100

        exportCtx.save()
        exportCtx.globalAlpha = watermarkOpacity
        exportCtx.fillStyle = props.watermarkConfig.color
        exportCtx.textAlign = 'center'
        exportCtx.textBaseline = 'middle'

        // 构建字体字符串
        let fontWeight = props.watermarkConfig.effects.bold ? 'bold' : 'normal'

        // 获取带回退的字体系列
        const fontFamily = getFontFamilyWithFallback(props.watermarkConfig.font)

        exportCtx.font = `${fontWeight} ${watermarkSize}px ${fontFamily}`

        // 如果需要斜体，使用变换
        if (props.watermarkConfig.effects.italic) {
            exportCtx.translate(watermarkPosX, watermarkPosY)
            exportCtx.transform(1, 0, -0.2, 1, 0, 0)

            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.watermarkConfig.effects.bold && props.watermarkConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                exportCtx.strokeStyle = props.watermarkConfig.color
                exportCtx.lineWidth = watermarkSize * 0.01 // 根据字体大小调整描边宽度
                exportCtx.strokeText(props.watermarkConfig.text, 0, 0)
            }
            exportCtx.fillText(props.watermarkConfig.text, 0, 0)
        } else {
            // 特殊处理 Maple Mono CN 的加粗效果
            if (props.watermarkConfig.effects.bold && props.watermarkConfig.font === 'Maple Mono CN') {
                // 使用描边模拟加粗效果
                exportCtx.strokeStyle = props.watermarkConfig.color
                exportCtx.lineWidth = watermarkSize * 0.01 // 根据字体大小调整描边宽度
                exportCtx.strokeText(props.watermarkConfig.text, watermarkPosX, watermarkPosY)
            }
            exportCtx.fillText(props.watermarkConfig.text, watermarkPosX, watermarkPosY)
        }
        exportCtx.restore()
    }

    // 获取最终文件名
    const getFinalFileName = () => {
        return exportConfig.useRandomFileName && exportConfig.currentRandomFileName
            ? exportConfig.currentRandomFileName
            : exportConfig.fileName
    }

    // 导出图片
    const dataURL = exportCanvas.toDataURL(`image/${exportConfig.format}`, 1.0)

    // 创建下载链接
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `${getFinalFileName()}.${exportConfig.format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// 暴露方法给父组件
defineExpose({
    previewCanvas,
    updateCanvas,
    exportImage
})
</script>