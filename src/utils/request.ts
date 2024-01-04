import dayjs from 'dayjs';
import { forward } from './router';
import env from '@/config/env';
import { hideLoading, showLoading } from '@/config/serviceLoading';

function rejectMessage(err: { errno: number; errmsg: string }) {
  const { errmsg = '抢购火爆，稍候片刻！', errno = -1 } = err;
  switch (errno) {
    case 10000:
      // 特殊异常处理
      forward('login');
      break;

    default:
      uni.showToast({
        title: errmsg,
        icon: 'error'
      });
      break;
  }
}

// h5环境开启代理
const apiBaseUrl = env.apiBaseUrl;

function baseRequest(
  method:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
    | undefined,
  url: string,
  data: { isLoading: any; urlName: any }
) {
  return new Promise((resolve, reject) => {
    const urlName = JSON.parse(JSON.stringify(data.urlName));
    showLoading(data.isLoading);
    delete data.isLoading;
    delete data.urlName;
    let responseDate: unknown;
    let tempUrl = ''
    // #ifdef MP-WEIXIN
    tempUrl = 'https://zhijia-admin.vimhe.com/admins' + url
    // #endif
    // #ifndef MP-WEIXIN
    tempUrl = 'https://zhijia-admin.vimhe.com/admins' + url
    // #endif
    uni.request({
      url: tempUrl,
      method,
      timeout: 20000,
      header: {
        'content-type': 'application/json;',
        Authorization: uni.getStorageSync('token')
      },
      data,
      success: (res: any) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.code === 200) {
            responseDate = res.data;
            consoleRes(
              urlName,
              dayjs().format('YYYY-MM-DD HH:mm:ss'),
              url,
              responseDate
            );
            resolve(responseDate);
          } else {
            if (res.data.code === 401) {
              rejectMessage({
                errno: res.data.code,
                errmsg: '令牌失效，请重新登陆'
              });
              uni.redirectTo({ url: "/pages/loginOrSignup/loginOrSignup" });
            } else {
              reject(res.data);
              rejectMessage({
                errno: res.data.code,
                errmsg: res.data.msg
              });
            }
          }
        } else {
          reject(res.data);
          rejectMessage({
            errno: -1,
            errmsg: '抢购火爆，稍候片刻！'
          });
        }
      },
      fail: (res) => {
        console.log(`res`, res)
        reject(res);
        rejectMessage({
          errno: -1,
          errmsg: '网络不给力，请检查你的网络设置~'
        });
      },
      complete: () => {
        hideLoading();
      }
    });
  });
}

const http = {
  get: <T>(api: string, params: any) =>
    baseRequest('GET', api, {
      // ...getCommonParams(),
      ...params
    }) as Http.Response<T>,
  post: <T>(api: string, params: any) =>
    baseRequest('POST', api, {
      // ...getCommonParams(),
      ...params
    }) as Http.Response<T>
};

export function consoleRes(
  urlName: string,
  time: string,
  className: string,
  res: any
) {
  // setTimeout(() => {
  console.log(
    `%c${urlName} ${className} (%c${200}%c)`,
    'font-weight:bold',
    'color:#67C23A;font-weight:bold',
    'font-weight:bold',
    JSON.parse(JSON.stringify(res))
  );
  // }, 0)
}

export default http;
