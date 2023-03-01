<template>
  <el-container>
    <el-header>
      <el-upload height="150px" drag multiple accept=".ncm" :auto-upload="false" :show-file-list="false"
        :on-change="handleChange">
        <div class="text-add">
          <el-icon class="icon-add">
            <plus />
          </el-icon>
          <span>拖拽文件或点击此处添加</span>
        </div>
      </el-upload>
    </el-header>
    <el-main>
      <div>
        <el-table empty-text="尚未添加文件" :data="fileList" class="files" :show-header="false" :cell-style="{ padding: 0 }">
          <el-table-column label="名称">
            <template #default="scope">
              <el-progress :text-inside="true" :stroke-width="24" :percentage="scope.row.percentage">
                <el-tooltip :content="scope.row.path" placement="top-start">
                  {{ scope.row.name }}
                </el-tooltip>
              </el-progress>
            </template>
          </el-table-column>
          <el-table-column width="32px" align="center">
            <template #default="scope">
              <el-icon v-if="scope.row.status === 'success'">
                <SuccessFilled />
              </el-icon>
              <el-tooltip v-if="scope.row.status === 'fail'" :content="scope.row.err">
                <el-icon style="color: #E6A23C">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="64px" align="right" :formatter="sizeFormatter" />
          <el-table-column width="32px" align="center">
            <template #default="scope">
              <el-link style="font-size: smaller;" :icon="Delete" :underline="false" @click="removeOne(scope.$index)"
                :disabled="busy" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer class="footer">
      <div class="btn-group">
        <el-button text size="small" :icon="Finished" type="success" @click="removeFinished"
          :disabled="!canClearFinished">
          移除已完成
        </el-button>
        <el-button text size="small" :icon="RemoveFilled" type="danger" @click="removeAll" :disabled="!canClearAll">
          全部移除
        </el-button>
      </div>
      <div class="btn-group">
        <el-button text :icon="CircleClose" type="warning" @click="cancelIt" :disabled="!busy">
          取消
        </el-button>
        <el-button text :icon="CaretRight" type="primary" @click="doIt" :disabled="!canProcess">
          执行
        </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import type { UploadProps, UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, SuccessFilled, Warning, Finished, CircleClose, Delete, RemoveFilled, CaretRight } from '@element-plus/icons-vue'
import { reactive, toRaw, computed } from 'vue'
import { fileProcessor } from '@r/utils/electronApi'
import { formatFileSize } from '@r/utils/formatter'

type Status = 'success' | 'fail' | ''

type FileStatus = {
  name: string,
  path: string,
  status: Status,
  percentage: number,
  size: number,
  err?: string
}

type ProcessState = {
  curIdx: number,
  curFile: FileStatus,
  cancel: boolean,
  busy: boolean
}

const fileList: FileStatus[] = reactive([])
const handleChange: UploadProps['onChange'] = (uploadFile) => addFile(uploadFile)
const processState: ProcessState = reactive({ curIdx: -1, curFile: undefined, cancel: false, busy: false })

function addFile(srcFile: UploadFile) {
  if (fileList.some(item => item.path === srcFile.raw['path'])) {
    ElMessage.closeAll()
    ElMessage.warning('文件已存在: ' + srcFile.name)
  } else {
    const newFile: FileStatus = {
      name: srcFile.name,
      path: srcFile.raw['path'],
      status: '',
      percentage: 0,
      size: srcFile.size
    }
    fileList.push(newFile)
  }
}

const sizeFormatter = (row: { size: number }) => formatFileSize(row.size)

async function doIt() {
  processState.busy = true

  const pendingFiles = fileList.filter(file => {
    if (file.status === 'success') return false
    file.status = ''
    file.percentage = 0
    return true
  })

  for (let file of pendingFiles) {
    if (processState.cancel) break
    await fileProcessor.sendFile(toRaw(file))
  }

  processState.busy = false
  processState.cancel = false
}

fileProcessor.handleProgress((_event: any, arg: FileStatus) => {
  const workingFile = fileList.find(item => item.path == arg.path)
  workingFile.percentage = arg.percentage
  workingFile.status = arg.status
  workingFile.err = arg.err
})

const removeOne = (idx: number) => fileList.splice(idx, 1)

const removeFinished = () => {
  let idx = fileList.length - 1
  while (idx >= 0) {
    const file = fileList[idx]
    if (file.status === 'success') {
      fileList.splice(idx, 1)
    }
    idx--
  }
}

const removeAll = () => {
  fileList.length = 0
  resetState()
}

const cancelIt = () => processState.cancel = true
const resetState = () => Object.assign(processState, { curIdx: -1, curFile: undefined, cancel: false, busy: false })

/**
 * computed properties
 */
const busy = computed(() => processState.busy)
const hasItems = computed(() => fileList.length > 0)
const hasFinished = computed(() => hasItems.value && fileList.some(item => item.status === 'success'))
const hasUnFinished = computed(() => hasItems.value && fileList.some(item => item.status !== 'success'))
const canClearAll = computed(() => !busy.value && hasItems.value)
const canClearFinished = computed(() => !busy.value && hasFinished.value)
const canProcess = computed(() => hasUnFinished.value)

</script>

<style scoped>
.icon-add {
  font-size: 2rem;
  margin: 0 12px;
}

.text-add {
  display: flex;
  justify-content: center;
  align-items: center;
}

.files {
  width: 100%;
  padding: 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

:deep(.el-upload-dragger) {
  padding: 16px !important;
}

:deep(.el-progress-bar .el-progress-bar__innerText) {
  color: var(--el-text-color-regular);
  font-size: 0.8rem;
}

:deep(.el-progress-bar .el-progress-bar__inner) {
  border-radius: 0;
  text-align: left;
  background-color: rgba(45, 66, 77, 0.7);
}

:deep(.el-progress-bar .el-progress-bar__outer) {
  border-radius: 0;
  background-color: rgba(47, 56, 75, 0.3);
}

:deep(.el-table .cell) {
  padding: 0;
}

.btn-group .el-button {
  padding: 6px 6px;
  margin: 0;
}

.btn-group+.btn-group {
  margin-left: 12px;
}
</style>
