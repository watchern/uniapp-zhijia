<script setup>
import dayjs from "dayjs";
import { apiDoorUserCtrlAddUserListZ } from "@/api";
const { lockInfo, userInfo } = useStore("root");
function goBack() {
  uni.navigateBack({
    delta: 1,
  });
}
// 添加指纹
function addFinger() {
  apiDoorUserCtrlAddUserListZ({
    lockid: lockInfo.value.id,
    userlevel: userInfo.value.userType === "02" ? 1 : 2,
    starttime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    endtime: "2199-01-01 00:00:00",
  })
    .then((res) => {
      console.log(`res===`, res);
      toastRef.value?.showToast.success("修改成功", {
        duration: 800,
      });
      uni.navigateBack({
        delta: 1,
      });
    })
    .catch((err) => {
      console.log(`err====`, err);
    });
}
</script>

<template>
  <LayoutDefault title="添加指纹" bg="#fff">
    <template #left>
      <div
        i-material-symbols-arrow-back-ios-new
        text="#000"
        @tap="goBack()"
      ></div>
    </template>
    <div h-10px bg="#EFEFEF"></div>
    <div>
      <image w="100%" h-400px src="@/static/images/openU@2x.png" />
      <div text-center text="24px #333" font-bold mt-20px>添加指纹</div>
      <div text-center text="12px #666" mt-10px>请按上述步骤完成录入指纹</div>
      <button
        mt-20px
        w="90%"
        h-40px
        bg="#14A83B"
        color="#fff"
        text="16px"
        rounded="20px"
        @tap="addFinger"
      >
        添加指纹
      </button>
    </div>
    <nut-toast ref="toastRef" />
  </LayoutDefault>
</template>

<style lang="scss">
page {
  height: 100%;
}
</style>
