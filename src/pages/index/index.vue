<script lang="ts" setup>
import dayjs from 'dayjs';
import { useHasToken } from '@/hooks';
import { apiDoorUserLogCtrl, apiLockListCtrlList } from '@/api';
const { setCurrent } = useStore('tabbar');
const { setLockInfo, statusBarHeight, windowWidth, lockInfo } =
  useStore('root');
const pageWidth = ref(0);
const showRound = ref(false);
const textTop = ref(0);
const iconTop = ref(0);

const today = ref(dayjs().format('MM月DD日'));

const isShow = ref(false);
const loading = ref(false);
const dateList = ref<any>([]);
const week = ref(dayjs().format('ddd'));

const doorLockList = ref<any>([
  {
    checkbox: true,
    name: '门锁1'
  },
  {
    checkbox: false,
    name: '门锁2'
  }
]);

// #region

onBackPress(() => {
  // console.log(`options`, options);
  if (showRound.value) {
    showRound.value = false;
    return true;
  }
});

const zoomedOut = ref(false);
const zoomedHeight = ref(0);

const startX = ref<any>('');
const deltaX = ref<any>('');

const toggleZoom = () => {
  zoomedOut.value = !zoomedOut.value;
};

function changeDate(params, index) {
  // console.log(`params`, params);
  if (!dateList.value[index].select) {
    dateList.value.forEach((item: any) => {
      item.select = false;
    });
  }
  if (params.today) {
    // console.log(`params.today`, params.today);
    return;
  }
  if (dateList.value[index].select) {
    return;
  }
  // console.log(`params`, params);
  setTimeout(() => {
    dateList.value[index].select = !dateList.value[index].select;
  }, 100);
}

function onSearch() {
  uni.navigateTo({ url: '/pages/searchDetails/searchDetails' });
}

function scanIt() {
  uni.navigateTo({ url: '/pages/scanCode/scanCode' });
}

function goAdd() {
  zoomedOut.value = false;
  uni.navigateTo({ url: '/pages/addDoorLock/addDoorLock' });
}

function itemclick(e) {
  doorLockList.value.forEach((el) => {
    if (el.checkbox) {
      el.checkbox = false;
    }
  });
  setLockInfo(e);
  e.checkbox = true;
  zoomedOut.value = false;
  uni.showToast({
    title: '切换成功',
    icon: 'none'
  });
}

function touchStart(event) {
  // 记录触摸起始点的横坐标
  startX.value = event.touches[0].clientX;
}

function touchMove(event) {
  // 计算滑动距离
  const currentX = event.touches[0].clientX;
  deltaX.value = currentX - startX.value;
}

function touchEnd() {
  if (showRound.value) {
    return;
  }
  // 判断滑动方向
  if (deltaX.value > 50) {
    if (!zoomedOut.value) {
      zoomedOut.value = true;
    }
    // 向右滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
    // console.log("向右滑动逻辑");
  } else if (deltaX.value < -30) {
    // 向左滑动逻辑   这里只建议写一些性能消耗小的逻辑，比如：this.status = !this.status 因为当他的横坐标大于或小于50时，每隔一个数字都会执行一次，所以...非常消化性能
    // console.log("向左滑动逻辑");
    if (zoomedOut.value) {
      zoomedOut.value = false;
    }
  }
  startX.value = '';
  deltaX.value = '';
  // 清除触摸起始点记录，这里也可以写一些比较复杂的逻辑，每滑动一次松后执行。
}

function logout() {
  setCurrent(0);
  uni.clearStorage();
  const userToken = uni.getStorageSync('token');
  console.log(userToken)
  if (!userToken) {
    uni.redirectTo({ url: '/pages/loginOrSignup/loginOrSignup' });
  }
}
function add() {
  uni.navigateTo({ url: '/pages/scanCode/scanCode' });
}
function closeRound() {
  showRound.value = false;
}
// #endregion
// 获取门锁列表
function getLockLisit() {
  apiLockListCtrlList()
    .then((res: any) => {
      // console.log(`res.rows.length`, res.rows.length);
      if (res.rows.length === 0) {
        isShow.value = true;
      } else {
        doorLockList.value = res.rows.map((item, index) => {
          return {
            checkbox: index === 0,
            name: item.remark || item.locktxt,
            ...item
          };
        });
        setLockInfo(doorLockList.value[0]);

        getDoorUserLogCtrlList();
        isShow.value = false;
      }
      setTimeout(() => {
        loading.value = false;
      }, 500);
    })
    .catch((err) => {
      console.log(`err====`, err);
      loading.value = false;
    });
}
const doorUserLogCtrlList = ref([]);
// 获取日志列表
function getDoorUserLogCtrlList() {
  const id = doorLockList.value.filter((el: any) => el.checkbox)[0].id;

  apiDoorUserLogCtrl({
    deviceid: id,
    todoTypeStr: '1,2,3'
  })
    .then((res: any) => {
      doorUserLogCtrlList.value = res.rows;
    })
    .catch((err) => {
      console.log(`err====`, err);
    });
}

