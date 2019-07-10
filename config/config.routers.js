export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './UserLogin' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin'],
    routes: [
      {
        path: '/',
        component: './Welcome',
      },
      {
        path: '/device',
        routes: [
          {
            path: '/device/device',
            component: './Device/Device',
          },
          {
            path: '/device/grouping',
            component: './Device/Grouping',
          },
          {
            path: '/device/product',
            component: './Device/Product',
          },
          {
            path: '/device/share',
            component: './Device/Share',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
