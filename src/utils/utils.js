/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

// 根据环境获取服务器地址
export function getServerPath() {
  const env = process.env.API_ENV;
  const server = {
    apiServer: '127.0.0.1', wsServer: 'ws://127.0.0.1',
  };
  if (env === 'test') {
    server.wsServer = 'ws://39.105.129.167:9013';
  } else if (env === 'development') {
    server.wsServer = 'ws://39.105.14.244:9013';
  } else {
    server.wsServer = 'ws://39.105.129.167:9013';
  }
  return server;
}

// 设置localStorage
export function setToken(token) {
  localStorage.setItem('token', token);
}

// 获取localStorage
export function getToken(key) {
  return localStorage.getItem(key);
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl };
