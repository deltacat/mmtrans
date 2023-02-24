<script lang="ts" setup>
import MainMenu from './MainMenu.vue'
</script>

<template>
  <div style="height: 100vh;">
    <el-container>
      <el-aside width="150px" style="background-color: #545c64">
        <MainMenu />
      </el-aside>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>

  </div>
</template>
