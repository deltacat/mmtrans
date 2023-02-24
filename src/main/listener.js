import { ipcMain } from 'electron'
import { processFile } from './services'
import { openFolderDialog } from './utils'
import { handleOpStore } from './services/store'

async function fileHandler(event, file) {
  const fileProgressCallback = (file) => {
    event.sender.send('process_file_progress', file)
  }
  return processFile(file, fileProgressCallback)
}

function openFolderHanlder() {
  return openFolderDialog()
}

export function startListener() {
  ipcMain.handle('process_file', fileHandler)
  ipcMain.handle('open_openFolderDialog', openFolderHanlder)
  ipcMain.handle('op_store', handleOpStore)
}

export default {
  start: startListener
}
