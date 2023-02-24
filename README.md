# media format transformer

Electron 打包学习项目：媒体格式转换工具。

## 开始

### 安装依赖

electron 在国内下载缓慢，在安装依赖前应先设置国内镜像。这里推荐淘宝镜像源。建议 npm / yarn 的全局镜像也设置为淘宝镜像（推荐全局安装 nrm 进行切换）。

- npm

代码根目录下建立文件 .npmrc，包含如下内容：

```plain
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

执行

```bash
npm install
```

- yarn

```bash
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/
yarn install
```

### 启动应用

- 开发调试

```bash
yarn dev
```

- 编译

```bash
# For windows
yarn build:win

# For macOS
yarn build:mac

# For Linux
yarn build:linux
```

## 参考资料

- [Electron 官网](https://www.electronjs.org/zh/)
- [electron-vite：新一代 Electron 开发利器](https://juejin.cn/post/7137987061176336397)
- [从零开始捣鼓一个 Electron 应用](https://sumygg.com/2017/06/19/start-from-the-very-beginning-for-electron-with-element-ui-and-icon/)
- [淘宝镜像](http://npmmirror.com)
