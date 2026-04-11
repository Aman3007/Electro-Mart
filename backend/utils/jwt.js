const jwt = require('jsonwebtoken');

const isProduction = process.env.NODE_ENV === 'production';

// Centralized cookie options
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,                // Required for cross-origin cookies in production
  sameSite: isProduction ? 'none' : 'lax'
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET + '_refresh',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth/refresh'
  });

};

const clearTokenCookies = (res) => {

  res.clearCookie('accessToken', {
    ...cookieOptions
  });

  res.clearCookie('refreshToken', {
    ...cookieOptions,
    path: '/api/auth/refresh'
  });

};

module.exports = {
  generateTokens,
  setTokenCookies,
  clearTokenCookies
};
