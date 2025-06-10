import { isFastClick, parseUrl, restoreUrl } from '@/utils/shared';
import { getUrlType, h5HsqMap, needAuthPath, pagesMap } from '@/utils/urlMap';
export function useHasToken() {
  onMounted(() => {
    const token = uni.getStorageSync("token")
    if (!token) {
      uni.showToast({
        title: "请重新登录",
        icon: "none",
      });
      uni.redirectTo({ url: "/pages/loginOrSignup/loginOrSignup" });
      // uni.redirectTo({ url: '/pages/login/login' });
      // uni.redirectTo({ url: '/pages/signup/signup' });
      // uni.redirectTo({ url: '/pages/forgotPassword/forgotPassword' });
      // uni.switchTab({ url: '/pages/index/index' });
    }
  })
}

export function getAppSystemInfo() {
  const topHeight = ref(0);
  const textTop = ref(20);
  const windowHeight = ref(0);
  const safeAreaBottom = ref(0);
  // const navigationBarHeight = ref(0);
  onMounted(async () => {
    const { setSystem } = useStore("root");
    const systemInfo: any = await uni.getSystemInfo();
    setSystem(systemInfo);
    windowHeight.value = systemInfo.windowHeight;
    // #ifdef MP-WEIXIN
    // 获取微信胶囊的位置信息 width,height,top,right,left,bottom
    // @ts-ignore
    const custom = wx.getMenuButtonBoundingClientRect()
    // 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
    // navigationBarHeight.value = custom.height + systemInfo.statusBarHeight + (custom.top - systemInfo.statusBarHeight) * 2
    topHeight.value = custom.height + (custom.top - systemInfo.statusBarHeight) * 2
    // console.log("导航栏高度："+this.globalData.navigationBarHeight)

    // 总体高度 = 状态栏高度 + 导航栏高度
    // topHeight.value = navigationBarHeight + systemInfo.statusBarHeight

    // #endif
    // #ifdef APP
    topHeight.value = systemInfo.statusBarHeight;
    // #endif
    // #ifdef H5
    topHeight.value = systemInfo.statusBarHeight;
    // #endif
    safeAreaBottom.value = systemInfo.windowHeight - systemInfo.safeArea.bottom;
    // console.group('系统参数');
    console.log(`systemInfo`, systemInfo)
    console.log("顶部安全区距离：" + topHeight.value);
    console.log("底部安全区距离：" + safeAreaBottom);
    // console.groupEnd();
  })

  return {
    topHeight,
    textTop,
    windowHeight,
    safeAreaBottom,
    // navigationBarHeight
  }
}
export function isH5() {
  return getPlatform() === 'WEB';
}
export function isApp() {
  return getPlatform() === 'APP';
}
export function isWx() {
  return getPlatform() === 'WEIXIN';
}
export async function isAndroid() {
  const systemInfo: any = await uni.getSystemInfo();
  console.log(`systemInfo`, systemInfo.platform);
  return systemInfo.platform === 'android';
}

function getAppPlatform() {
  // const { platform } = useStore('root');
  // return platform;
  return 'android';
}

function getPlatform() {
  let platForm = '';
  // #ifdef APP-PLUS
  platForm = 'APP';
  // #endif

  // #ifdef WEB
  platForm = 'WEB';
  // #endif

  // #ifdef MP-WEIXIN
  platForm = 'WEIXIN';
  // #endif

  return platForm;
}



export function onUrlPage(e: any) {
  if (isFastClick()) return;
  const { url } = e.currentTarget.dataset;
  // url = 'http://m.dev.haoshiqi.net/v2/index?id=11&name=22'
  // url = 'https://topic.doweidu.com/?id=a9918e941a43233211fb7a8cfc7afbbd&origin=hsq_aliptmp'
  if (!url) return;
  const urlType = getUrlType(url);
  const { name, path, query } = parseUrl(url);
  if (urlType === 'topic') {
    // 专题页
    forward('topic', Object.assign({ url: path }, query));
  } else if (urlType === 'h5Hsq') {
    if (h5HsqMap.includes(name)) {
      if (needAuthPath.includes(name)) return forward('login');
      // h5页面
      forward('web-view', Object.assign({ url: path }, query));
    } else {
      // 原生页
      forward(name, query);
    }
  } else if (urlType === 'other' && pagesMap.find((i) => i.name === name)) {
    // 原生页
    forward(name, query);
  } else {
    // 不跳转
  }
}

export function forward(name: string, query: Types.Query = {}): any {
  if (needAuthPath.includes(name)) return forward('login');
  const targetPage = pagesMap.find((i) => i.name === name);
  if (!targetPage) return;
  const isReplace = query.replace;
  delete query.replace;
  const { type, path } = targetPage;
  const url = restoreUrl(path, query);
  const params = { url };
  if (type === 'tabBarPage') return uni.switchTab(params);
  if (!isReplace) return uni.navigateTo(params);
  uni.redirectTo(params);
}
