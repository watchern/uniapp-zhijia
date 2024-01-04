<script setup>
import { apiLockListCtrlUpdateLockList } from "@/api";

const { lockInfo } = useStore("root");
// const name = rea("");
const state = reactive({
  name: "",
});
function save() {
  if (state.name !== "") {
    apiLockListCtrlUpdateLockList({
      id: lockInfo.value.id,
      hoseid: lockInfo.value.id,
      locktype: lockInfo.value.locktype,
      deviceid: lockInfo.value.deviceid,
      remark: state.name,
    })
      .then((res) => {
        console.log(`res===`, res);
        uni.showToast({
          title: "保存成功",
          icon: "success",
          mask: true,
        });
        uni.$emit("doorLockName", { listData: 1 });
        uni.navigateBack({
          delta: 1,
        });
      })
      .catch((err) => {
        console.log(`err====`, err);
      });
  }
}
onLoad(() => {
  state.name = lockInfo.value.remark || lockInfo.value.locktxt;
});
</script>

<template>
  <LayoutDefault title="门锁房间" :full="true" background="#fefefe">
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-10px></div>
      <nut-input v-model="state.name" clearable />
      <div h-40px></div>
      <div px-20px>
        <nut-button style="width: 100%" type="primary" @tap="save">
          保存
        </nut-button>
      </div>
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
