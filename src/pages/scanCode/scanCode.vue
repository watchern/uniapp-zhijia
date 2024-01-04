<script setup>
import { ref } from "vue";


let webView = null; // webview容器
let barcode = null; // 扫码框

const { statusBarHeight, windowHeight, windowWidth } = useStore("root");
const isFlash = ref(false); // 扫码框

// 扫码成功回调
function onmarked(type, result) {
  console.log(`result`, result);
  uni.redirectTo({ url: `/pages/manualAdd/manualAdd?result=${result}` });
}
function onScancode(result) {
  console.log(`result`, result);
  if (result !== "") {
    let temp = "";
    // #ifdef H5
    temp = result;
    // #endif
    // #ifdef MP-WEIXIN
    temp = result.detail.result;
    // #endif
    setTimeout(() => {
      uni.redirectTo({ url: `/pages/manualAdd/manualAdd?result=${temp}` });
    }, 100);
  }
}

function goManualAdd() {
  uni.redirectTo({ url: "/pages/manualAdd/manualAdd" });
}

function openFlash() {
  isFlash.value = !isFlash.value;
  // #ifdef APP
  barcode.setFlash(isFlash.value);
  // #endif
}

// #ifdef APP
// 创建窗口和扫码控件
function createBarcode() {
  // 【步骤1】判断有没有创建过 webview 容器，如果没有就执行创建操作
  const height = windowHeight.value;
  if (!webView) {
    webView = plus.webview.open("", "barCodeBox", {
      width: `${windowWidth.value}px`,
      height: `${windowWidth.value}px`,
      top: `${height / 2 - windowWidth.value / 2 + statusBarHeight.value}px`,
      left: "0",
      background: "transparent",
    });
  }

  // 【步骤2】判断有没有创建过 扫码框，如果没有就执行创建操作
  if (!barcode) {
    barcode = plus.barcode.create(
      "barcode",
      [plus.barcode.QR], // 只扫二维码
      {
        top: "0px",
        left: "0px",
        width: "100%",
        height: `${windowWidth.value}px`,
        scanbarColor: "#14A83B",
        frameColor: "#14A83B",
      }
    );

    barcode.onmarked = onmarked; // 扫码结果回调函数

    plus.webview.getWebviewById("barCodeBox").append(barcode);
    // 【步骤3】将扫码框添加到 webview 里
  }
  barcode.start(); // 开始扫码
}
// #endif
const isShow = ref(false);
// 在页面加载时，延迟300毫秒执行创建扫码框函数
onMounted(() => {
  console.log(`显示了`);
  isShow.value = true;
  // #ifdef APP
  console.log(`11111111111`,11111111111)
  setTimeout(() => {
    createBarcode();
  }, 400);
  // #endif
});

onUnmounted(() => {
  console.log(`卸载了`);
  isShow.value = false;
  if (webView) {
    plus.webview.close("barCodeBox");
    webView = null;
  }
});
</script>

