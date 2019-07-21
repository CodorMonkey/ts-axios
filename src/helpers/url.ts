/**
 * # 基本用法
 * params: {
 *    a: 1,
 *    b: 2
 *  }
 * url 是 /base/get?a=1&b=2
 *
 * # 参数值为数组
 * params: {
 *    foo: ['bar', 'baz']
 *  }
 * 最终请求的 url 是 /base/get?foo[]=bar&foo[]=baz'。
 *
 * # 参数值为对象
 * params: {
 *    foo: {
 *      bar: 'baz'
 *    }
 *  }
 * 最终请求的 url 是 /base/get?foo=%7B%22bar%22:%22baz%22%7D，foo 后面拼接的是 {"bar":"baz"} encode 后的结果。
 *
 * # 参数值为 Date 类型
 * params: {
 *    date: new Date()
 *  }
 * 最终请求的 url 是 /base/get?date=2019-04-01T05:55:39.030Z，date 后面拼接的是 date.toISOString() 的结果。
 *
 * # 特殊字符支持
 * 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode。
 * params: {
 *    foo: '@:$, '
 *  }
 * 最终请求的 url 是 /base/get?foo=@:$+，注意，我们会把空格 转换成 +。
 *
 * # 空值忽略
 * 对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的。
 * params: {
 *    foo: 'bar',
 *    baz: null
 *  }
 * 最终请求的 url 是 /base/get?foo=bar。
 *
 * # 丢弃 url 中的哈希标记
 * url: '/base/get#hash',
 * params: {
 *    foo: 'bar'
 *  }
 * 最终请求的 url 是 /base/get?foo=bar
 *
 * # 保留 url 中已存在的参数
 * url: '/base/get?foo=bar',
 * params: {
 *    bar: 'baz'
 *  }
 * 最终请求的 url 是 /base/get?foo=bar&bar=baz
 */
import { isDate, isObject } from './util'

export function buildURL(url: string, params?: any): string {
  // 没有传递参数，直接返回url
  if (params == null) {
    return url
  }

  const queryList = Array<string>()
  Object.keys(params).forEach(key => {
    let val = params[key]

    // 如果值为null或者undefined，忽略
    if (val == null) {
      return
    }

    let values = []
    if (Array.isArray(val)) {
      //  如果值为数组
      key = `${key}[]`
      values = val
    } else {
      values = [val]
    }

    values.forEach(value => {
      if (isObject(value)) {
        //  如果值为对象
        value = JSON.stringify(value)
      } else if (isDate(value)) {
        //  如果值为Date
        value = value.toISOString()
      }

      queryList.push(`${encode(key)}=${encode(value)}`)
    })
  })

  if (queryList.length > 0) {
    //  丢弃url中的hash部分
    let hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }

    //  保留url中已有的参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + queryList.join('&')
  }
  return url
}

function encode(value: any): string {
  return encodeURIComponent(value)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
