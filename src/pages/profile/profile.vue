<script lang="ts" setup>
import { apiDoorUserCtrlDelMySelf } from "@/api";
import systemPush from '@/hooks/systemPush'

const visible1 = ref(false);
const userToken = ref();
userToken.value = uni.getStorageSync('token');
console.log(userToken.value)

const {setCurrent} = useStore("tabbar");

function goPage(params) {
  uni.navigateTo({url: `/pages/profilePages/${params}`});
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

const toastRef = ref();

function pushNotice() {
  // #ifdef APP
  systemPush.create("点击查看消息内容>>", {url: "/pages/forgotPassword/forgotPassword"}, {
    delay: 0,
    title: "您有1条新的消息",
  }, true);
  // #endif
  // #ifndef APP
  toastRef.value?.showToast.fail("仅APP支持此操作", {
    duration: 800,
  });
  // #endif
}

function logout() {
  setCurrent(0);
  uni.clearStorage();
  userToken.value = ''
  uni.navigateTo({url: "/pages/loginOrSignup/loginOrSignup"});
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
      <nut-cell is-link
                v-if="userToken"
                @tap="goPage('changePassword')">
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
      <nut-cell is-link @tap="pushNotice()">
        <template #title>
          <div text="#333">增加一条推送</div>
        </template>
      </nut-cell>
      <nut-cell
        v-if="userToken">
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
      <nut-button style="width: 100%"
                  v-if="userToken"
                  type="primary" @tap="logout">
        退出登录-{{ userToken }}-
      </nut-button>
      <nut-button style="width: 100%"
                  v-if="!userToken"
                  type="primary" @tap="logout">
        登录-{{ userToken }}-
      </nut-button>
    </div>
    <nut-toast ref="toastRef"/>
  </LayoutTabbar>
</template>

<style lang="scss">
page {
  background: #efefef;
}
</style>
