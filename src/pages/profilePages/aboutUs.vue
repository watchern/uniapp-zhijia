<script setup></script>

<template>
  <LayoutDefault title="关于我们" bg="#fff" :minusHeight="0" :isLine="true">
    <template #left>
      <Black color="#262727" />
    </template>
    <div>
      <div>关于我们</div>
      <div v-for="v in 100" :key="v">1111111</div>
      <div>2222222222</div>
    </div>
  </LayoutDefault>
</template>

<style lang="scss">
page {
  overflow: hidden;
  height: 100%;
}
</style>
