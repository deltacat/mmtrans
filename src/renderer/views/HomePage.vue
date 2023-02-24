<script lang="ts" setup>
import Versions from '@r/components/Versions.vue'
</script>

<template>
  <el-container>
    <el-header height="200px" align="center">
      <svg height="160px" width="480px">
        <use xlink:href="@assets/icons.svg#electron" />
      </svg>
      <span class="title">媒体格式转换工具</span>
    </el-header>
    <el-main align="center">
      <span class="note">使用前请先至
        <router-link to="/settings">设置</router-link> 页面填写必要信息
      </span>
    </el-main>
    <el-footer>
      <Versions />
    </el-footer>
  </el-container>
</template>

<style>
.el-container {
  height: 100%;
}

.title {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
}

.note {
  color: var(--el-text-color-regular);
  display: block;
  font-size: 1rem;
}
</style>
