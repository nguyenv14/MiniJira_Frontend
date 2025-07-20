
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
    })
  } catch (error: any) {
    // Nuxt 3 $fetch error thường có response body trong error.data
    console.log(error);
    if (error?.response?.status === 400 || error?.status === 422) {
      return error.data || { message: error.message || 'Something went wrong', statusCode: 400 }
    }

    throw error
  }
}
