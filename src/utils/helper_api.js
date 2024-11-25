export const getCartSessionId = () => {
  const cookies = document.cookie.split(';');
  const cartCookie = cookies.find(cookie => cookie.trim().startsWith('cart_session='));
  if (cartCookie) {
    return cartCookie.split('=')[1].trim();
  }
  return null;
};

export const setCartSessionId = (sessionId) => {
  document.cookie = `cart_session=${sessionId}; path=/; max-age=2592000; SameSite=Lax`;
}; 