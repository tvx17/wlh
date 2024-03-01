import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/gui/layouts/main.vue'),
    children: [
      { path: '', component: () => import('src/gui/pages/texts.vue') },
      { path: 'projects', component: () => import('src/gui/pages/projects.vue') },
      { path: 'users', component: () => import('src/gui/pages/users.vue') },
      { path: 'books', component: () => import('src/gui/pages/books.vue') },
      { path: 'chapters', component: () => import('src/gui/pages/chapters.vue') },
      { path: 'texts', component: () => import('src/gui/pages/texts.vue') }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/gui/pages/ErrorNotFound.vue')
  }
];

export default routes;
