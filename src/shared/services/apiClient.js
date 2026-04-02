const responseCache = new Map()
const STORAGE_PREFIX = 'weather-cache-v1:'

export const fetchJsonCached = async (url, ttlMs = 5 * 60_000) => {
  const cached = responseCache.get(url)
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data
  }
  try {
    const storageKey = `${STORAGE_PREFIX}${url}`
    const storedRaw = sessionStorage.getItem(storageKey)
    if (storedRaw) {
      const stored = JSON.parse(storedRaw)
      if (Date.now() - stored.timestamp < ttlMs) {
        responseCache.set(url, stored)
        return stored.data
      }
    }
  } catch {
    // Silent fallback if sessionStorage is blocked/unavailable.
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)
  const response = await fetch(url, { signal: controller.signal })
  clearTimeout(timeout)
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  const data = await response.json()
  const payload = { timestamp: Date.now(), data }
  responseCache.set(url, payload)
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${url}`, JSON.stringify(payload))
  } catch {
    // Ignore write errors in private mode or storage-restricted environments.
  }
  return data
}
