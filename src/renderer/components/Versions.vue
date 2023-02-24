<script lang="ts" setup>
import { versions } from '@r/utils/electronApi'

</script>

<template>
  <ul class="versions">
    <li class="app-version">Application {{ versions.appVer }}</li>
    <li class="electron-version">Electron {{ versions.electron }}</li>
    <li class="chrome-version">Chromium {{ versions.chrome }}</li>
    <li class="node-version">Node {{ versions.node }}</li>
    <li class="v8-version">V8 {{ versions.v8 }}</li>
  </ul>
</template>

<style lang="less">
.versions {
  margin: 0 auto;
  font-family: 'Menlo', 'Lucida Console', monospace;
  color: #c2f5ff;
  line-height: 1;

  li {
    display: block;
    float: left;
    padding: 0 12px;
    border-right: 1px solid rgba(194, 245, 255, 0.4);
    font-size: 0.8rem;
    opacity: 0.8;

    &:last-child {
      border: none;
    }
  }
}
</style>
