import { APIError } from './auth'

const DEFAULT_PROFILE_URL =  'http://localhost:8080/auth/api/auth/profile'

export async function fetchProfile() {
  // Read token from localStorage (stored by login/signup flows)
  let token = null
  try {
    token = localStorage.getItem('token')
  } catch (err) {
    // localStorage may be unavailable in some environments
    throw new APIError('Unable to access local storage for auth token', 0, null)
  }

  if (!token) throw new APIError('Not authenticated', 401, null)

  try {
    // Debug: indicate we're about to call the profile endpoint
    // (avoid logging raw token)
    if (typeof console !== 'undefined' && console.debug) console.debug('fetchProfile: calling', DEFAULT_PROFILE_URL)
     
    const url = process.env.NEXT_PUBLIC_PROFILE_URL || DEFAULT_PROFILE_URL
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    // Try parse JSON, but fall back to text when server responds with non-json
    let data = null
    let rawText = null
    try {
      data = await res.json()
    } catch (err) {
      try {
        rawText = await res.text()
      } catch (e) {
        rawText = null
      }
    }

    if (!res.ok) {
      // prefer structured message from JSON body, fall back to raw text
      const message = (data && data.message) || (rawText && String(rawText).slice(0, 512)) || `Profile fetch failed (${res.status})`
      const responsePayload = data || (rawText ? { text: rawText } : null)
      if (typeof console !== 'undefined' && console.error) console.error('fetchProfile error', { status: res.status, response: responsePayload })
      throw new APIError(message, res.status, responsePayload)
    }

    // Success
    // Expecting { status: 'success', data: { user: {...} } }
    return { data }
  } catch (err) {
    if (err instanceof APIError) throw err
    if (typeof console !== 'undefined' && console.error) console.error('fetchProfile unexpected error', err)
    throw new APIError(err && err.message ? err.message : 'Network error', 0, null)
  }
}

export default { fetchProfile }
