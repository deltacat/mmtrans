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

## WSL2

```shell
# 依赖的库文件
sudo apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev
# 测试显示用的apps
sudo apt install x11-apps
```

启动时可能会出现错误：`gpu_memory_buffer_support_x11.cc(49)] dri3 extension not supported.`

此情况可无视，也可通过关闭硬件加速(`app.disablehardwareacceleration()`)处理。(试过了，暂时无效)

## 参考资料

- [Electron 官网](https://www.electronjs.org/zh/)
- [electron-vite：新一代 Electron 开发利器](https://juejin.cn/post/7137987061176336397)：本项目的启动脚手架来源
- [淘宝镜像](http://npmmirror.com)
- [Electron 关闭硬件加速](https://blog.csdn.net/qq_32660241/article/details/124737796)
