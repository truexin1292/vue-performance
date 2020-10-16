import Vue from 'vue';
import Router from 'vue-router';
import routes from '../library/routes';

const Nested = () => import('@/components/nested');
const List = () => import('../listCacheToDetail/list');
const Detail = () => import('../listCacheToDetail/detail');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/demo',
    },
    {
      path: '/demo',
      name: 'demo',
      component: Nested,
      children: routes,
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail,
    },
    {
      path: '/list',
      name: 'list',
      component: List,
      meta: {
        keepAlive: true,
      },
    },
  ],
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
