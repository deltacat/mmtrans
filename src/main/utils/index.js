import { dialog } from 'electron'
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export const openFolderDialog = () =>
  dialog.showOpenDialogSync({ properties: ['openFile', 'openDirectory'] })

export default {}
