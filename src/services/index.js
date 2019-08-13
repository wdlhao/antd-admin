import request from 'utils/request'       // 统一的axios请求方法
import { apiPrefix } from 'utils/config'  // '/api/v1'

import api from './api'  // API配置路径对象

const gen = params => {
  let url = apiPrefix + params
  let method = 'GET'
  
  /**
    如：params:'POST /user',
     method = 'POST',
     url = '/api/v1/user'

   */
  const paramsArray = params.split(' ')   // []
  if (paramsArray.length === 2) { //其他请求方法
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  return function(data) {
    return request({
      url,
      data,
      method,
    })
  }
}
/**
    对api配置进行遍历，每个属性都返回对应的封装后的request函数。
    生成对象函数
 */
const APIFunction = {}
for (const key in api) {
  APIFunction[key] = gen(api[key])
}

APIFunction.queryWeather = params => {
  params.key = 'i7sau1babuzwhycn'
  return request({
    url: `${apiPrefix}/weather/now.json`,
    data: params,
  })
}

console.log(APIFunction);
export default APIFunction
