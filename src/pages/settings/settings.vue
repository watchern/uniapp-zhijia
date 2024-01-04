<script lang="ts" setup>
import { apiLockListCtrlList } from "@/api";
const { lockInfo, setLockInfo } = useStore("root");
// const doorLockName = ref('挚家');
const doorLockVersion = ref("V1.1.1");
function goPage(params) {
  uni.navigateTo({ url: `/pages/settingPages/${params}` });
}
function list() {
  apiLockListCtrlList()
    .then((res: any) => {
      res.rows.forEach((el) => {
        if (el.id === lockInfo.value.id) {
          setLockInfo(el);
        }
      });
    })
    .catch((err) => {
      console.log(`err====`, err);
    });
}
onMounted(() => {
  uni.hideTabBar({
    success: () => {},
    fail: () => {},
  });
  uni.$on("doorLockName", function () {
    list();
  });
});
</script>

<template>
  <LayoutTabbar title="设置" :full="true">
    <div bg="#efefef" h-1px></div>
    <nut-cell-group>
      <nut-cell>
        <template #title>
          <div text="#333">门锁类型：{{ lockInfo.locktxt }}</div>
        </template>
      </nut-cell>
      <nut-cell>
        <template #title>
          <div text="#333">门锁编号：{{ lockInfo.id }}</div>
        </template>
      </nut-cell>
      <nut-cell is-link @tap="goPage('doorLockRoom')">
        <template #title>
          <div text="#333">门锁名称：{{ lockInfo.remark }}</div>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-cell-group>
      <nut-cell>
        <template #title> 门锁版本 </template>
        <template #desc>
          <div text="#333">
            {{ doorLockVersion }}
          </div>
        </template>
      </nut-cell>
      <nut-cell is-link @tap="goPage('needHelp')">
        <template #title>
          <div text="#333">需要帮助</div>
        </template>
      </nut-cell>
    </nut-cell-group>
  </LayoutTabbar>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background: #efefef;
}
</style>
