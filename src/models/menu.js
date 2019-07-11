import { getRouters } from '@/services/menu';

const MenuModel = {
  namespace: 'MenuModel',
  state: {
    menuData: [],
  },
  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(getRouters);
      yield put({
        type: 'saveRouters',
        payload: response.data ? response.data.routers : [],
      });
    },
  },
  reducers: {
    saveRouters(state, action) {
      return { ...state, menuData: action.payload || [] };
    },
  },
};
export default MenuModel;
