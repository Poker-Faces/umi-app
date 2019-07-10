import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询 指标 列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryTargetlist(params) {
  return request(`/admin/configure/target/list?${stringify(params)}`);
}

/**
 * 修改指标信息
 * @param params
 * @returns {Promise<void>}
 */
export async function editTarget(params) {
  return request(`/admin/configure/target/save?${stringify(params)}`);
}

/**
 * 查询参数列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryParamList(params) {
  return request(`/admin/configure/params/list?${stringify(params)}`);
}

/**
 * 设置参数启用状态
 * @param params
 * @returns {Promise<void>}
 */
export async function switchParamStatus(params) {
  return request(`/admin/configure/params/switch?${stringify(params)}`);
}

/**
 * 更新参数信息
 * @param params
 * @returns {Promise<any>}
 */
export async function updateParamInfo(params) {
  return request(`/admin/configure/params/update?${stringify(params)}`);
}

/**
 * 添加参数信息
 * @param params
 * @returns {Promise<any>}
 */
export async function createParam(params) {
  return request(`/admin/configure/params/create?${stringify(params)}`);
}
