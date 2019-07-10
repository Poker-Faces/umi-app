import request from '@/utils/request';
import md5 from 'js-md5';
import { stringify } from 'qs';

export async function fakeAccountLogin(params) {
  params.password = md5(params.password);
  return request(`/admin/user/login?${stringify(params)}`);
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
