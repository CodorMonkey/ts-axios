import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformData } from './helpers/data'

function axios(config: AxiosRequestConfig) {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AxiosRequestConfig) {
  const { url, params, data } = config

  // 构造url
  config.url = buildURL(url, params)
  // 转换data数据
  config.data = transformData(data)
}

export default axios
