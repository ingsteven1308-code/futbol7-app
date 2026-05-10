const getCookieValue = (key: string) => {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${encodeURIComponent(key)}=`))
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

const setCookieValue = (key: string, value: string) => {
  if (typeof document === 'undefined') return
  const isSecure = window.location.protocol === 'https:'
  const maxAge = 60 * 60 * 24 * 30
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${
    isSecure ? '; Secure' : ''
  }`
}

const removeCookieValue = (key: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`
}

const cookieStorage = {
  getItem(key: string) {
    return getCookieValue(key)
  },
  setItem(key: string, value: string) {
    setCookieValue(key, value)
  },
  removeItem(key: string) {
    removeCookieValue(key)
  },
}

export default cookieStorage
