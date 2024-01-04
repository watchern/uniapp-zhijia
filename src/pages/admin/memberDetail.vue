<script setup>
import { apiGetInfo, apiDoorUserCtrlUpdateUser } from "@/api";
const { userInfo, setUserInfo } = useStore("root");
const formData = reactive({
  nickName: "",
  phoneNumber: "",
});

onLoad((query) => {
  formData.nickName = query.nickName;
  formData.phoneNumber = query.phoneNumber;
});
function list() {
  console.log(`1111111111`, 1111111111);
}
function goPage1() {
  uni.navigateTo({ url: "/pages/admin/setLockPassword" });
}
function goPage2() {
  uni.navigateTo({ url: "/pages/admin/addFinger" });
}
const deleteMember = () => {};
onMounted(() => {
  uni.$on("add", function () {
    list();
  });
});
</script>

<template>
  <LayoutDefault title="成员详情" :full="true" background="#fefefe">
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-10px></div>
      <div>
        <nut-input
          v-model="formData.nickName"
          class="nut-input-text"
          placeholder="请输入姓名"
          readonly
          type="text"
        />

        <nut-input
          v-model="formData.phoneNumber"
          class="nut-input-text"
          placeholder="请输入11位手机号码"
          type="text"
          readonly
        >
        </nut-input>
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
          <button
            mt-100px
            w="90%"
            h-40px
            bg="#14A83B"
            color="#fff"
            text="16px"
            rounded="20px"
            @tap="deleteMember"
          >
            删除成员
          </button>
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
