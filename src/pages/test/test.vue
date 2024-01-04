<script lang="ts" setup>
import apiTest from '@/api/apiTest';
import { getCommonParams, setCommonParams } from '@/config/commonParams';
import { useInit } from '@/hooks/useInit';
import { useTitle } from '@/hooks/useTitle';
import { onUrlPage } from '@/utils/router';
import uniAsync from '@/utils/uniAsync';

onLoad(() => {
  const { pageName, pagePath, pageQuery } = useInit();
  console.log(pageName, pagePath, pageQuery, 'pageName,pagePath, pageQuery');
});

const { title, changeTitle } = useTitle();

const { name, fullName, updateName } = useStore('test');

async function getTest() {
  const getTest = await apiTest.getTest({ a: 1 });
  if (!getTest) {
    uni.showToast({
      title: '自定义异常处理'
    });
    return;
  }
  // getTest.data?.age
  // getTest.data?.name
  console.log(getTest, 'getTest');
}
async function postTest() {
  const postTest = await apiTest.postTest({ a: 1 });
  if (!postTest) return;
  // postTest.data?.val
  console.log(postTest, 'postTest');
}

function getCommonParam() {
  console.log(getCommonParams());
}
function setCommonParam() {
  setCommonParams({ channel: 'test' });
  getCommonParam();
}


function onScrollToLower() {
  console.log('自定义 onScrollToLower');
}
</script>

<template>
  <div class="h-screen">
    <pullList :on-scroll-to-lower="onScrollToLower">
      <template #list>
        <view>name:{{ name }}</view>
        <view>fullName:{{ fullName }}</view>
        <view @tap="updateName('newName')">updateName</view>
        <view>title:{{ title }}</view>
        <view @tap="changeTitle">changeTitle</view>
        <view @tap="getTest">getTest</view>
        <view @tap="postTest">postTest</view>
        <view @tap="getCommonParam">getCommonParams</view>
        <view @tap="setCommonParam">setCommonParams</view>
        <view data-url="index?a=1" @tap="onUrlPage">onUrlPage</view>
        <view class="p-10">unocss-test</view>
        <view v-for="i in 30" :key="i" class="p10">scroll Test</view>
      </template>
    </pullList>
  </div>
</template>

<style lang="scss" scoped></style>
