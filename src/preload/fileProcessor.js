import { ipcRenderer } from 'electron'

function sendFile(file) {
  return ipcRenderer.invoke('process_file', file)
}

function handleProgress(handler) {
  ipcRenderer.on('process_file_progress', handler)
}

export default {
  sendFile,
  handleProgress
}
