import Store from 'electron-store'

const store = new Store()
const storePath = store.path
console.log('store path:', storePath)

export function handleOpStore(_event, args) {
  switch (args.op) {
    case 'get':
      return store.get(args.key)
    case 'set':
      return store.set(args.key, args.value)
  }
}

export function getSettings() {
  return store.get('settings') || {}
}
