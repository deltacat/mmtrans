<script setup lang="ts">
import { reactive, toRaw } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import { electronStore, osApi } from '@r/utils/electronApi'
import { Check } from '@element-plus/icons-vue'

type Settings = {
  outputPath?: string,
  ncmCoreKey?: string,
  ncmMetaKey?: string,
  mock?: boolean
}
const settings: Settings = reactive({})

electronStore.get('settings').then((res: Settings) => {
  Object.assign(settings, res)
})

function openDlg() {
  osApi.openFolderDlg().then(items => {
    if (items && items.length > 0) {
      const outPath = items[0]
      settings.outputPath = outPath
    }
  })
}

function apply() {
  electronStore.set('settings', toRaw(settings)).then((res) => {
    console.log('设置已保存!')
  })
}
</script>

<template>
  <el-container>
    <el-header>
      <h2>设置</h2>
    </el-header>
    <el-main>
      <el-form label-width="88px">
        <el-divider content-position="left" border-style="dashed">输出</el-divider>
        <el-form-item label="保存位置" required>
          <el-input placeholder="选择出产保存路径" v-model="settings.outputPath">
            <template #append>
              <el-button :icon="Folder" @click="openDlg" />
            </template>
          </el-input>
        </el-form-item>
        <el-divider content-position="left" border-style="dashed">ncm</el-divider>
        <el-form-item label="core key" required>
          <el-input type="password" placeholder="请输入 ncm core key" v-model="settings.ncmCoreKey">
          </el-input>
        </el-form-item>
        <el-form-item label="meta key" required>
          <el-input type="password" placeholder="请输入 ncm meta key" v-model="settings.ncmMetaKey">
          </el-input>
        </el-form-item>
        <el-divider content-position="left" border-style="dashed">功能</el-divider>
        <el-form-item label="开发者">
          <!-- 模拟开关。开启后仅显示交互，不实际操作文件。 -->
          <el-checkbox v-model="settings.mock" label="模拟" border  />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="footer">
      <el-button :icon="Check" type="primary" @click="apply">应用</el-button>
    </el-footer>
  </el-container>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
