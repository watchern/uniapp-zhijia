<script lang="ts" setup>
import { getAppSystemInfo } from "@/hooks";
const { topHeight, windowHeight, safeAreaBottom } = getAppSystemInfo();
const props = defineProps({
  title: String,
  background: {
    type: String,
    default: "#fff",
  },
  full: {
    type: Boolean,
    default: false,
  },
  isLine: {
    type: Boolean,
    default: false,
  },
});
const pageHeight = ref(0);
onMounted(() => {
  const minusHeight = props.isLine ? -10 : 0;
  setTimeout(() => {
    pageHeight.value =
      windowHeight.value -
      topHeight.value -
      safeAreaBottom.value -
      48 +
      minusHeight;
    // console.log(`windowHeight.value`, windowHeight.value);
    // console.log(`topHeight.value`, topHeight.value);
    // console.log(`pageHeight.value`, pageHeight.value);
  }, 0);
});
</script>

<template>
  <div
    h="100%"
    style="overflow: hidden"
    :style="{
      paddingTop: `${topHeight}px`,
      background,
    }"
  >
    <div class="global-navbar">
      <div class="slot-wrapper left">
        <slot name="left"></slot>
      </div>
      <div class="title">{{ title }}</div>
      <div class="slot-wrapper right">
        <slot name="right"></slot>
      </div>
    </div>
    <div v-if="!full">
      <div bg="#efefef" h-10px v-if="isLine"></div>
      <scroll-view scroll-y :style="{ height: `${pageHeight}px` }">
        <slot />
      </scroll-view>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.global-navbar {
  font-size: 18px;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  // padding-bottom: 10px;
  // padding-left: 15px;
  // padding-right: 15px;
  height: 48px;

  .slot-wrapper {
    flex: 1;
    text-align: center;
  }

  .title {
    flex: 0 0 auto; /* 不允许title伸缩 */
    font-size: 18px;
    font-weight: 600;
  }

  .left {
    display: flex;
    justify-content: flex-start;
  }

  .right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
