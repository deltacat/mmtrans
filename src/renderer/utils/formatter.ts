export function formatFileSize(sizeInBytes: number) {
  const kb = 1024
  const mb = 1024 * kb
  const gb = 1024 * mb
  if (sizeInBytes > gb) {
    return (sizeInBytes / gb).toFixed(1) + ' G'
  }
  if (sizeInBytes > mb) {
    return (sizeInBytes / mb).toFixed(1) + ' M'
  }
  if (sizeInBytes > 1024) {
    return (sizeInBytes / kb).toFixed(1) + ' K'
  }
  return sizeInBytes
}
