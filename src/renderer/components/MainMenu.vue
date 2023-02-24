<script lang="ts" setup>
import { House, Setting } from '@element-plus/icons-vue'
</script>

<template>
  <el-menu active-text-color="#ffd04b" class="main-menu" text-color="#fff" default-active="/" :router="true">
    <el-menu-item index="/">
      <el-icon>
        <house />
      </el-icon>
      <span>主页</span>
    </el-menu-item>
    <el-menu-item index="/files">
      <el-icon>
        <i-mdi-folder-music-outline />
      </el-icon>
      <span>音乐</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon>
        <setting />
      </el-icon>
      <span>设置</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less">
@import '@assets/css/styles.less';

.main-menu {
  border-right: 0 !important;
}
</style>
