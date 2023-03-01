import Store from 'electron-store'
import { sleep } from '../utils'

const store = new Store()
const storePath = store.path
console.log('store path:', storePath)

export async function handleOpStore(_event, args) {
  switch (args.op) {
    case 'get':
      return store.get(args.key)
    case 'set':
      await sleep(500) // 假装花了点时间
      store.set(args.key, args.value)
      return { message: args.key + ' saved' }
  }
}

export function getSettings() {
  return store.get('settings') || {}
}
