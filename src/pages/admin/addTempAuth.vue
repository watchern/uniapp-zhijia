<script setup>
import dayjs from "dayjs";
// #ifdef APP-PLUS
import { nativeContact } from "@/utils/nativeContact";
// #endif
import { isWx, isApp } from "@/hooks";
import { routeBack } from "@/utils/router";
const { lockInfo } = useStore("root");
const result = ref("");
onLoad((query) => {
  result.value = query.result;
});
const formData = reactive({
  name: "",
  phoneNumber: "",
  startTime: null,
  endTime: null,
});

const ruleForm = ref(null);
const showStart = ref(false);
const showEnd = ref(false);

const currentDate = ref("");
const currentDate2 = ref("");
const minDate1 = ref(dayjs().$d);
const maxDate1 = ref(dayjs().$d);
const minDate2 = ref(dayjs().$d);
const maxDate2 = ref(dayjs().$d);

const formatter = (type, option) => {
  switch (type) {
    case "year":
      option.text += "";
      break;
    case "month":
      option.text += "月";
      break;
    case "day":
      option.text += "日";
      break;
    case "hour":
      option.text += "时";
      break;
    // case "minute":
    //   option.text += "分";
    //   break;
    default:
      option.text += "";
  }
  return option;
};

const confirm = ({ selectedValue }) => {
  console.log(`selectedValue`, selectedValue);
  const date = selectedValue.slice(0, 3).join("-");
  const time = selectedValue.slice(3).join(":");
  formData.startTime = `${date} ${time}`;
  showStart.value = false;
};
function confirm2({ selectedValue }) {
  console.log(`selectedValue`, selectedValue);
  const date = selectedValue.slice(0, 3).join("-");
  const time = selectedValue.slice(3).join(":");
  formData.endTime = `${date} ${time}`;
  showEnd.value = false;
}
function open() {
  console.log(`dayjs()`, dayjs().$d);
  console.log(`new Date(2020, 0, 1)`, new Date(2020, 0, 1));
  minDate1.value = dayjs().$d;
  maxDate1.value = dayjs().add(1, "year").$d;

  showStart.value = true;
}
function open2() {
  if (!formData.startTime) {
    uni.showToast({
      title: "请先选择起始时间",
      icon: "none",
    });
    return;
  }
  console.log(`dayjs()`, dayjs().$d);
  console.log(`new Date(2020, 0, 1)`, new Date(2020, 0, 1));
  minDate2.value = dayjs(currentDate.value).add(1, "hour").$d;
  // dayjs() 加一年
  maxDate2.value = dayjs(currentDate.value).add(1, "year").$d;

  showEnd.value = true;
}
function openAddressBook() {
  // uni.showToast({
  //   title: '加载中',
  //   icon: 'loading'
  // });
  // #ifdef MP-WEIXIN
  wx.chooseContact({
    success: (res) => {
      console.log(res);
      formData.name = res.displayName;
      formData.phoneNumber = res.phoneNumber;
    },
    fail: (error) => {
      console.log(error);
    },
  });
  // #endif
  // #ifdef APP-PLUS
  nativeContact.contacts.getContact((name, phoneNumber) => {
    // uni.hideToast();
    if (name === "No contact selected") {
      // 处理未选择联系人的错误逻辑
      console.log("No contact selected");
    } else {
      console.log("name", name, phoneNumber);
      formData.name = name;
      formData.phoneNumber = phoneNumber.replace(/\s/g, "");
    }
  });
  // #endif
}
const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      console.log("success", formData);
      apiLsUserCtrlAddUser({
        lockId: lockInfo.value.id,
        phoneNumber: formData.phoneNumber,
        startTime: formData.startTime,
        endTime: formData.endTime,
      })
        .then((res) => {
          console.log(`res===`, res);
          uni.showToast({
            title: "添加成功",
            icon: "success",
          });
          uni.$emit("updateMemberList", { listData: 1 });
          routeBack()
        })
        .catch((err) => {
          console.log(`err====`, err);
        });
    } else console.log("error submit!!", errors);
  });
};

