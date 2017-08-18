// /**
//  * Created by Lanny on 2017/8/18.
//  */
// let root = 'https://cnodejs.org/api/v1';
//
// // let request = require('superagent');
// import request from 'superagent';
// // 自定义判断元素类型JS
// function toType(obj) {
//   return ({}).toString().call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
// }
//
// // 参数过滤函数
// function filter_null(o) {
//   for (let key in o) {
//     if (o[key] === null) {
//       delete o[key];
//     }
//
//     if (toType(o[key]) === 'string') {
//       o[key] = o[key].trim();
//       if (o[key].length === 0) {
//         delete o[key];
//       }
//     }
//   }
//
//   return o;
// }
//
// /**
//  * 接口处理函数
//  这个函数每个项目都是不一样的，我现在调整的是适用于
//  https://cnodejs.org/api/v1 的接口，如果是其他接口
//  需要根据接口的参数进行调整。参考说明文档地址：
//  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
//  * @param method
//  * @param url
//  * @param params
//  * @param successCallback
//  * @param failureCallback
//  * @private
//  */
// function _api_base(method, url, params, successCallback, failureCallback) {
//   let r = request(method, url).type('text/plain');
//   if (params) {
//     params = filter_null(params);
//     if (method === 'POST' || method === 'PUT') {
//       if (toType(params) === 'object') {
//         params = JSON.stringify(params)
//       }
//       r = r.send(params)
//     } else if (method === 'GET' || method === 'DELETE') {
//       r = r.query(params)
//     }
//   }
//
//   r.end(function (error, response) {
//     if (error) {
//       alert('api error, HTTP CODE: ' + response.status);
//       return;
//     }
//
//     if (response.body.success) {
//       if (successCallback) {
//         successCallback(response.body);
//       }
//     } else {
//       if (failureCallback) {
//         failureCallback(response.body)
//       } else {
//         alert('error: ' + JSON.stringify(response.body))
//       }
//     }
//   })
// }
//
// export default {
//   get: function (url, params, success, failure) {
//     return _api_base('GET', root + '/' + url, params, success, failure);
//   },
//
//   post: function (url, params, success, failure) {
//     return _api_base('POST', root + '/' + url, params, success, failure);
//   },
//
//   put: function (url, params, success, failure) {
//     return _api_base('PUT', root + '/' + url, params, success, failure);
//   },
//
//   delete: function (url, params, success, failure) {
//     return _api_base('DELETE', root + '/' + url, params, success, failure)
//   }
// }

let root = process.env.API_ROOT;

let axios = require('axios');
// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

function apiAxios(method, url, params, success, failure) {
  if (params) {
    params = filterNull(params);
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false
  }).then(function (response) {
    if (response.data.success === true) {
      if (success) {
        success(response.data)
      }
    } else {
      if (failure) {
        failure(response.data)
      } else {
        window.alert('error:' + JSON.stringify(response.data));
      }
    }
  }).catch(function (error) {
    let res = error.response;
    if (error) {
      window.alert('api error, HTTP CODE: ' + res.status);
      return
    }
  })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}

