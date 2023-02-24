// 如下代码直接暴露 ipc... 对象给渲染进程。调试可用，不建议实用。
// const electronApi = window.electronApi
// export const ipcRenderer = electronApi.ipcRenderer
// export const ipcProcess = electronApi.process

const userApi = window.userApi
export const fileProcessor = userApi.fileProcessor
export const versions = userApi.versions
export const electronStore = userApi.store
export const osApi = userApi.osApi
