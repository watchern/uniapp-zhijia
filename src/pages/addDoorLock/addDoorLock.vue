<template>
  <LayoutTabbar2 title="添加门锁">
    <template #left>
      <Black color="#000" />
    </template>
    <div w="100%" flex justify-center>
      <div w-240px pt-60px>
        <div text="14px #333" pb-200px>
          请添加一把门锁吧，在这里您可以管理 您的房屋，让您的生活变得更便捷、更
          智能、更安全。
        </div>
        <div flex justify-center items-center>
          <div
            i-ri-add-circle-fill
            w-130px
            h-130px
            text="#14A83B"
            @tap="add"
          ></div>
        </div>
      </div>
    </div>
  </LayoutTabbar2>
</template>

<script lang="ts" setup>
function add() {
  uni.navigateTo({ url: "/pages/scanCode/scanCode" });
}
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>
