export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',
}




/**
  在src/services/api.js文件中，你会看到如下配置对象，对象的键用于调用时的函数名称，
  对象的值为请求的url，默认请求方式为GET，如果是其他请求方式对象的值的格式则为'method url'。






  
 */