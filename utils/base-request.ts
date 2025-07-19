
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions<T> {
  method: HttpMethod
  body?: T
  auth?: boolean
  headers?: HeadersInit
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {}
  if (headers instanceof Headers) {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }
  return headers
}

export const useRequest = async <
  TRequest extends BodyInit | Record<string, any> | null | undefined = any,
  TResponse = any
>(
  url: string,
  options: RequestOptions<TRequest>
): Promise<TResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...normalizeHeaders(options.headers)
  }

  const token = localStorage.getItem('accessToken')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    return await $fetch<TResponse>(url, {
      method: options.method,
      body: options.body,
      headers,
      onResponseError({ response }) {
        // Bạn có thể log ra hoặc không làm gì
        console.log('Custom error:', response.status)
      }
    })
  } catch (error: any) {
    // Nuxt 3 $fetch error thường có response body trong error.data
    if (error?.response?.status === 400 || error?.status === 400) {
      return error.error // hoặc error.response._d
    }

    throw error
  }
}
