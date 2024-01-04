<script setup>
defineProps({
  color: {
    type: String,
    default: '#fff'
  }
});
function goBack() {
  uni.navigateBack();
}
</script>

<template>
  <div
    i-material-symbols-arrow-back-ios-new
    :style="{color: color}"
    pl-20px
    @tap="goBack()"
  ></div>
</template>

<style lang="scss" scoped></style>
