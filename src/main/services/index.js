import { sleep } from '../utils'
import { setNcmKeys, convertNcm } from './music-trans/ncm'
import { getSettings } from './store'

export async function processFile(file, progressCallback) {
  const { outputPath, ncmCoreKey, ncmMetaKey, mock } = getSettings()

  if (!(outputPath && ncmCoreKey && ncmMetaKey)) {
    file.status = 'fail'
    file.err = '未配置必须参数，请检查设置！'
    progressCallback(file)
    return
  }

  if (mock) {
    mockProcess(file, progressCallback)
  } else {
    try {
      setNcmKeys(ncmCoreKey, ncmMetaKey)
      convertNcm(file.path, outputPath, (n, t) => {
        file.percentage = (n * 100) / t
        progressCallback(file)
      })
      file.percentage = 100
      file.status = 'success'
    } catch (e) {
      file.status = 'fail'
      file.err = e.message
    } finally {
      await sleep(500)
      progressCallback(file)
    }
  }
}

async function mockProcess(file, progress) {
  for (let i = 1; i <= 100; i += 1) {
    file.percentage = i
    if (i === 100) {
      file.status = 'success'
    }
    progress(file)
    await sleep(25)
  }
}

export default {}
