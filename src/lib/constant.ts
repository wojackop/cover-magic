// 背景类型
export const BACKGROUND_TYPE = {
  COLOR: 'color', // 纯色背景
  IMAGE: 'image', // 图片背景
  GRADIENT: 'gradient' // 渐变背景
} as const;

// 渐变方向
export const GRADIENT_DIRECTION = {
  TO_RIGHT: 'to right', // 从左到右
  TO_LEFT: 'to left', // 从右到左
  TO_BOTTOM: 'to bottom', // 从上到下
  TO_TOP: 'to top', // 从下到上
  TO_BOTTOM_RIGHT: 'to bottom right', // 左上到右下
  TO_BOTTOM_LEFT: 'to bottom left', // 右上到左下
  TO_TOP_RIGHT: 'to top right', // 左下到右上
  TO_TOP_LEFT: 'to top left' // 右下到左上
} as const;

// 常用颜色预设
export const colorSwatches = [
  // 基础色
  '#000000', '#ffffff', '#808080', '#c0c0c0',
  // 红色系
  '#ff0000', '#ff6b6b', '#ff8a80', '#ffcdd2',
  // 橙色系
  '#ff9800', '#ffb74d', '#ffcc02', '#fff3c4',
  // 黄色系
  '#ffeb3b', '#fff176', '#ffff8d', '#fffde7',
  // 绿色系
  '#4caf50', '#81c784', '#a5d6a7', '#e8f5e8',
  // 蓝色系
  '#2196f3', '#64b5f6', '#90caf9', '#e3f2fd',
  // 紫色系
  '#9c27b0', '#ba68c8', '#ce93d8', '#f3e5f5',
  // 渐变色
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  // 深色系
  '#212121', '#424242', '#616161', '#757575',
  // 浅色系
  '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd'
]

// 字体选项（共享）
export const fontOptions = [
  { label: 'Maple Mono CN (默认)', value: 'Maple Mono CN' },
  { label: 'Fira Code', value: 'Fira Code' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: '苹方', value: 'PingFang SC' },
  { label: '思源黑体', value: 'Source Han Sans CN' },
  { label: '等宽字体', value: 'monospace' },
  { label: '衬线字体', value: 'serif' }
]

// 导出格式选项
export const formatOptions = [
  { label: 'WEBP (高压缩率)', value: 'webp' },
  { label: 'PNG (无损)', value: 'png' },
  { label: 'JPEG (有损)', value: 'jpeg' }
]

// 渐变方向选项
export const gradientDirectionOptions = [
    { label: '从左到右', value: GRADIENT_DIRECTION.TO_RIGHT },
    { label: '从右到左', value: GRADIENT_DIRECTION.TO_LEFT },
    { label: '从上到下', value: GRADIENT_DIRECTION.TO_BOTTOM },
    { label: '从下到上', value: GRADIENT_DIRECTION.TO_TOP },
    { label: '左上到右下', value: GRADIENT_DIRECTION.TO_BOTTOM_RIGHT },
    { label: '右上到左下', value: GRADIENT_DIRECTION.TO_BOTTOM_LEFT },
    { label: '左下到右上', value: GRADIENT_DIRECTION.TO_TOP_RIGHT },
    { label: '右下到左上', value: GRADIENT_DIRECTION.TO_TOP_LEFT }
]