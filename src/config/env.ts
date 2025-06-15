import path from 'node:path';

const apiEnv: ApiEnv = 'dev';
const BASE_URL=''
// const { BASE_URL, ...meta_env} = import.meta.env
// console.log('import.meta.env', BASE_URL, meta_env)

// console.log(path)


const httpProtocol = BASE_URL ? 'http' : 'https'

const envMap = {
  dev: {
    baseUrl: httpProtocol + '://m.dev.xxx.com/admins',
    apiBaseUrl: httpProtocol + '://m.dev.api.xxx.com/admins'
  },
  beta: {
    baseUrl: httpProtocol + '://m.beta.xxx.com',
    apiBaseUrl: httpProtocol + '://m.beta.api.xxx.com'
  },
  prod: {
    baseUrl: httpProtocol + '://m.xxx.com',
    apiBaseUrl: httpProtocol + '://zhijia-admin.vimhe.com/admins'
  },
  local: {
    baseUrl: httpProtocol + '://m.dev.xxx.com',
    apiBaseUrl: httpProtocol + '://m.dev.api.xxx.com'
  }
};

type ApiEnv = keyof typeof envMap;
type Env<T extends ApiEnv> = {
  apiEnv: T;
} & (typeof envMap)[T];

function createEnv(apiEnv: ApiEnv): Env<typeof apiEnv> {
  return Object.assign({apiEnv}, envMap[apiEnv]);
}

const env = createEnv(apiEnv);
export default env;
