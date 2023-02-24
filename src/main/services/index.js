import { sleep } from '../utils'
import { setNcmKeys, convertNcm } from './music-trans/ncm'
import { getSettings } from './store'

export async function processFile(file, progressCallback) {
  const { outputPath, ncmCoreKey, ncmMetaKey, mock } = getSettings()
  if (mock) {
    mockProcess(file, progressCallback)
  } else {
    setNcmKeys(ncmCoreKey, ncmMetaKey)
    try {
      convertNcm(file.path, outputPath, (n, t) => {
        file.percentage = (n * 100) / t
        progressCallback(file)
      })
      file.status = 'success'
    } catch (e) {
      file.status = 'fail'
      file.err = e.message
    } finally {
      await sleep(500)
      file.percentage = 100
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
