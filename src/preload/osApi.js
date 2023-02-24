import { ipcRenderer } from 'electron'

function openFolderDlg() {
  return ipcRenderer.invoke('open_openFolderDialog')
}

export default {
  openFolderDlg
}
