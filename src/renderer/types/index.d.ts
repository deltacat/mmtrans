// interface ElectronAPI {
//   ipcRenderer: any
//   process: any,
//   versions: any
// }

interface userApi {
  fileProcessor: any
  versions: any
  store: any
  osApi: any
}

declare global {
  interface Window {
    // electronApi: ElectronAPI
    userApi: userApi
  }
}

export {}
