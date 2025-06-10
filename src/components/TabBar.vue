<script setup>
defineProps({
  // 字体颜色
  color: {
    type: String,
    default: "#999",
  },
  // 字体选中颜色
  selectedColor: {
    type: String,
    default: "#14A83B",
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    default: "#FFFFFF",
  },
  // 是否需要中间凸起按钮
  hump: {
    type: Boolean,
    default: true,
  },
  // 固定在底部
  isFixed: {
    type: Boolean,
    default: true,
  },
  // 角标字体颜色
  badgeColor: {
    type: String,
    default: "#fff",
  },
  // 角标背景颜色
  badgeBgColor: {
    type: String,
    default: "#F74D54",
  },
  unlined: {
    type: Boolean,
    default: false,
  },
});

const { current, tabBar, tabbarSwitch, setCurrent } = useStore("tabbar");
onMounted(() => {
  const pages = getCurrentPages(); // 获取栈实例
  const currentRoute = `/${pages[pages.length - 1].route}`; // 获取当前页面路由
  const index = tabBar.value.findIndex(
    (item) => item.pagePath === currentRoute
  );
  const temp = tabBar.value.find((item) => item.pagePath === currentRoute);
  setCurrent(index);
});
</script>

<template>
  <div
    class="tui-tabbar"
    :class="{ 'tui-tabbar-fixed': isFixed, 'tui-unlined': unlined }"
    :style="{ background: backgroundColor }"
  >
    <block v-for="(item, index) in tabBar" :key="index">
      <div
        class="tui-tabbar-item"
        :class="{ 'tui-item-hump': item.hump }"
        :style="{ backgroundColor: item.hump ? backgroundColor : 'none' }"
        @tap="tabbarSwitch(index, item.hump, item.pagePath, item.verify)"
      >
        <div class="tui-icon-box" :class="{ 'tui-tabbar-hump': item.hump }">
          <div v-if="index === 0">
            <image
              v-if="current === 0"
              src="@/static/images/icon_smartLockActive@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
            <image
              v-else
              src="@/static/images/icon_smartLockNormal@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
          </div>
          <div v-if="index === 1">
            <image
              v-if="current === 1"
              src="@/static/images/icon_manageActive@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
            <image
              v-else
              src="@/static/images/icon_manageNormal@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
          </div>
          <div v-if="index === 2">
            <image
              v-if="current === 2"
              src="@/static/images/icon_unlock@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
            <image
              v-else
              src="@/static/images/icon_unlock@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
          </div>
          <div v-if="index === 3">
            <image
              v-if="current === 3"
              src="@/static/images/icon_settingActive@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
            <image
              v-else
              src="@/static/images/icon_settingNormal@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
          </div>
          <div v-if="index === 4">
            <image
              v-if="current === 4"
              src="@/static/images/icon_mineActive@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
            <image
              v-else
              src="@/static/images/icon_mineNormal@2x.png"
              :class="[item.hump ? '' : 'tui-tabbar-icon']"
            ></image>
          </div>
          <!-- <image
            v-else
            :src="current === index ? item.selectedIconPath : item.iconPath"
            :class="[item.hump ? '' : 'tui-tabbar-icon']"
          ></image> -->
        </div>
        <div
          v-if="index !== 2"
          class="tui-text-scale"
          :class="{ 'tui-text-hump': item.hump }"
          :style="{ color: current === index ? selectedColor : color }"
        >
          {{ item.text }}
        </div>
      </div>
    </block>
    <div v-if="hump && !unlined" :class="{ 'tui-hump-box': hump }"></div>
  </div>
</template>

<style lang="scss">
.tui-tabbar {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  -webkit-overflow-scroll: touch;
}

.tui-tabbar-fixed {
  position: fixed;
  z-index: 99999;
  left: 0;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.tui-tabbar::before {
  content: "";
  width: 100%;
  border-top: 1rpx solid #b2b2b2;
  position: absolute;
  top: 0;
  left: 0;
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}

.tui-tabbar-item {
  height: 100%;
  flex: 1;
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 10rpx 0;
  box-sizing: border-box;
}

.tui-icon-box {
  position: relative;
}

.tui-item-hump {
  height: 98rpx;
  z-index: 2;
}

.tui-tabbar-icon {
  width: 52rpx;
  height: 52rpx;
  display: block;
}

.tui-hump-box {
  width: 120rpx;
  height: 120rpx;
  background: #ffffff;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -10px;
  border-radius: 50%;
  z-index: 1;
}

.tui-hump-box::before {
  content: "";
  height: 200%;
  width: 200%;
  // border: 1rpx solid #b2b2b2;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(0.5) translateZ(0);
  transform-origin: 0 0;
  border-radius: 100%;
}

.tui-unlined::before {
  border: 0 !important;
}

.tui-tabbar-hump {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  top: -20px;
  transition: all 0.2s linear;
}

.tui-tabbar-hump image {
  width: 100rpx;
  height: 100rpx;
  display: block;
}

.tui-hump-active {
  transform: translateX(-50%) rotate(135deg);
}

.tui-text-hump {
  position: absolute;
  bottom: 10rpx;
}

.tui-text-scale {
  font-weight: bold;
  transform: scale(0.8);
  font-size: 25rpx;
  line-height: 28rpx;
  transform-origin: center 100%;
}

.tui-badge {
  position: absolute;
  font-size: 24rpx;
  height: 32rpx;
  min-width: 20rpx;
  padding: 0 6rpx;
  border-radius: 40rpx;
  right: 0;
  top: -5rpx;
  transform: translateX(70%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tui-badge-dot {
  position: absolute;
  height: 16rpx;
  width: 16rpx;
  border-radius: 50%;
  right: -4rpx;
  top: -4rpx;
}
</style>
