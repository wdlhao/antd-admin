/* global window  数据模型目录 */
import { router } from 'utils'
import { stringify } from 'qs'
import { ROLE_TYPE } from 'utils/constant'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import { queryLayout, pathMatchRegexp } from 'utils'
// 如何理解store?
import store from 'store'
// services/api.js中定义的方法集合对象;
// 路径别名，是在哪里设置的？:.umirc.js
import api from 'api'
import config from 'config'

const { queryRouteList, logoutUser, queryUserInfo } = api
console.log(store)
/**
  remove: ƒ (key)
  clearAll: ƒ ()
  set: ƒ (key, value)
  get: ƒ (key, optionalDefaultValue)
  addPlugin: ƒ (plugin)
  createStore: ƒ ()
  each: ƒ (callback)
  enabled: true
  hasNamespace: ƒ (namespace)
  namespace: ƒ (namespace)
  plugins: [ƒ]
  raw: {get: ƒ, set: ƒ, remove: ƒ, each: ƒ, clearAll: ƒ, …}
  storage: {name: "localStorage", read: ƒ, write: ƒ, each: ƒ, remove: ƒ, …}
  version: "2.0.12"
 */
console.log(api)
/**
  createUser: ƒ (data)
  loginUser: ƒ (data)
  logoutUser: ƒ (data)
  queryDashboard: ƒ (data)
  queryPostList: ƒ (data)
  queryRouteList: ƒ (data)
  queryUser: ƒ (data)
  queryUserInfo: ƒ (data)
  queryUserList: ƒ (data)
  queryWeather: ƒ (params)
  removeUser: ƒ (data)
  removeUserList: ƒ (data)
  updateUser: ƒ (data)
 */

export default {
  namespace: 'app',
  state: {
    routeList: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        zhName: '仪表盘',
        router: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      const isInit = store.get('isInit')
      if (isInit) return
      const { locationPathname } = yield select(_ => _.app)
      const { success, user } = yield call(queryUserInfo, payload)
      // 进行了相应的用户role权限判断；
      if (success && user) {
        const { list } = yield call(queryRouteList)
        const { permissions } = user
        let routeList = list
        if (
          permissions.role === ROLE_TYPE.ADMIN ||
          permissions.role === ROLE_TYPE.DEVELOPER
        ) {
          permissions.visit = list.map(item => item.id)
        } else {
          routeList = list.filter(item => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        store.set('routeList', routeList)
        store.set('permissions', permissions)
        store.set('user', user)
        store.set('isInit', true)
        // 路由数据的重新导航
        if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
          router.push({
            pathname: '/dashboard',
          })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },

    *signOut({ payload }, { call, put }) {
      const data = yield call(logoutUser)
      if (data.success) {
        store.set('routeList', [])
        store.set('permissions', { visit: [] })
        store.set('user', {})
        store.set('isInit', false)
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}

/**
 app.js，项目全局数据配置(在布局组件PrimaryLayout中有引用到)
 1.如何理解如下app.js封装方式?
  export default {
    namespace:'app',
    state:{},
    subscriptions:{},
    effects:{},
    reducers:{}
  }
  分析：dva,models默认数据结构;

  2. import { stringify } from 'qs' (已整理)
  3.如何理解import { store } from "store" ?
    理解：store为localStorage的替代解决方案；
    store.get('isInit')
    store.set('user', {})
    // Example store.js usage with npm
    var store = require('store')
    store.set('user', { name:'Marcus' })
    store.get('user').name == 'Marcus'







 */