// 初始化
function init() {
  if (!lockInfo.value.id) {
    loading.value = true;
  }
  // #region
  uni.hideTabBar({
    success: () => {},
    fail: () => {
      // 捕获报错，防止没有tabbar页面调用后控制台报错
    }
  });

  // 获取页面宽度

  const width = windowWidth.value;
  // console.log(`width`, width);
  // #ifdef APP-ANDROID
  pageWidth.value = Math.ceil(width / 1.9) - 20;
  // #endif

  pageWidth.value = Math.ceil(width / 1.9) - 10;

  // console.log(`pageWidth.value`, pageWidth.value);
  dateList.value = [];
  const weekStartDate = dayjs().startOf('week');
  for (let i = 0; i < 7; i++) {
    const date = weekStartDate.add(i, 'day');
    // console.log(`date.isSame(dayjs(), "day")`, date.isSame(dayjs(), "day"));
    dateList.value.push({
      date: date.format('YYYY-MM-DD'),
      day: date.format('DD'),
      week: date.format('ddd'),
      select: false,
      today: date.isSame(dayjs(), 'day')
    });
  }
  // #ifdef H5
  iconTop.value = 20;
  textTop.value = 100;
  zoomedHeight.value = 160;
  // #endif
  // #ifdef APP
  iconTop.value = statusBarHeight.value + 10;
  textTop.value = 70;
  zoomedHeight.value = 90;
  // #endif
  // #ifdef MP-WEIXIN
  iconTop.value = statusBarHeight.value + 48;
  textTop.value = 40;
  zoomedHeight.value = 160;
  // #endif
  // #endregion
  getLockLisit();
}
onMounted(() => {
  useHasToken();
  init();

  uni.$on('addDoorLockSuccess', function () {
    getLockLisit();
  });
  uni.$on('ListenIndex', function () {
    init();
  });
});
</script>

