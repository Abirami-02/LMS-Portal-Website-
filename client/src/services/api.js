const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const localDevelopmentApiUrl = 'http://localhost:5000/api'

if (!configuredApiUrl && import.meta.env.PROD) {
  throw new Error('VITE_API_URL must be configured for production builds')
}

if (configuredApiUrl && import.meta.env.PROD) {
  const configuredHostname = new URL(configuredApiUrl).hostname
  if (['localhost', '127.0.0.1', '::1'].includes(configuredHostname)) {
    throw new Error('Production builds must use a deployed API URL, not localhost')
  }
}

export const API_URL = (configuredApiUrl || (import.meta.env.DEV ? localDevelopmentApiUrl : '')).replace(/\/$/, '')

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  const isFormData = body instanceof FormData
  const requestHeaders = { ...headers }
  if (!isFormData) requestHeaders['Content-Type'] = 'application/json'
  if (token) requestHeaders.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

export async function getHealth() {
  return apiRequest('/health')
}
