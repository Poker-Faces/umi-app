import { routerRedux } from 'dva/router';
import { fakeAccountLogin, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import { setToken } from '@/utils/utils';

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      let data = response;
      if (data && data.data) {
        data = response.data.userInfo;
        data.status = response.status;
      }
      yield put({
        type: 'changeLoginStatus',
        payload: data,
      }); // Login successfully
      if (data.status === 200) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
        // 强刷一下页面，不让登录成功后取不到localStorage
        window.location.reload(redirect || '/');
      }
    },
    // 获取验证码
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setToken(payload.token); // 设置用户token
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type || 'account' };
    },
  },
};
export default Model;
