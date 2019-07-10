import request from '@/utils/request';
import { stringify } from 'qs';

/**
 * 查询单个用户信息
 * @returns {Promise<void>}
 */
export async function queryCurrent() {
  return request('/admin/user/currentUser');
}

/**
 * 更新用户信息
 * @param {*} params
 */
export async function updateUserInfo(params) {
  return request(`/admin/user/update?${stringify(params)}`);
}

/**
 *查询用户列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function queryUserList(params) {
  return request(`/admin/user/list?${stringify(params)}`);
}

/**
 *删除用户
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function deleteUser(params) {
  return request(`/admin/user/delete?${stringify(params)}`);
}

/**
 * 重置用户密码
 * @param {*} params
 */
export async function reSetPassword(params) {
  return request(`/admin/user/set/password?${stringify(params)}`);
}

/**
 * 创建后台用户
 * @param {*} params
 */
export async function createUser(params) {
  return request(`/admin/user/create?${stringify(params)}`);
}
