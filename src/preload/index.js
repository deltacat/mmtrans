/**
 * 不建议直接暴露 electroAPI、ipcRenderer 给渲染进程。存在安全隐患。
 * https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload
 */

import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fileProcessor from './fileProcessor'
import store from './store'
import osApi from './osApi'

const ipcProcess = electronAPI.process
const versions = Object.assign({ appVer: ipcProcess.env.npm_package_version }, ipcProcess.versions)

// Custom APIs for renderer
const userApi = {
  fileProcessor,
  versions,
  store,
  osApi
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  console.log('under context isolation!')
  try {
    // contextBridge.exposeInMainWorld('electronApi', electronAPI)
    contextBridge.exposeInMainWorld('userApi', userApi)
  } catch (error) {
    console.error(error)
  }
} else {
  console.log('WARN: not context isolation!')
  // window.electron = electronAPI
  window.userApi = userApi
}
