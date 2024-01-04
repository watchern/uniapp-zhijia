<script setup lang="ts">
// import { useHasToken } from "@/hooks";
onMounted(() => {
  // useHasToken();
  uni.hideTabBar({
    success: () => {},
    fail: () => {
      // 捕获报错，防止没有tabbar页面调用后控制台报错
    },
  });
});
</script>

<style lang="scss">
@import "nutui-uniapp/styles/index";
</style>
