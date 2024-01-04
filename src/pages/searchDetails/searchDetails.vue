<script lang="ts" setup>
import { getAppSystemInfo } from "@/hooks";
import dayjs from "dayjs";
const { userInfo } = useStore("root");
const { topHeight, windowHeight, safeAreaBottom } = getAppSystemInfo();
const props = defineProps({
  background: {
    type: String,
    default: "#fff",
  },
  full: {
    type: Boolean,
    default: false,
  },
  isLine: {
    type: Boolean,
    default: false,
  },
});
const pageHeight = ref(0);
const calendarRef = ref<any>(null);
const state = reactive<any>({
  date: [],
  endDate: dayjs(dayjs().format("YYYY-MM-DD"))
    .add(1, "month")
    .format("YYYY-MM-DD"),
  startDate: dayjs(dayjs().format("YYYY-MM-DD"))
    .subtract(1, "month")
    .format("YYYY-MM-DD"),
  isVisible: false,
});
const openSwitch = (param) => {
  state[`${param}`] = true;
  nextTick(() => {
    // console.log(
    //   `dayjs().subtract(7, 'day').format('YYYY-MM-DD')`,
    //   dayjs().subtract(14, 'day').format('YYYY-MM-DD')
    // );
    calendarRef.value.scrollToDate(dayjs().format("YYYY-MM-DD"));
  });
};
const closeSwitch = (param) => {
  state[`${param}`] = false;
};
const setChooseValue = (param) => {
  state.date = [...[param[0][3], param[1][3]]];
  console.log(`state.date`, state.date);
};

const disabledDate = (date) => {
  const start = dayjs().format("YYYY-MM-DD");
  const end = dayjs().add(2, "month").format("YYYY-MM-DD");
  const currentDate = dayjs(date);
  return currentDate.isAfter(start) && currentDate.isBefore(end);
};

const startTime = computed(() => {
  return state.date.length > 0 ? state.date[0] : "开始时间";
});
const endTime = computed(() => {
  return state.date.length > 1 ? state.date[1] : "结束时间";
});
onMounted(() => {
  state.startDate = dayjs(userInfo.value.createTime).format("YYYY-MM-DD");
  const minusHeight = props.isLine ? -10 : 0;
  setTimeout(() => {
    pageHeight.value =
      windowHeight.value -
      topHeight.value -
      safeAreaBottom.value -
      48 +
      minusHeight;
    // console.log(`windowHeight.value`, windowHeight.value);
    // console.log(`topHeight.value`, topHeight.value);
    // console.log(`pageHeight.value`, pageHeight.value);
  }, 0);
});
</script>

<template>
  <div
    h="100%"
    style="overflow: hidden"
    :style="{
      paddingTop: `${topHeight}px`,
      background,
    }"
  >
    <div class="global-navbar">
      <div class="slot-wrapper left">
        <Black color="#000" />
      </div>
      <div class="title">开锁记录</div>
      <div class="slot-wrapper right">
        <slot name="right"></slot>
      </div>
    </div>
    <div>
      <div bg="#efefef" h-10px></div>
      <header>
        <div
          my-10px
          bg="#fff"
          h-50px
          p-10px
          box-border
          @tap="openSwitch('isVisible')"
        >
          <div
            h-30px
            lh-30px
            flex
            justify-around
            items-center
            bg="#14A83C"
            text="#fff 14px"
            font-600
            rounded-15px
          >
            <div>{{ startTime }}</div>
            <div>-</div>
            <div>{{ endTime }}</div>
          </div>
        </div>
        <nut-calendar
          v-if="state.isVisible"
          ref="calendarRef"
          v-model:visible="state.isVisible"
          :default-value="state.date"
          type="range"
          :start-date="state.startDate"
          :end-date="state.endDate"
          :is-auto-back-fill="true"
          :disabled-date="disabledDate"
          @close="closeSwitch('isVisible')"
          @choose="setChooseValue"
        >
        </nut-calendar>
      </header>
      <scroll-view scroll-y :style="{ height: `${pageHeight}px` }" bg="#efefef">
        <main v-if="state.date.length > 0" bg="#efefef">
          <div py-10px pl-10px text="16px #333">{{ state.date[0] }}</div>
          <UnlockRecordItem />
          <UnlockRecordItem />
        </main>
      </scroll-view>
    </div>
  </div>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.global-navbar {
  font-size: 18px;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  // padding-bottom: 10px;
  // padding-left: 15px;
  // padding-right: 15px;
  height: 48px;

  .slot-wrapper {
    flex: 1;
    text-align: center;
  }

  .title {
    flex: 0 0 auto; /* 不允许title伸缩 */
    font-size: 18px;
    font-weight: 600;
  }

  .left {
    display: flex;
    justify-content: flex-start;
  }

  .right {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
