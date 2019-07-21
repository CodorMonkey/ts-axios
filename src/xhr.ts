import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { url, method = 'get', params, data = null } = config

  let request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)
  request.send(data)
}
