import { APIError } from './auth'

// Use same-origin proxy paths by default so browser requests do not trigger CORS.
// Next dev server rewrites /api/chat/:path* -> http://localhost:8080/chat/api/chat/:path*
const DEFAULT_ALL_CHATS_URL = '/api/chat/getAllChats'
const DEFAULT_CREATE_CHAT_URL = '/api/chat/create-chat' // proxied by Next during dev; falls back to backend via env if provided
const DEFAULT_FETCH_MESSAGES_URL = '/api/chat/getNewMessage' // proxied by Next during dev; falls back to backend via env if provided
const DEFAULT_GET_ALL_MESSAGE_URL = '/api/chat/getAllMessage' // proxied by Next during dev; falls back to backend via env if provided


export async function fetchAllChats(){

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
  if (typeof console !== 'undefined' && console.debug) console.debug('fetchAllChats: calling', DEFAULT_ALL_CHATS_URL)
    
    // Prefer same-origin proxy path. If the env var contains the full backend URL
    // (e.g. http://localhost:8080/chat/api/chat/getAllChats) convert it to the
    // proxied client path (/api/chat/getAllChats) to avoid CORS in the browser.
    let url = DEFAULT_ALL_CHATS_URL
    const envUrl = process.env.NEXT_PUBLIC_ALL_CHATS_URL
    if (envUrl) {
      try {
        const parsed = new URL(envUrl)
        // if backend path contains /chat/api/chat, map to /api/chat
        if (parsed.pathname && parsed.pathname.startsWith('/chat/api/chat')) {
          url = '/api/chat' + parsed.pathname.replace('/chat/api/chat','')
        } else if (!parsed.protocol) {
          url = envUrl
        } else {
          // fallback: use env as-is (may be cross-origin)
          url = envUrl
        }
      } catch (e) {
        // envUrl is probably a relative path already
        url = envUrl
      }
    }
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
      const message = (data && data.message) || (rawText && String(rawText).slice(0, 512)) || `All chats fetch failed (${res.status})`
      const responsePayload = data || (rawText ? { text: rawText } : null)
      if (typeof console !== 'undefined' && console.error) console.error('fetchAllChats error', { status: res.status, response: responsePayload })
      throw new APIError(message, res.status, responsePayload)
    }

    // Success
    // Expecting { status: 'success', data: { user: {...} } }
    return { data }
  } catch (err) {
  if (err instanceof APIError) throw err
  if (typeof console !== 'undefined' && console.error) console.error('fetchAllChats unexpected error', err)
  throw new APIError(err && err.message ? err.message : 'Network error', 0, null)
  }

}


export async function createNewChat(payload){
  // payload expected to be an object, e.g. { userId: '...' } or { members: [...], name: '...' }
  let token = null
  try {
    token = localStorage.getItem('token')
  } catch (err) {
    throw new APIError('Unable to access local storage for auth token', 0, null)
  }

  if (!token) throw new APIError('Not authenticated', 401, null)

  try {
    let url = DEFAULT_CREATE_CHAT_URL
    const envCreate = process.env.NEXT_PUBLIC_CREATE_NEW_CHAT_URL
    if (envCreate) {
      try {
        const parsed = new URL(envCreate)
        if (parsed.pathname && parsed.pathname.startsWith('/chat/api/chat')) {
          url = '/api/chat' + parsed.pathname.replace('/chat/api/chat','')
        } else {
          url = envCreate
        }
      } catch (e) {
        url = envCreate
      }
    }
    if (typeof console !== 'undefined' && console.debug) console.debug('createNewChat: calling', url)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload || {})
    })

    let data = null
    let rawText = null
    try { data = await res.json() } catch (e) { try { rawText = await res.text() } catch (ee) { rawText = null } }

    if (!res.ok) {
      const message = (data && data.message) || (rawText && String(rawText).slice(0,512)) || `Create chat failed (${res.status})`
      const responsePayload = data || (rawText ? { text: rawText } : null)
      if (typeof console !== 'undefined' && console.error) console.error('createNewChat error', { status: res.status, response: responsePayload })
      throw new APIError(message, res.status, responsePayload)
    }

    return { data }
  } catch (err) {
    if (err instanceof APIError) throw err
    if (typeof console !== 'undefined' && console.error) console.error('createNewChat unexpected error', err)
    throw new APIError(err && err.message ? err.message : 'Network error', 0, null)
  }
}