<template>
  <LayoutTabbarLoading v-if="loading"> </LayoutTabbarLoading>
  <template v-else>
    <div
      v-if="!isShow"
      class="homePageMain"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <header
        class="hide-dom"
        :class="{ 'zoom-out2': !zoomedOut }"
        :style="{
          paddingTop: `${statusBarHeight + zoomedHeight}px`
        }"
        pl-20px
        text="#fff"
      >
        <div text="18px">智能房屋管理</div>
        <div text="24px" pt-20px font-600>我的门锁</div>
        <div flex items-center text="#18D24C" mt-40px @tap="goAdd">
          <div i-ri-add-circle-line w-40px h-40px></div>
          <div>添加</div>
        </div>
        <div :style="{ maxWidth: `${pageWidth}px` }" mt-20px>
          <div v-for="v in doorLockList" :key="v.name">
            <div flex items-center justify-between @tap="itemclick(v)">
              <div>{{ v.name }}</div>
              <div
                v-if="v.checkbox"
                w-24px
                h-24px
                i-mdi-checkbox-marked-circle
              ></div>
              <div
                v-else
                w-24px
                h-24px
                i-mdi-checkbox-blank-circle-outline
              ></div>
            </div>
          </div>
        </div>
      </header>
      <div :class="{ 'zoom-out1': zoomedOut }" class="home-container">
        <div class="home-main">
          <div class="home-bg">
            <div
              :style="{
                paddingTop: `${iconTop}px`
              }"
            >
              <div flex justify-between px-15px>
                <image
                  w26px
                  h26px
                  src="@/static/images/icon_menu@2x.png"
                  @tap="toggleZoom"
                />
                <image
                  w26px
                  h26px
                  src="@/static/images/icon_scan@2x.png"
                  @tap="scanIt"
                />
              </div>
              <div
                text="#fff 20px"
                :style="{
                  paddingTop: `${textTop}px`
                }"
              >
                智能物联房屋管理
              </div>
            </div>
          </div>
          <main flex>
            <div flex items-center justify-center w="60%" class="lock-border">
              <image w-130px h-250px src="@/static/images/image@2x.png" />
            </div>
            <div flex w="40%" flex-col text="12px #999">
              <div h="33.33%" pt-15px pl-10px class="lock-border-b">
                <div>电池</div>
                <div flex items-center mt-10px>
                  <image
                    mr-10px
                    w-24px
                    h-12px
                    src="@/static/images/icon_batteryFull@2x.png"
                  />
                  <div text="#333">100%</div>
                </div>
              </div>
              <div h="33.33%" pt-15px pl-10px class="lock-border-b">
                <div>信号</div>
                <div flex items-center mt-10px>
                  <image
                    mr-10px
                    w-24px
                    h-12px
                    src="@/static/images/icon_singleFull@2x.png"
                  />
                  <div text="#333">100%</div>
                </div>
              </div>
              <div h="33.33%" pt-15px pl-10px>
                <div>蓝牙</div>
                <div flex items-center mt-10px>
                  <image
                    mr-10px
                    w-20px
                    h-20px
                    src="@/static/images/icon_linkActive@2x.png"
                  />
                  <div text="#333">已连接</div>
                </div>
              </div>
            </div>
          </main>
          <div h-10px bg="#EFEFEF"></div>
          <div px-15px class="lock-border-b">
            <div
              flex
              items-center
              justify-between
              h-68px
              text="20px #000"
              lh-68px
            >
              <div>
                {{ today }}
                {{ week }}
              </div>
              <div
                i-radix-icons-double-arrow-up
                text="#262727"
                @tap="showRound = true"
              ></div>
            </div>
          </div>
          <div>
            <UnlockRecordItem />
          </div>
        </div>
        <footer>
          <TabBar />
        </footer>
      </div>

      <nut-popup
        v-if="showRound"
        v-model:visible="showRound"
        position="bottom"
        :custom-style="{ height: '100%', backgroundColor: '#fff' }"
      >
        <div :style="{ height: 'calc(100% - 55px)', backgroundColor: '#fff' }">
          <div
            :style="{ paddingTop: `${iconTop - 8}px`, position: 'relative' }"
            text-center
            pb-12px
          >
            <div>开锁记录</div>
            <div
              :style="{
                position: 'absolute',
                top: `${iconTop - 8}px`
              }"
              style="right: 15px"
              i-radix-icons-double-arrow-down
              text="#262727"
              @tap="closeRound"
            ></div>
          </div>
          <div bg="#EFEFEF" h="100%">
            <div h-10px bg="#EFEFEF"></div>
            <div h-190px pt-10px mb-10px bg="#fff">
              <div
                class="search-bar"
                flex
                justify-self-start
                items-center
                @tap="onSearch"
              >
                <div i-ri-search-line></div>
                <div pl-10px>按日期查询更多记录</div>
              </div>
              <div px-15px>
                <div class="date-title">23年12月</div>
                <div flex justify-between items-center>
                  <div v-for="(v, index) in dateList" :key="v.date" text-center>
                    <div text="14px #666">{{ v.week }}</div>
                    <div
                      v-if="v.today"
                      mt-10px
                      :style="{
                        background: v.today ? '#14a83c' : '#fff',
                        color: v.today ? '#fff' : '#000'
                      }"
                      class="date-day"
                      @tap="changeDate(v, index)"
                    >
                      {{ v.day }}
                    </div>
                    <div
                      v-else
                      class="date-select"
                      :style="{
                        background: v.select ? '#14a83c' : '#fff'
                      }"
                      mt-10px
                      @tap="changeDate(v, index)"
                    >
                      <div v-if="!v.select">{{ v.day }}</div>
                      <div v-else class="date-select-bg">
                        {{ v.day }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <main>
              <UnlockRecordItem />
              <UnlockRecordItem />
              <UnlockRecordItem />
            </main>
          </div>
        </div>
      </nut-popup>
    </div>
    <LayoutTabbar2 v-else title="添加门锁">
      <!-- #ifdef MP-WEIXIN -->
      <template #left>
        <div text="14px" pl-20px @tap="logout">退出登录</div>
      </template>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <template #right>
        <div text="14px" pr-20px @tap="logout">退出登录</div>
      </template>
      <!-- #endif -->
      <div w="100%" flex justify-center>
        <div w-240px pt-60px>
          <div text="14px #333" pb-200px>
            请添加一把门锁吧，在这里您可以管理
            您的房屋，让您的生活变得更便捷、更 智能、更安全。
          </div>
          <div flex justify-center items-center>
            <div
              i-ri-add-circle-fill
              w-130px
              h-130px
              text="#14A83B"
              @tap="add"
            ></div>
          </div>
        </div>
      </div>
    </LayoutTabbar2>
  </template>
</template>

<style lang="scss">
@import './index.scss';

.addDoorLock {
  height: 100%;
}
</style>
