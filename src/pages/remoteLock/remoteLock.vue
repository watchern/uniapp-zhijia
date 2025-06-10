<script setup>
import { apiDoorCtrlOpenDoor } from "@/api";
import { routeBack } from "@/utils/router";
const { lockInfo } = useStore("root");
const unlockingStatus = ref(false);

function unlocking() {
  if (!unlockingStatus.value) {
    apiDoorCtrlOpenDoor({
      id: lockInfo.value.id,
    })
      .then((res) => {
        console.log(`res===`, res);
      })
      .catch((err) => {
        console.log(`err====`, err);
      });
    console.log(`远程开锁中,调接口`);
  } else {
    console.log(`开锁完成`);
  }
}
</script>

<template>
  <LayoutDefault title="远程开锁" bg="#fff">
    <template #left>
      <div
        i-material-symbols-arrow-back-ios-new
        text="#000"
        @tap="routeBack()"
      ></div>
    </template>
    <div h-10px bg="#EFEFEF"></div>
    <div>
      <image w="100%" h-400px src="@/static/images/imageUnlock@2x.png" />
      <div text-center text="24px #333" font-bold mt-20px>远程开锁</div>
      <div text-center text="12px #666" mt-10px>请按上述步骤完成远程开锁</div>
      <button
        mt-20px
        w="90%"
        h-40px
        bg="#14A83B"
        color="#fff"
        text="16px"
        rounded="20px"
        @tap="unlocking"
      >
        {{ unlockingStatus ? "开锁完成" : "远程开锁" }}
      </button>
    </div>
  </LayoutDefault>
</template>

<style lang="scss">
page {
  height: 100%;
}
</style>
