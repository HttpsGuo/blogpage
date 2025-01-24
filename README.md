# HttpsGuo的个人主页

一个简洁美观的个人主页模板，包含响应式设计、动态时钟、新年祝福生成器、文章展示等功能。

## 预览
- 演示地址：[www.httpsguo.cn](https://www.httpsguo.cn)
- 博客地址：[blog.httpsguo.cn](https://blog.httpsguo.cn)

## 功能特点
- 响应式设计，适配各种设备
- 桌面端（>768px）：双列布局
- 平板端（768px-480px）：单列布局
- 移动端（<480px）：紧凑单列布局
- 精美的动态时钟显示
- 新年祝福生成器
- 最新文章和热门文章展示
- 社交媒体链接和二维码展示
- 友情链接展示
- SEO优化
- 性能优化

## 目录结构 
├── index.html # 主页面
├── style.css # 样式文件
├── script.js # JavaScript脚本
└── README.md # 说明文档

## 快速开始

1. 克隆仓库 

2. 修改个人信息
- 打开 `index.html`，修改以下部分：
  - 标题和描述
  - 头像地址
  - 个人简介
  - 联系方式
  - 社交媒体链接
  - 导航栏链接
  - 备案信息

3. 修改文章列表
- 在 `script.js` 中修改 `popularArticles` 数组来更新热门文章
- 配置 WordPress API 地址来获取最新文章

## 可自定义部分

### 1. 基础信息
- 网站标题和描述（SEO相关）
- 头像和个人简介
- 联系方式
- 社交媒体链接和二维码
- 导航栏链接
- 备案信息

### 2. 样式定制
- 背景颜色（修改 `style.css` 中的 `background-color`）
- 主题颜色（修改 `style.css` 中的颜色变量）
- 卡片样式
- 时钟样式
- 字体和文字大小

### 3. 功能模块
- 时钟显示（可在 `clock-card` 中修改）
- 新年祝福生成器（可在 `script.js` 中修改祝福语）
- 文章展示（可修改文章数量和来源）
- 友情链接（可添加或移除）

### 4. 性能优化
- 图片懒加载
- DNS预解析
- 资源预加载
- 字体图标按需加载

## 注意事项
1. 修改社交媒体链接时，需同时更新图标和对应的二维码
2. 添加友情链接时，建议保持图标大小一致（16x16px）
3. 修改文章API时，需要确保返回数据格式正确
4. 自定义样式时，建议保持响应式设计的兼容性
5. 移动端适配时注意测试不同尺寸设备的显示效果

## 技术栈
- HTML5
- CSS3
- JavaScript（原生）
- Font Awesome（图标）

## 浏览器支持
- Chrome (推荐)
- Firefox
- Safari
- Edge
- Opera

## 开源协议
本项目基于 MIT 协议开源，使用时请保留作者信息。

## 特别感谢
感谢 [前端嘛](https://www.fecoder.cn/) 提供的代码支持。

## 作者信息
- 作者：httpsguo
- 网站：https://www.httpsguo.cn
- 博客：https://blog.httpsguo.cn
- 邮箱：httpsguo@163.com
- Telegram：https://t.me/httpsguo

## 更新日志
- 2024-01-25：初始版本发布 