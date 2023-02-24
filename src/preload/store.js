import { ipcRenderer } from 'electron'

const OP_STORE = 'op_store'

function get(key) {
  return ipcRenderer.invoke(OP_STORE, { op: 'get', key })
}

function set(key, value) {
  return ipcRenderer.invoke(OP_STORE, { op: 'set', key, value })
}

export default {
  get,
  set
}
