const toString = Object.prototype.toString

/**
 * 是否是Object
 * @param value
 */
export function isObject(value: any): value is Object {
  return value != null && typeof value === 'object'
}

/**
 * 是否是对象字面量
 * @param value
 */
export function isPlainObject(value: any): value is Object {
  return toString.call(value) === '[object Object]'
}

/**
 * 是否是Date
 * @param value
 */
export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]'
}
