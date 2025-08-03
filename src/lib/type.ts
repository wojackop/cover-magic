import { BACKGROUND_TYPE } from '@/lib/enum'

// 背景设置
export type BackgroundConfig = {
    type: BACKGROUND_TYPE // 背景类型：'color'表示纯色背景，'image'表示图片背景
    color: string // 背景颜色：十六进制颜色值，默认为黑色
    opacity: number // 背景不透明度：范围0-100，100表示完全不透明
    image: string // 背景图片：Base64格式的图片数据URL字符串
    imageObj: HTMLImageElement | null // 背景图片对象：用于Canvas绘制的图片DOM元素
    blur: number // 背景模糊度：应用于图片背景的模糊效果，单位为像素
}

// 位置类型定义
export type Position = {
  x: number // 水平位置：以百分比表示，50表示水平居中
  y: number // 垂直位置：以百分比表示，50表示垂直居中
}

// 图标设置
export type IconConfig = {
  code: string // 图标代码：使用Iconify图标库的标识符，指定要显示的图标
  size: number // 图标大小：控制图标的显示尺寸，单位为像素
  shadowSize: number // 阴影大小：控制图标阴影的模糊半径，值越大阴影越模糊扩散
  shadowColor: string // 阴影颜色：指定图标阴影的颜色，默认为白色
  position: Position // 图标位置：控制图标在画布中的位置
  svg: string // 图标SVG内容：存储从Iconify API获取的SVG代码
}

// 文本效果类型定义
export type TextEffects = {
  bold: boolean // 粗体：true表示使用粗体，false表示不使用
  italic: boolean // 斜体：true表示使用斜体，false表示不使用
}

// 标题设置
export type TitleConfig = {
  text: string // 标题文本：显示在封面上的文字内容
  font: string // 字体名称：指定标题文本使用的字体
  size: number // 字体大小：控制标题文本的显示尺寸，单位为像素
  color: string // 字体颜色：指定标题文本的颜色，默认为白色
  position: Position // 标题位置：控制标题在画布中的位置
  effects: TextEffects // 文本效果：控制标题文本的样式效果
}
