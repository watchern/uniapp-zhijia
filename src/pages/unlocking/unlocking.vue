<script lang="ts" setup>
function goPage() {
  uni.navigateTo({ url: "/pages/remoteLock/remoteLock" });
}
function bluetoothUnlocking() {
  uni.showToast({
    title: "暂未开发",
    icon: "none",
  });
}
</script>

<template>
  <LayoutTabbar title="开锁选择" :full="true">
    <div bg="#efefef" h-10px></div>
    <div h="100%" bg="#fff" flex flex-col justify-center>
      <div>
        <div w="100%" class="flex justify-center">
          <div
            class="lh-40px text-center h-40px"
            color="#fff"
            text="16px"
            rd="20px"
            w="90%"
            :style="{ backgroundColor: '#14A83B' }"
            @tap="bluetoothUnlocking"
          >
            <div flex justify-center items-center>
              <image
                src="@/static/images/icon_bluetooth@3x.png"
                w-20px
                h-20px
              />
              <div ml-10px>蓝牙开锁</div>
            </div>
          </div>
        </div>
      </div>
      <div text="20px #000" py-20px text-center>or</div>
      <div>
        <div w="100%" class="flex justify-center">
          <div
            class="lh-40px text-center h-40px"
            color="#fff"
            text="16px"
            rd="20px"
            w="90%"
            :style="{ backgroundColor: '#0FBFA4' }"
            @tap="goPage"
          >
            <div flex justify-center items-center>
              <image
                src="@/static/images/icon_unlockRemote@3x.png"
                w-20px
                h-20px
              />
              <div ml-10px>远程开锁</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutTabbar>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #efefef;
}
</style>