onMounted(() => {});
</script>

<template>
  <LayoutDefault
    class="addTempAuth"
    title="添加临时授权"
    :full="true"
    background="#fefefe"
  >
    <template #left>
      <Black color="#262727" />
    </template>
    <div bg="#EFEFEF" h="100vh">
      <div h-1px></div>
      <div mt-10px>
        <div pl-10px>填写详细信息</div>
        <nut-form
          class="nutForm"
          ref="ruleForm"
          :model-value="formData"
          :rules="{
            name: [{ required: true, message: '请填写姓名' }],
          }"
          style="color: #000"
        >
          <nut-form-item
            label="手机号码"
            prop="phoneNumber"
            required
            :rules="[
              { required: true, message: '请填写联系电话' },
              {
                regex: /^\d+$/,
                message: '必须输入数字',
              },
              {
                regex: /^(?:(?:\+|00)86)?1\d{10}$/,
                message: '请输入正确的手机号',
              },
            ]"
          >
            <nut-input
              v-model="formData.phoneNumber"
              class="nut-input-text"
              placeholder="请输入11位手机号码"
              type="text"
              max-length="11"
            >
              <template #right v-if="isWx()">
                <div flex>
                  <div text="#E2E2E2">|</div>
                  <div text="#14a83b" pl-10px @tap="openAddressBook">
                    通讯录
                  </div>
                </div>
              </template>
              <template #right v-if="isApp()">
                <div text="#E2E2E2">|</div>
                <div text="#14a83b" pl-10px @tap="openAddressBook">通讯录</div>
              </template>
            </nut-input>
          </nut-form-item>
          <nut-form-item
            label="起始时间"
            prop="startTime"
            required
            :rules="[{ required: true, message: '起始时间' }]"
          >
            <div flex justify-between items-center @tap="open()">
              <div text="#333">{{ formData.startTime }}</div>
              <nut-icon name="rect-right" custom-color="#ccc"></nut-icon>
            </div>
          </nut-form-item>
          <nut-form-item
            label="失效时间"
            prop="endTime"
            required
            :rules="[{ required: true, message: '失效时间' }]"
          >
            <div flex justify-between items-center @tap="open2()">
              <div text="#333">{{ formData.endTime }}</div>
              <nut-icon name="rect-right" custom-color="#ccc"></nut-icon>
            </div>
          </nut-form-item>
        </nut-form>
        <button
          mt-100px
          w="90%"
          h-40px
          bg="#14A83B"
          color="#fff"
          text="16px"
          rounded="20px"
          @tap="submit"
        >
          发送
        </button>
      </div>
      <nut-popup v-model:visible="showStart" position="bottom" v-if="showStart">
        <nut-date-picker
          v-model="currentDate"
          title="起始时间"
          type="datehour"
          :min-date="minDate1"
          :max-date="maxDate1"
          :formatter="formatter"
          @confirm="confirm"
        ></nut-date-picker>
      </nut-popup>
      <nut-popup v-model:visible="showEnd" position="bottom" v-if="showEnd">
        <nut-date-picker
          v-model="currentDate2"
          title="失效时间"
          type="datehour"
          :min-date="minDate2"
          :max-date="maxDate2"
          :formatter="formatter"
          @confirm="confirm2"
        ></nut-date-picker>
      </nut-popup>
    </div>
  </LayoutDefault>
</template>

<style lang="scss">
page {
  overflow: hidden;
  height: 100%;
  background: #fefefe;

  .input-text {
    color: #000 !important;
  }
  .nut-input--border {
    border-bottom: none !important;
  }
}
// .addTempAuth {
//   .input-text {
//     color: #000 !important;
//   }
//   >>> input {
//     color: #000 !important;
//   }
//   >>> .uni-input-input {
//     color: #000 !important;
//   }
//   >>> .nutForm {
//     >>> .nut-cell__value {
//       color: #000 !important;
//     }
//     >>> .nut-form-item__body {
//       color: #000 !important;
//     }
//   }
// }
</style>
