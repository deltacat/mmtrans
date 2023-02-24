/**
 * NCM 文件解析
 * 方法参考：
 * - https://github.com/jiangyalin/ncm-or-kgma-to-flac
 * - https://github.com/xiechanglei/simple-ncm
 */
import fs from 'fs'
import path from 'path'
import CryptoJS from 'crypto-js'
import NodeID3 from 'node-id3'

let CORE_KEY = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
let META_KEY = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
const startOffset = 10

/**
 * 设置秘钥。调用转码函数前需先进行秘钥设置。
 *
 * @param {string} core 核心秘钥
 * @param {string} meta meta秘钥
 */
export function setNcmKeys(core, meta) {
  CORE_KEY = CryptoJS.enc.Hex.parse(core)
  META_KEY = CryptoJS.enc.Hex.parse(meta)
}

/**
 *
 * @param {string} srcFile 原文件完整路径
 * @param {string} targetFolder 转码后文件存放目录
 */
export function convertNcm(srcFile, targetFolder, progressCbk) {
  const fileBuf = fs.readFileSync(srcFile)
  progressCbk(1, 5)

  const [keyData, keyEnd] = parseKeyData(fileBuf)
  const [metadata, metaEnd] = parseMetaData(fileBuf, keyEnd)
  const [imageBuffer, coverEnd] = parseImageData(fileBuf, metaEnd + 9)
  const musicBuffer = parseMusicData(fileBuf, coverEnd, keyData)
  progressCbk(2, 5)

  const id3options = {
    title: metadata.musicName,
    album: metadata.album,
    albumPic: metadata.albumPic,
    artist: metadata.artist.map((item) => item[0]).join(','),
    TALB: metadata.album,
    TIT2: metadata.musicName,
    image: {
      mime: 'image/jpeg',
      type: { id: 3 },
      imageBuffer: imageBuffer
    }
  }

  const newFileExt = '.' + metadata.format
  const baseName = path.basename(srcFile).replace(/\.ncm$/, newFileExt)
  const newFileName = path.join(targetFolder, baseName)

  fs.writeFileSync(newFileName, musicBuffer)
  progressCbk(3, 5)

  NodeID3.write(id3options, newFileName)
  progressCbk(4, 5)
}

/**
 * 从 ncm 文件抽取 key 信息
 */
function parseKeyData(fileBuf) {
  let [keyData, offset] = parseData(fileBuf, startOffset, 0x64)

  const plainText = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.lib.WordArray.create(new Uint8Array(keyData)) },
    CORE_KEY,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
  )
  const result = new Uint8Array(plainText.sigBytes)
  const words = plainText.words
  const sigBytes = plainText.sigBytes
  for (let i = 0; i < sigBytes; i++) {
    result[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
  }

  return [result.slice(17), offset]
}

/**
 * 从 ncm 文件抽取 metadata 信息
 */
function parseMetaData(fileBuf, offset) {
  const [metaData, metaOffset] = parseData(fileBuf, offset, 0x63)
  if (metaData.length === 0) return [{}, metaOffset]

  const cipherText = new Uint8Array(metaData)
  const plainText = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(
        CryptoJS.lib.WordArray.create(cipherText.slice(22)).toString(CryptoJS.enc.Utf8)
      )
    },
    META_KEY,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
  ).toString(CryptoJS.enc.Utf8)
  const labelIndex = plainText.indexOf(':')
  let result = JSON.parse(plainText.slice(labelIndex + 1))
  if (plainText.slice(0, labelIndex) === 'dj') {
    result = result.mainMusic
  }
  if (result.albumPic) result.albumPic = result.albumPic.replace('http://', 'https://')
  return [result, metaOffset]
}

/**
 * 从 ncm 文件抽出音乐封面信息
 */
function parseImageData(file, offset) {
  return parseData(file, offset)
}

/**
 * 从 ncm 文件抽出音乐数据
 */
function parseMusicData(file, offset, key) {
  const box = buildKeyBox(key)
  let n = 0x8000
  let fmusic = []
  while (n > 1) {
    const buffer = Buffer.alloc(n)
    n = file.copy(buffer, 0, offset, offset + n)
    offset += n

    for (let i = 0; i < n; i++) {
      let j = (i + 1) & 0xff
      buffer[i] ^= box[(box[j] + box[(box[j] + j) & 0xff]) & 0xff]
    }

    fmusic.push(buffer)
  }
  return Buffer.concat(fmusic)
}

function parseData(file, offset, key) {
  const length = file.readUInt32LE(offset)
  const rawData = Buffer.alloc(length)
  const start = offset + 4
  const end = start + length
  file.copy(rawData, 0, start, end)
  const data = key ? rawData.map((i) => i ^ key) : rawData
  return [data, end]
}

function buildKeyBox(key) {
  const keyLength = key.length
  const box = Buffer.alloc(256)
  for (let i = 0; i < 256; i++) {
    box[i] = i
  }
  let swap = 0,
    c = 0,
    lastByte = 0,
    keyOffset = 0
  for (let i = 0; i < 256; ++i) {
    swap = box[i]
    c = (swap + lastByte + key[keyOffset++]) & 0xff
    if (keyOffset >= keyLength) {
      keyOffset = 0
    }
    box[i] = box[c]
    box[c] = swap
    lastByte = c
  }
  return box
}
