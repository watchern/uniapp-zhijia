<script setup>
import { apiSendCodeOld, apiRestPws } from "@/api";
import { getAppSystemInfo } from "@/hooks";
const { userInfo } = useStore("root");
const { topHeight } = getAppSystemInfo();

const state = reactive({
  account: "",
  passWord: "",
  passWord2: "",
  code: "",
  countdown: 0,
  checkbox: true,
  timer: null,
  type: true,
});

const isLoading = ref(false);

function sendVerificationCode() {
  console.log(`state.account`, state.account);
  if (state.account === "" || state.account.length !== 11) {
    uni.showToast({
      title: "请填写完整的手机号码",
      icon: "none",
    });
    return;
  }
  if (state.countdown > 0) return; // 防止重复点击
  apiSendCodeOld({ phoneNumber: state.account })
    .then((res) => {
      uni.showToast({
        title: "验证码已发送",
        icon: "success",
        duration: 800,
      });
    })
    .catch((err) => {
      console.log(`err====`, err);
    });
  state.countdown = 60;
  state.timer = setInterval(() => {
    state.countdown -= 1;
    if (state.countdown <= 0) {
      clearInterval(state.timer);
    }
  }, 1000);
}

async function SubmitModifications() {
  if (isLoading.value) {
    return;
  }
  isLoading.value = true;
  if (checkPassword()) {
    apiRestPws({
      phoneNumber: state.account,
      code: state.code,
      pws: state.passWord,
    })
      .then(() => {
        uni.showToast({
          title: "修改成功",
          icon: "none",
        });
        uni.navigateBack({ delta: 1 });
      })
      .catch((err) => {
        console.log(`err====`, err);
        isLoading.value = false;
      });

    // setTimeout(() => {
    //   // 存储token
    //   uni.setStorageSync('token', '123456');
    //   uni.navigateBack();
    //   isLoading.value = false;
    //   toastRef.value?.hideToast();
    // }, 800);
  } else {
    setTimeout(() => {
      uni.hideToast();
      isLoading.value = false;
    }, 1000);
  }
}

function checkPassword() {
  let tempText = "";

  if (state.account === "" || state.account.length !== 11)
    tempText += "请填写完整的手机号码";
  if (state.code === "")
    tempText += tempText !== "" ? ",验证码不能为空" : "验证码不能为空";
  if (state.passWord === "")
    tempText += tempText !== "" ? ",密码不能为空" : "密码不能为空";
  if (!/[A-Z]/.test(state.passWord))
    tempText += tempText !== "" ? ",密码缺少大写字母" : "密码缺少大写字母";
  if (!/[a-z]/.test(state.passWord))
    tempText += tempText !== "" ? ",密码缺少小写字母" : "密码缺少小写字母";
  if (!/[0-9]/.test(state.passWord))
    tempText += tempText !== "" ? ",密码缺少数字" : "密码缺少数字";

  if (state.passWord2 === "")
    tempText += tempText !== "" ? ",确认密码不能为空" : "确认密码不能为空";
  if (state.passWord !== state.passWord2)
    tempText +=
      tempText !== "" ? ",两次密码不同,请重新输入" : "两次密码不同,请重新输入";

  if (tempText === "") {
    return true;
  } else {
    console.log(`${tempText !== "" ? `${tempText}` : tempText}`);

    uni.showToast({
      title: `${tempText !== "" ? `${tempText}` : tempText}`,
      icon: "none",
    });

    return false;
  }
}

onMounted(() => {
  uni.hideTabBar({
    success: () => {},
    fail: () => {},
  });
});
onLoad(() => {
  state.account = userInfo.value.phonenumber;
});
</script>

<template>
  <LayoutDefault title="修改密码" :full="true" background="#fefefe">
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-10px bg="#EFEFEF"></div>
      <nut-input
        v-model="userInfo.nickName"
        placeholder="请输入手机号码"
        max-length="11"
        clearable
        readonly
      >
        <template #left> 用户姓名： </template>
      </nut-input>
      <nut-input v-model="state.code" placeholder="请输入验证码" clearable>
        <template #left> 验证码： </template>
        <template #right>
          <nut-button type="primary" size="small" @tap="sendVerificationCode">{{
            state.countdown > 0 ? `${state.countdown}秒` : "获取验证码"
          }}</nut-button>
        </template>
      </nut-input>
      <nut-input
        v-model="state.passWord"
        placeholder="设置新密码"
        type="password"
        clearable
      >
        <template #left> 新密码： </template>
        <template #right> </template>
      </nut-input>
      <nut-input
        v-model="state.passWord2"
        placeholder="确认新密码"
        type="password"
        clearable
      >
        <template #left> 确认密码： </template>
        <template #right> </template>
      </nut-input>
      <div text="12px #666" pl-10px mt-10px>
        密码需包含字母及数字组合（不能是纯数字）
      </div>
      <div pt-40px px-20px>
        <nut-button
          :loading="isLoading"
          style="width: 100%"
          type="primary"
          @tap="SubmitModifications"
        >
          提交修改
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