<template>
  <LayoutDefault background="#000" bg="#000">
    <template #left>
      <Black text="#fff" />
    </template>
    <div class="scanner-container" style="height: calc(100% - 40px)">
      <div class="top-text">
        <div>
          <div text="18px font-600" class="top-text-title">
            请将相机靠近门锁上二维码
          </div>
          <div text="14px" pt-10px>对准下方取码框</div>
        </div>
        <div text="14px">如扫码困难可轻微移动摄像头，有助于识别二维码</div>
      </div>
      <div
        class="barcode"
        :style="{ width: `${windowWidth}px`, height: `${windowWidth}px` }"
      >
        <!-- #ifdef H5 -->
        <qr-stream @decode="onScancode">
          <div class="frame">
            <div class="frame-border">
              <div class="frame-border-left1"></div>
              <div class="frame-border-left2"></div>
              <div class="frame-border-left3"></div>
              <div class="frame-border-left4"></div>
              <div class="frame-border-right1"></div>
              <div class="frame-border-right2"></div>
              <div class="frame-border-right3"></div>
              <div class="frame-border-right4"></div>
            </div>
            <div class="frame-line"></div>
          </div>
        </qr-stream>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <camera
          v-if="isShow"
          h="100%"
          w="100%"
          @scancode="onScancode"
          mode="scanCode"
          device-position="back"
          :flash="isFlash ? 'on' : 'off'"
        >
          <div class="frame">
            <div class="frame-border">
              <div class="frame-border-left1"></div>
              <div class="frame-border-left2"></div>
              <div class="frame-border-left3"></div>
              <div class="frame-border-left4"></div>
              <div class="frame-border-right1"></div>
              <div class="frame-border-right2"></div>
              <div class="frame-border-right3"></div>
              <div class="frame-border-right4"></div>
            </div>
            <div class="frame-line"></div>
          </div>
        </camera>
        <!-- #endif -->
      </div>

      <div class="bottom-text">
        <!-- #ifdef MP-WEIXIN -->
        <div class="flash-icon" @tap="openFlash">
          <div v-if="!isFlash" i-ri-lightbulb-line></div>
          <div v-else i-ri-lightbulb-flash-line></div>
          <div pt-10px text="14px">轻触照亮</div>
        </div>

        <div text="#14A83B 14px" mt-60px @tap="goManualAdd">
          手动添加门锁装置
        </div>
        <!-- #endif -->
        <!-- #ifdef APP -->
        <div class="flash-icon" @tap="openFlash">
          <div v-if="!isFlash" i-ri-lightbulb-line></div>
          <div v-else i-ri-lightbulb-flash-line></div>
          <div pt-10px text="14px">轻触照亮</div>
        </div>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <div text="#14A83B 14px" mt-60px @tap="goManualAdd">
          手动添加门锁装置
        </div>
        <!-- #endif -->
        <!-- #ifdef APP -->
        <div text="#14A83B 14px" @tap="goManualAdd">手动添加门锁装置</div>
        <!-- #endif -->
      </div>
    </div>
  </LayoutDefault>
</template>

<style lang="scss">
page {
  height: 100%;
  color: #fff;
}

.scanner-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  text-align: center;
  .stream {
    height: 100%;
    width: 100%;
    // max-height: 500px;
    // max-width: 500px;
    margin: auto;
  }
  .frame {
    // border-style: solid;
    // border-width: 2px;
    height: 200px;
    width: 200px;
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    margin: auto;
    overflow: hidden;
    border-color: transparent;
  }
  .frame-border {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .frame-border-left1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #14a83b;
  }
  .frame-border-left2 {
    background-color: #14a83b;
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 40px;
  }

  .frame-border-left3 {
    background-color: #14a83b;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
  }

  .frame-border-left4 {
    background-color: #14a83b;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 3px;
    height: 40px;
  }

  .frame-border-right1 {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 3px;
    background-color: #14a83b;
  }
  .frame-border-right2 {
    background-color: #14a83b;
    position: absolute;
    top: 0;
    right: 0;
    width: 3px;
    height: 40px;
  }

  .frame-border-right3 {
    background-color: #14a83b;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 3px;
  }

  .frame-border-right4 {
    background-color: #14a83b;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 3px;
    height: 40px;
  }

  // .frame::before {
  //   bottom: 0;
  //   left: 0;
  //   width: 40px;
  //   height: 3px;
  // }

  // .frame::after {
  //   bottom: 0;
  //   right: 0;
  //   width: 40px;
  //   height: 3px;
  // }

  .frame-line {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, #14a83b, transparent);
    animation: scan 3s linear infinite;
    top: 0;
  }

  @keyframes scan {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(200px);
    }
  }
  // .barcode {
  // }
  .top-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-top: 13px;
    padding-bottom: 20px;
    .top-text-title {
      font-weight: bold;
    }
  }
  .bottom-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 20px;
    .flash-icon {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }
}

.title {
  font-size: 50rpx;
  color: #333;
}

.result_list {
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  padding-top: 20rpx;
}

.result_li {
  box-sizing: border-box;
  margin-bottom: 20rpx;
  padding: 10rpx 20rpx;
  border: 1px solid #7298c8;
  border-radius: 10rpx;
  font-size: 40rpx;
}
</style>
