<script setup lang="ts">

// import { useHasToken } from "@/hooks";
import systemPush from '@/hooks/systemPush'

onMounted(() => {
  // useHasToken();
  uni.hideTabBar({
    success: () => {
    },
    fail: () => {
      // 捕获报错，防止没有tabbar页面调用后控制台报错
    },
  });
});

onLaunch(() => {
  // #ifdef APP
  systemPush.init();
  // #endif
})
</script>

<style lang="scss">
@import "nutui-uniapp/styles/index";
</style>
