/**
 * @param {string} token
 * @returns {object|null}
 */
export const decodeAccessToken = (token) => {
  if (!token) {
    console.error("No token provided.");
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    console.error("Invalid JWT format. Token must have three parts.");
    return null;
  }

  const payload = parts[1];

  try {
    // atob() works on Base64, so we must convert from Base64URL first
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error("Failed to decode or parse the JWT payload:", e);
    return null;
  }
};

// Example usage
// const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTYyMzU3MDAwMH0.1_K2P_qX-3e-x-u6Z3b-K2-Q-G3b-N2-D-e-q-e-3e-w';
// const payload = decodeAccessToken(sampleToken);
// console.log(payload); // Expected output: { userId: '12345', email: 'johndoe@gmail.com', role: admin }
