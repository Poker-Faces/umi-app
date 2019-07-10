import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 查询设备 列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDevicelist(params) {
  return request(`/admin/device/list?${stringify(params)}`);
}

/**
 * 查询设备总数
 * @param params
 * @returns {Promise<void>}
 */
export async function getDeviceCount() {
  return request('/admin/device/count');
}

/**
 * 获取单个设备详细信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDeviceDetail(params) {
  return request(`/admin/device/detail/get?${stringify(params)}`);
}

/**
 * 删除单个设备
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteDevice(params) {
  return request(`/admin/device/delete?${stringify(params)}`);
}

/**
 * 保存设备信息
 * @param params
 * @returns {Promise<any>}
 */
export async function saveDeviceInfo(params) {
  return request(`/admin/device/save?${stringify(params)}`);
}

/**
 * 查询设备分组列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDeviceGroupList(params) {
  return request(`/admin/group/list?${stringify(params)}`);
}

/**
 * 查询 设备 产品列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDeviceProductList(params) {
  return request(`/admin/product/list?${stringify(params)}`);
}

/**
 * 查询 设备分享列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDeviceShareList(params) {
  return request(`/admin/share/list?${stringify(params)}`);
}

/**
 * 查询 设备详细信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDetailInfo(params) {
  return request(`/admin/device/detail/info?${stringify(params)}`);
}

/**
 * 数据 上报数据
 * @param params
 * @returns {Promise<any>}
 */
export async function uploadData(params) {
  return request(`/admin/data/list?${stringify(params)}`);
}

/**
 * 获取实时数据
 * @param params
 * @returns {Promise<any>}
 */
export async function getRealtimeData(params) {
  return request(`/admin/device/get/data?${stringify(params)}`);
}

export async function queryOTAList() {
  return request('/admin/device/list');
}
