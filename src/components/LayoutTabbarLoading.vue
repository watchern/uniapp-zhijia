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
      48 -
      70 -
      20 +
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
    }"
    class="testPage"
  >
    <div class="testMain">
      <div class="global-navbar">
        <div class="slot-wrapper left">
          <slot name="left"></slot>
        </div>
        <div class="title">{{ title }}</div>
        <div class="slot-wrapper right">
          <slot name="right"></slot>
        </div>
      </div>
      <div :style="{ height: `${pageHeight + 40}px` }">
        <nut-loading-page :loading="true" />
        <footer>
          <TabBar />
        </footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
.testPage {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: relative;

  .testImg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
  .testMain {
    position: absolute;
    z-index: 1;
    width: 100%;
    .global-navbar {
      font-size: 18px;
      color: #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
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
  }
}
</style>
