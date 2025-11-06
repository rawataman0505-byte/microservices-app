/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy any client requests to /api/chat/* to the backend to avoid CORS in development.
      // Example: fetch('/api/chat/create-chat') -> http://localhost:8080/chat/api/chat/create-chat
      {
        source: '/api/chat/:path*',
        destination: process.env.NEXT_PUBLIC_CREATE_NEW_CHAT_URL
          ? process.env.NEXT_PUBLIC_CREATE_NEW_CHAT_URL.replace('/create-chat','/:path*')
          : 'http://localhost:8080/chat/api/chat/:path*',
      },
      // Proxy any client requests to /api/auth/* to the backend to avoid CORS in development.
      // Example: fetch('/api/auth/login') -> http://localhost:8080/auth/api/auth/login
      {
        source: '/api/auth/:path*',
        destination: process.env.NEXT_PUBLIC_LOGIN_URL
          ? process.env.NEXT_PUBLIC_LOGIN_URL.replace('/login','/:path*').replace('/signup','/:path*').replace('/profile','/:path*')
          : 'http://localhost:8080/auth/api/auth/:path*',
      },
    ]
  }
}

module.exports = nextConfig
