export function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get("token")
}

export function storeToken(token: string) {
  localStorage.setItem("app_token", token)
}

export function getStoredToken() {
  return localStorage.getItem("app_token")
}

export function initToken() {
  const urlToken = getTokenFromUrl()
  if (urlToken) storeToken(urlToken)
  return getStoredToken()
}
