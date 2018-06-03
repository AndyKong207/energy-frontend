import fetch from 'dva/fetch'
import {message} from 'antd'

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
//
// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default function request(url, options) {
//   return fetch(url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(data => ({ data }))
//     .catch(err => ({ err }));
// }
export default async function (url, payload, silent = false) {

  const res = await _request(...arguments)
  console.log('===', res)
  return res

  async function _request(url, payload) {

    const headers = {}

    const is_form_data = payload instanceof FormData

    headers['Content-Type'] = is_form_data ? 'multipart/form-data' : 'application/json'

    const options = {
      method: 'POST',
      headers,
      body: is_form_data ? payload : JSON.stringify(payload),
      credentials: 'include'
    }

    let response = {}


    try {
      response = await fetch(url, options)
    } catch (e) {
      notify('error', '网络连接异常')
      return {
        _success: false,
        _message: e.message
      }
    }

    if (response.status === 503) {
      notify('error', '请求过于频繁')
      return {
        _success: false,
        _code: response.status
      }
    }

    if (response.status !== 200) {
      const text = response.statusText
      const message = text || '网络异常，请稍后重试'
      notify('error', message)
      return {
        _success: false,
        _message: message,
        _code: response.status
      }
    }

    let json = {}
    try {
      json = await response.json()
    } catch (e) {
      return {_success: false, _message: e.message}
    }
    const {data, code, message} = json

    if (code === 402) return json

    if (code === 401) {
      const location = window.location
      return {
        _success: false,
        _message: message,
        _code: code
      }
    }

    if (code === 403) {
      notify('warn', message)
      return {
        _success: false,
        _message: message,
        _code: code
      }
    }

    if (code !== 200) {
      notify('error', message)
      return {
        _success: false,
        _message: message,
        _code: code
      }
    }

    if (data != null && typeof data === 'object') data._success = true

    return data
  }
  function notify(type = 'error', msg) {
    if (silent) return
    message[type](msg,  2)
  }
}
