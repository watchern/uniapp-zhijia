<script lang="ts" setup>
import { apiDoorUserCtrlDelMySelf } from "@/api";
const visible1 = ref(false);

const { setCurrent } = useStore("tabbar");
function goPage(params) {
  uni.navigateTo({ url: `/pages/profilePages/${params}` });
}
function list() {
  console.log(`222222`, 222222);
}
function onCancel() {
  console.log("取消");
  visible1.value = false;
}
function onOk() {
  console.log("确定");
  apiDoorUserCtrlDelMySelf()
    .then((res) => {
      logout();
    })
    .catch((err) => {
      console.log(`err====`, err);
    });
}

function logout() {
  setCurrent(0);
  uni.clearStorage();
  uni.redirectTo({ url: "/pages/loginOrSignup/loginOrSignup" });
}
onMounted(() => {
  uni.$on("doorLockName", function () {
    list();
  });
});
</script>

<template>
  <LayoutTabbar title="我的" :full="true">
    <div bg="#efefef" h-1px></div>
    <nut-cell-group>
      <nut-cell is-link @tap="goPage('changePassword')">
        <template #title>
          <div text="#333">修改密码</div>
        </template>
      </nut-cell>
      <nut-cell is-link @tap="goPage('privacyPolicy')">
        <template #title>
          <div text="#333">隐私政策</div>
        </template>
      </nut-cell>
      <nut-cell is-link @tap="goPage('aboutUs')">
        <template #title>
          <div text="#333">关于我们</div>
        </template>
      </nut-cell>
      <nut-cell>
        <template #title>
          <div text="#333" @tap="visible1 = true">注销账户</div>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-dialog
      v-if="visible1"
      v-model:visible="visible1"
      title="提示"
      content="账号注销后权限和所有记录将全部删除，无法恢复，请谨慎操作。"
      @cancel="onCancel"
      @ok="onOk"
    />
    <div pt-40px px-20px>
      <nut-button style="width: 100%" type="primary" @tap="logout">
        退出登录
      </nut-button>
    </div>
  </LayoutTabbar>
</template>

<style lang="scss">
page {
  background: #efefef;
}
</style>
