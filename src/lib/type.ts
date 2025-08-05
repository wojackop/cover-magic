import { BACKGROUND_TYPE, GRADIENT_DIRECTION } from '@/lib/constant'

// 背景类型
export type BackgroundType = typeof BACKGROUND_TYPE[keyof typeof BACKGROUND_TYPE];

// 渐变方向
export type GradientDirection = typeof GRADIENT_DIRECTION[keyof typeof GRADIENT_DIRECTION];

// 渐变背景配置
export type GradientConfig = {
  startColor: string // 起始颜色：十六进制颜色值
  endColor: string // 结束颜色：十六进制颜色值
  direction: GradientDirection // 渐变方向
}

// 背景设置
export type BackgroundConfig = {
  type: BackgroundType // 背景类型：'color'表示纯色背景，'image'表示图片背景，'gradient'表示渐变背景
  color: string // 背景颜色：十六进制颜色值，默认为黑色
  opacity: number // 背景不透明度：范围0-100，100表示完全不透明
  image: string // 背景图片：Base64格式的图片数据URL字符串
  imageObj: HTMLImageElement | null // 背景图片对象：用于Canvas绘制的图片DOM元素
  blur: number // 背景模糊度：应用于图片背景的模糊效果，单位为像素
  gradient: GradientConfig // 渐变背景配置
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
  uppercase: boolean // 大写：true表示将英文转换为大写，false表示不转换
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

// 水印设置
export type WatermarkConfig = {
  text: string // 水印文本：显示在封面上的水印内容
  font: string // 字体名称：指定水印文本使用的字体
  size: number // 字体大小：控制水印文本的显示尺寸，单位为像素
  color: string // 字体颜色：指定水印文本的颜色，默认为白色
  opacity: number // 不透明度：控制水印的透明度，范围0-100，100表示完全不透明
  position: Position // 水印位置：控制水印在画布中的位置
  effects: TextEffects // 文本效果：控制水印文本的样式效果
}

// 随机文件名选项
export type RandomFileNameOptions = {
  includeNumbers: boolean // 是否包含数字：true表示包含数字
  includeLowercase: boolean // 是否包含小写字母：true表示包含小写字母
  includeUppercase: boolean // 是否包含大写字母：true表示包含大写字母
}

// 导出设置
export type ExportConfig = {
  width: number // 导出宽度：导出图片的宽度，单位为像素
  height: number // 导出高度：导出图片的高度，单位为像素
  format: string // 导出格式：支持'png'、'jpeg'、'webp'等格式
  fileName: string // 文件名：导出图片的文件名
  useRandomFileName: boolean // 是否使用随机文件名：true表示使用随机生成的文件名
  randomFileNameLength: number // 随机文件名长度：随机生成的文件名的字符数
  randomFileNameOptions: RandomFileNameOptions // 随机文件名选项：控制随机文件名包含的字符类型
  currentRandomFileName: string // 当前随机文件名：当前生成的随机文件名
  quality: number // 图片质量：范围0.1-1.0，值越大质量越高，体积越大，1.0表示原始质量
}
