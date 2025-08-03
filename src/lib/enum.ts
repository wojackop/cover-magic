// 背景类型
export enum BACKGROUND_TYPE {
    COLOR = 'color', // 纯色背景
    IMAGE = 'image', // 图片背景
    GRADIENT = 'gradient' // 渐变背景
}

// 渐变方向
export enum GRADIENT_DIRECTION {
    TO_RIGHT = 'to right', // 从左到右
    TO_LEFT = 'to left', // 从右到左
    TO_BOTTOM = 'to bottom', // 从上到下
    TO_TOP = 'to top', // 从下到上
    TO_BOTTOM_RIGHT = 'to bottom right', // 左上到右下
    TO_BOTTOM_LEFT = 'to bottom left', // 右上到左下
    TO_TOP_RIGHT = 'to top right', // 左下到右上
    TO_TOP_LEFT = 'to top left' // 右下到左上
}