export async function getNewMessage(payload){
   let token = null
  try {
    token = localStorage.getItem('token')
  } catch (err) {
    throw new APIError('Unable to access local storage for auth token', 0, null)
  }

  if (!token) throw new APIError('Not authenticated', 401, null)

   try {
    let url = DEFAULT_FETCH_MESSAGES_URL
    const envCreate = process.env.NEXT_PUBLIC_GET_NEW_MESSAGE_URL
    if (envCreate) {
      try {
        const parsed = new URL(envCreate)
        if (parsed.pathname && parsed.pathname.startsWith('/chat/api/chat')) {
          url = '/api/chat' + parsed.pathname.replace('/chat/api/chat','')
        } else {
          url = envCreate
        }
      } catch (e) {
        url = envCreate
      }
    }
    if (typeof console !== 'undefined' && console.debug) console.debug('createNewChat: calling', url)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload || {})
    })

    let data = null
    let rawText = null
    try { data = await res.json() } catch (e) { try { rawText = await res.text() } catch (ee) { rawText = null } }

    if (!res.ok) {
      const message = (data && data.message) || (rawText && String(rawText).slice(0,512)) || `Create chat failed (${res.status})`
      const responsePayload = data || (rawText ? { text: rawText } : null)
      if (typeof console !== 'undefined' && console.error) console.error('getNewMessage error', { status: res.status, response: responsePayload })
      throw new APIError(message, res.status, responsePayload)
    }

    return { data }
  } catch (err) {
    if (err instanceof APIError) throw err
    if (typeof console !== 'undefined' && console.error) console.error('getNewMessage unexpected error', err)
    throw new APIError(err && err.message ? err.message : 'Network error', 0, null)
  }

}

export async function getAllMessages(chatId){
  console.log("chatId",chatId)
 if (!chatId) throw new APIError('chatId is required', 0, null)
 let token = null
  try {
    token = localStorage.getItem('token')
  } catch (err) {
    throw new APIError('Unable to access local storage for auth token', 0, null)
  }

  if (!token) throw new APIError('Not authenticated', 401, null)
console.log("token",token)
   try {
    let url = DEFAULT_GET_ALL_MESSAGE_URL
    const envCreate = process.env.NEXT_PUBLIC_GET_ALL_MESSAGE_URL
    if (envCreate) {
      try {
        const parsed = new URL(envCreate)
        if (parsed.pathname && parsed.pathname.startsWith('/chat/api/chat')) {
          url = '/api/chat' + parsed.pathname.replace('/chat/api/chat','')
        } else {
          url = envCreate
        }
      } catch (e) {
        url = envCreate
      }
    }
    // Append chatId to the path (client-side proxy paths expect it)
    // Ensure no double-slash
    url = url.replace(/\/+$/,'') + '/' + encodeURIComponent(chatId)
    if (typeof console !== 'undefined' && console.debug) console.debug('GetAllMessage: calling', url)
console.log("url",url)
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      
    })

    let data = null
    let rawText = null
    try { data = await res.json() } catch (e) { try { rawText = await res.text() } catch (ee) { rawText = null } }

    if (!res.ok) {
      const message = (data && data.message) || (rawText && String(rawText).slice(0,512)) || `Create chat failed (${res.status})`
      const responsePayload = data || (rawText ? { text: rawText } : null)
      if (typeof console !== 'undefined' && console.error) console.error('GetAllMessage error', { status: res.status, response: responsePayload })
      throw new APIError(message, res.status, responsePayload)
    }

    return { data }
  } catch (err) {
    if (err instanceof APIError) throw err
    if (typeof console !== 'undefined' && console.error) console.error('GetAllMessage unexpected error', err)
    throw new APIError(err && err.message ? err.message : 'Network error', 0, null)
  }

}

export default { fetchAllChats, createNewChat, getNewMessage, getAllMessages }

