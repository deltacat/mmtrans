import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@r': resolve('src/renderer'),
        '@assets': resolve('src/renderer/assets')
      }
    },
    plugins: [
      vue(),
      Components({ resolvers: [IconsResolver()] }),
      Icons({ compiler: 'vue3', autoInstall: true })
    ]
  }
})
