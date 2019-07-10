export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {path: '/user', redirect: '/user/login'},
      {path: '/user/login', component: './UserLogin'},
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes: [
      {path: '/', component: './Monitor/Monitor',},
      {path: '/monitor', component: './Monitor/Monitor',},
      {path: '/account/userinfo',component: './User/EditUserInfo',},
      {
        path: '/device',
        routes: [
          {path: '/device/grouping', component: './Device/Grouping',},
          {path: '/device/device', component: './Device/Device',},
          {path: '/device/product', component: './Device/Product',},
          {path: '/device/share', component: './Device/Share',},
        ],
      },
      {path: '/ota', component: './OTA/OTA',},
      {
        path: '/config',
        routes: [
          {path: '/config/target', component: './Config/Target',},
          {path: '/config/params', component: './Config/Params',},
        ],
      },
      {
        path: '/data',
        routes: [
          {path: '/data/collection', component: './Data/Collection',},
          {path: '/data/statistics', component: './Data/Statistics',},
          {path: '/data/news', component: './Data/News',},
          {path: '/data/cmd', component: './Data/Cmd',},
          {path: '/data/up', component: './Data/UP',},
        ],
      },
      {path: '/userconfig', component: './User/UserConfig',},
      {component: './404',},
    ],
  },
  {component: './404',},
];
