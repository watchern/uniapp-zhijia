<script setup>
import { apiGetLockTypes, apiAddLockList } from "@/api";
import { routeBack } from "@/utils/router";
const result = ref("");
onLoad((query) => {
  console.log(`query.result`, isJSON(query.result));
  if (query.result === "") {
    return;
  }
  console.log(`222222`, 222222);
  if (isJSON(query.result)) {
    console.log(`query.result`, query.result);
    const deviceid = JSON.parse(query.result).deviceid;
    if (deviceid) {
      console.log(`deviceid`, deviceid);
      uni.showToast({
        title: "识别成功，请绑定门锁",
        icon: "none",
      });
    } else {
      uni.showToast({
        title: "识别错误，请将相机靠近锁上二维码重试或手动绑定门锁。",
        icon: "none",
      });
    }
    result.value = deviceid;
    console.log(`result.value`, result.value);
  } else {
    uni.showToast({
      title: "识别错误，请将相机靠近锁上二维码重试或手动绑定门锁。",
      icon: "none",
    });
  }
});
function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
function getLockTypes() {
  apiGetLockTypes()
    .then((res) => {})
    .catch((err) => {
      console.log(`err====`, err);
    });
}
function bindingDoorLock() {
  if (result.value) {
    apiAddLockList({
      hoseid: Math.random().toString(36).substr(2, 8),
      locktype: 1,
      deviceid: result.value,
    })
      .then((res) => {
        uni.showToast({
          title: "绑定成功",
          icon: "success",
          mask: true,
        });
        uni.$emit("addDoorLockSuccess");
        routeBack(3)
      })
      .catch((err) => {
        console.log(`err====`, err);
      });
  } else {
    uni.showToast({
      title: "请输入门锁ID",
      icon: "none",
      mask: true,
    });
  }
}

onMounted(() => {
  getLockTypes();
});
</script>

<template>
  <LayoutDefault title="绑定门锁" :full="true" background="#fefefe">
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-10px></div>
      <nut-input v-model="result" placeholder="请输入">
        <template #left> 门锁ID： </template>
      </nut-input>
      <view px-20px mt-40px>
        <nut-button
          style="width: 100%"
          type="primary"
          @tap="bindingDoorLock"
        >
          绑定门锁
        </nut-button>
      </view>
    </div>
  </LayoutDefault>
</template>

<style lang="scss">
page {
  overflow: hidden;
  height: 100%;
  background: #fefefe;
}
</style>
