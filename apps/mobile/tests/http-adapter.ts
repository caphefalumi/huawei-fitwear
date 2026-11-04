import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"

const { AxiosError } = jest.requireActual("axios")

// Only replace network I/O. Real Axios transforms and interceptors still execute.
export const request = jest.fn<Promise<AxiosResponse<unknown>>, [InternalAxiosRequestConfig]>()

export async function httpAdapter(config: InternalAxiosRequestConfig) {
  const reply = await request(config)
  const response = { ...reply, headers: reply.headers ?? {}, config }
  if (config.validateStatus && !config.validateStatus(response.status)) {
    throw new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, undefined, response)
  }
  return response
}
