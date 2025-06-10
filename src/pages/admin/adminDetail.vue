<script setup>
import { apiGetInfo, apiDoorUserCtrlUpdateUser } from "@/api";
import { routeBack } from "@/utils/router";
const { userInfo, setUserInfo } = useStore("root");
const result = ref("");

const formData = reactive({
  nickName: "",
  phoneNumber: "",
});

onLoad((query) => {
  result.value = query.result;
  console.log(`query`, query);
  formData.nickName = query.nickName;
  formData.phoneNumber = query.phoneNumber;
});

const ruleForm = ref(null);
function list() {
  console.log(`1111111111`, 1111111111);
}
function goPage1() {
  uni.navigateTo({ url: "/pages/admin/setLockPassword" });
}
function goPage2() {
  uni.navigateTo({ url: "/pages/admin/addFinger" });
}
const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      apiDoorUserCtrlUpdateUser({
        userId: userInfo.value.userId,
        nickName: formData.nickName,
      })
        .then((res) => {
          console.log(`res===`, res);
          apiGetInfo()
            .then((res) => {
              setUserInfo({
                ...res.user,
                permissions: res.permissions,
                roles: res.roles,
              });
              uni.showToast({
                title: "保存成功",
                icon: "success",
              });
              routeBack()
            })
            .catch((err) => {
              console.log(`err====`, err);
            });
        })
        .catch((err) => {
          console.log(`err====`, err);
        });
    } else console.log("error submit!!", errors);
  });
};
onMounted(() => {
  uni.$on("add", function () {
    list();
  });
});
</script>

<template>
  <LayoutDefault title="管理员详情" :full="true" background="#fefefe">
    <template #left>
      <Black color="#262727" />
    </template>
    <template #right>
      <div text="#14a83b 14px" pr-20px @tap="submit">保存</div>
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-1px></div>
      <div>
        <nut-form
          ref="ruleForm"
          :model-value="formData"
          :rules="{
            nickName: [{ required: true, message: '请填写姓名' }],
          }"
        >
          <nut-form-item label="管理员姓名" prop="nickName">
            <nut-input
              v-model="formData.nickName"
              class="nut-input-text"
              placeholder="请输入姓名"
              type="text"
            />
          </nut-form-item>

          <nut-input
            v-model="formData.phoneNumber"
            class="nut-input-text"
            placeholder="请输入11位手机号码"
            type="text"
            readonly
          >
          </nut-input>
        </nut-form>
        <div mt-10px>
          <div text="14px" pl-10px font-bold>密码设置</div>
          <nut-cell-group>
            <nut-cell round-radius="0" @tap="goPage1()">
              <div text="#14a83b">设置开锁密码</div>
            </nut-cell>
            <nut-cell round-radius="0" @tap="goPage2()">
              <div text="#14a83b">添加指纹</div>
            </nut-cell>
            <nut-swipe>
              <nut-cell round-radius="0" title="指纹一" />
              <template #right>
                <nut-button shape="square" style="height: 100%" type="danger">
                  删除
                </nut-button>
              </template>
            </nut-swipe>
            <nut-swipe>
              <nut-cell round-radius="0" title="指纹二" />
              <template #right>
                <nut-button shape="square" style="height: 100%" type="danger">
                  删除
                </nut-button>
              </template>
            </nut-swipe>
          </nut-cell-group>
        </div>
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
