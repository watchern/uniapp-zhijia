<script lang="ts" setup>
function goPage(params) {
  console.log(`params`, params);
  uni.navigateTo({ url: `/pages/settingPages/${params}` });
}
</script>

<template>
  <LayoutDefault title="需要帮助" bg="#efefef" :full="true">
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div bg="#efefef" h-1px></div>
      <nut-cell-group>
        <nut-cell is-link @tap="goPage('doorLock')">
          <template #title>
            <div text="#333">门锁使用说明</div>
          </template>
        </nut-cell>
        <nut-cell is-link @tap="goPage('notice')">
          <template #title>
            <div text="#333">注意事项及常见问题处理</div>
          </template>
        </nut-cell>
      </nut-cell-group>
    </div>
  </LayoutDefault>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #efefef;
}
</style>
