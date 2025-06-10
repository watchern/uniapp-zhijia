<script setup>

import { routeBack } from "@/utils/router";

defineProps({
  color: {
    type: String,
    default: '#fff'
  }
});

</script>

<template>
  <div
    i-material-symbols-arrow-back-ios-new
    :style="{color: color}"
    pl-20px
    @tap="routeBack()"
  ></div>
</template>

<style lang="scss" scoped></style>
