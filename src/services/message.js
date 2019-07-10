import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 查询 消息 列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryMessageList(params) {
  return request(`/admin/message/list?${stringify(params)}`);
}

/**
 * 数据统计
 * @param params
 * @returns {Promise<void>}
 */
export async function getDataCharts(params) {
  return request(`/admin/data/charts?${stringify(params)}`);
}

/**
 * 查询下发指令
 * @param params
 * @returns {Promise<void>}
 */
export async function queryCmdList(params) {
  return request(`/admin/data/cmd/list?${stringify(params)}`);
}

/**
 * 查询上报数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryUpList(params) {
  return request(`/admin/data/up/list?${stringify(params)}`);
}
