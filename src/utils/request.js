/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';
import { getToken } from './utils';

// 用户token
const setDefaultParams = () => {
  const param = {};
  const token = getToken('token');
  if (token) {
    param.token = token;
  }
  return param;
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `错误代码 : ${status}`,
      description: errorText,
    });
  }
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  // 默认错误处理
  errorHandler,
  timeout: 1000 * 10, // 默认超时时间10秒
  credentials: 'include', // 默认请求是否带上cookie
  params: setDefaultParams(), // 始终带上的参数
});

/**
 * 对于状态码实际是 200 的, 业务上的错误
 */
request.interceptors.response.use(async response => {
  const data = await response.clone().json();
  if (data && data.status) {
    if (data.status !== 200) {
      if (data.message === '未经授权的请求') {
        router.push('/user/login');
      }
      notification.error({
        message: `错误代码 : ${data.status}`,
        description: data.message,
      });
      // throw new Error(data.message);
    }
  }
  return response;
});

export default request;
