import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)


const mainRoutes = [{
  path: '/',
  component: ()=>import('@/views/main'),
  name: 'main',
  redirect: {
    name: 'home'
  },
  meta: {
    title: '主入口整体布局'
  },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {
      path: '/home',
      component: Home,
      name: 'home',
      meta: {
        title: '首页'
      }
    },
    // {
    //   path: '/theme',
    //   component: _import('common/theme'),
    //   name: 'theme',
    //   meta: {
    //     title: '主题'
    //   }
    // }
  ],
  // beforeEnter(to, from, next) {
  //   let token = Vue.cookie.get('token')
  //   if (!token || !/\S/.test(token)) {
  //     clearLoginInfo()
  //     next({
  //       name: 'login'
  //     })
  //   }
  //   next()
  // }
}]
const moduleRoutes = 
{
  path: '/home',
  component: Home,
  name: 'home',
  meta: {
    title: '首页'
  }
}
//   {
//     path: '/',
//     name: 'home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  // }



const router = new VueRouter({
  routes:mainRoutes.concat(moduleRoutes)
})

router.beforeEach((to, from, next) => {
  // ${//to and from are Route Object,next() must be called to resolve the hook}
  return next()
})


export default router