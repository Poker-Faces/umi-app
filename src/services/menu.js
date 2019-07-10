import request from '@/utils/request';

export async function getRouters() {
  return request('/admin/user/routers/get');
}
