import { defineStore } from 'pinia';
export default defineStore({
  id: 'tabbar',
  state: () => {
    return {
      current: 0,
      tabBar: [
        {
          pagePath: '/pages/index/index',
          text: '门锁',
          iconPath: '/static/images/icon_smartLockNormal@2x.png',
          selectedIconPath: '/static/images/icon_smartLockActive@2x.png',
          num: 0,
          isDot: false,
          verify: true
        },
        {
          pagePath: '/pages/administration/administration',
          text: '管理',
          iconPath: '/static/images/icon_manageNormal@2x.png',
          selectedIconPath: '/static/images/icon_manageActive@2x.png',
          num: 0,
          isDot: false,
          verify: true
        },
        {
          pagePath: '/pages/unlocking/unlocking',
          text: 'extend',
          iconPath: '/static/images/icon_unlock@2x.png',
          hump: true,
          verify: true,
          selectedIconPath: '/static/images/icon_unlock@2x.png'
        },
        {
          pagePath: '/pages/settings/settings',
          text: '设置',
          iconPath: '/static/images/icon_settingNormal@2x.png',
          selectedIconPath: '/static/images/icon_settingActive@2x.png',
          num: 0,
          isDot: true,
          verify: true
        },
        {
          pagePath: '/pages/profile/profile',
          text: '我的',
          iconPath: '/static/images/icon_mineNormal@2x.png',
          selectedIconPath: '/static/images/icon_mineActive@2x.png',
          num: 0,
          isDot: true,
          verify: true
        }
      ],
      tableHeight: 0
    };
  },
  getters: {},
  actions: {
    setCurrent(index) {
      this.current = index;
      uni.hideTabBar({
        success: () => { },
        fail: () => { },
      });
    },
    tabbarSwitch(index, hump, pagePath, verify) {
      if (verify) {
        this.current = index;
        if (index === 0) {
          uni.$emit('ListenIndex');
        }
        if (index === 1) {
          uni.$emit('ListenAdministration');
        }
        // if (hump) {
        //   uni.navigateTo({ url: pagePath });
        // } else {
        uni.switchTab({
          url: pagePath
        }).then((res) => {
          console.log(`res`, res)
        }).catch((err) => {
          console.log(`err`, err)
        })
        // }
      }
    }
  }
});
