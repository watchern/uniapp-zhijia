<script setup>
import { apiAddUserListM } from "@/api";
import dayjs from 'dayjs'
const { lockInfo, userInfo } = useStore("root");
const result = ref("");
onLoad((query) => {
  result.value = query.result;
});

const formData = reactive({
  lockuserpws: "",
});

const ruleForm = ref(null);

const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      console.log(`lockInfo.value.id`, lockInfo.value.id);
      apiAddUserListM({
        lockid: lockInfo.value.id,
        userlevel: userInfo.value.userType === "02" ? 1 : 2,
        lockuserpws: formData.lockuserpws,
        starttime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        endtime: "2199-01-01 00:00:00",
      })
        .then((res) => {
          console.log(`res===`, res);
        })
        .catch((err) => {
          console.log(`err====`, err);
        });
      console.log("success", formData);
    } else console.log("error submit!!", errors);
  });
};
</script>

<template>
  <LayoutDefault title="管理员详情" :full="true" background="#fefefe">
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-1px></div>
      <nut-form ref="ruleForm" :model-value="formData">
        <nut-form-item
          label="设置密码"
          prop="lockuserpws"
          required
          :rules="[
            { required: true, message: '请填写密码' },
            {
              message: '密码需要不少于6位',
              regex: /^.{6,}$/,
            },
            {
              message: '必须输入数字',
              regex: /^\d+$/,
            },
          ]"
        >
          <nut-input
            v-model="formData.lockuserpws"
            class="nut-input-text"
            placeholder="请输入密码"
            type="password"
            :max-length="6"
          >
          </nut-input>
        </nut-form-item>
      </nut-form>
      <div text="12px #999" mt-10px pl-10px>
        <div mt-5px>*请输入6位数字密码</div>
        <div>*此密码将作为管理员开锁密码</div>
      </div>
      <div mt-40px>
        <button
          w="90%"
          h-40px
          bg="#14A83B"
          color="#fff"
          text="16px"
          rounded="20px"
          @tap="submit"
        >
          保存
        </button>
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
