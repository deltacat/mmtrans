<script setup lang="ts">
import { reactive, toRaw, computed, ref } from 'vue'
import { Folder, Check, Loading } from '@element-plus/icons-vue'
import { electronStore, osApi } from '@r/utils/electronApi'
import { ElMessage } from 'element-plus'

type Settings = {
  outputPath?: string,
  ncmCoreKey?: string,
  ncmMetaKey?: string,
  mock?: boolean
}
const busy = ref(false)
const settings: Settings = reactive({})
const rules = {
  outputPath: [nonEmptyRule('路径不可为空')],
  ncmCoreKey: [nonEmptyRule('秘钥不可为空')],
  ncmMetaKey: [nonEmptyRule('秘钥不可为空')]
}

function nonEmptyRule(message: string) {
  return { required: true, trigger: 'blur', message }
}

electronStore.get('settings').then((res: Settings) => {
  Object.assign(settings, res)
})

const canSave = computed(() => !busy.value && settings.ncmCoreKey && settings.ncmMetaKey && settings.outputPath)

function openDlg() {
  osApi.openFolderDlg().then(items => {
    if (items && items.length > 0) {
      const outPath = items[0]
      settings.outputPath = outPath
    }
  })
}


async function apply() {
  busy.value = true
  electronStore.set('settings', toRaw(settings)).then((res) => {
    console.log(res)
    ElMessage({ message: '设置已保存！', type: 'success' })
  }).finally(() => {
    busy.value = false
  })
}
</script>

<template>
  <el-container>
    <el-header>
      <h2>设置</h2>
    </el-header>
    <el-main>
      <el-form label-width="88px" :model="settings" :rules="rules">
        <el-divider content-position="left" border-style="dashed">输出</el-divider>
        <el-form-item label="保存位置" required prop="outputPath">
          <el-input placeholder="选择出产保存路径" v-model="settings.outputPath">
            <template #append>
              <el-button :icon="Folder" @click="openDlg" />
            </template>
          </el-input>
        </el-form-item>
        <el-divider content-position="left" border-style="dashed">ncm</el-divider>
        <el-form-item label="core key" required prop="ncmCoreKey">
          <el-input type="password" placeholder="请输入 ncm core key" v-model="settings.ncmCoreKey">
          </el-input>
        </el-form-item>
        <el-form-item label="meta key" required prop="ncmMetaKey">
          <el-input type="password" placeholder="请输入 ncm meta key" v-model="settings.ncmMetaKey">
          </el-input>
        </el-form-item>
        <el-divider content-position="left" border-style="dashed">功能</el-divider>
        <el-form-item label="开发者">
          <!-- 模拟开关。开启后仅显示交互，不实际操作文件。 -->
          <el-checkbox v-model="settings.mock" label="模拟" border />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>
      <el-button plain type="primary" :disabled="!canSave" :icon="Check" :loading-icon="Loading" :loading="busy" @click="apply">
        保存
      </el-button>
    </el-footer>
  </el-container>
</template>

<style scoped>
.el-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
