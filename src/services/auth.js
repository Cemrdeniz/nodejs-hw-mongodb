import User from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  const savedUser = await user.save();

  const userObject = savedUser.toObject();
  delete userObject.password;

  return userObject;
};
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token found');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const existingSession = await Session.findOne({ userId: payload.userId, refreshToken });
  if (!existingSession) {
    throw createHttpError(401, 'Session not found');
  }

  // oturumu sil
  await Session.deleteOne({ _id: existingSession._id });

  
  const accessToken = generateToken(payload.userId, process.env.ACCESS_TOKEN_SECRET, accessTokenExpiresIn);
  const newRefreshToken = generateToken(payload.userId, process.env.REFRESH_TOKEN_SECRET, refreshTokenExpiresIn);

  const session = new Session({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenExpiresIn),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenExpiresIn)
  });

  await session.save();

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiresIn,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return accessToken;
};
const accessTokenExpiresIn = 15 * 60 * 1000; // 15 dakika
const refreshTokenExpiresIn = 30 * 24 * 60 * 60 * 1000; // 30 gün

const generateToken = (userId, secret, expiresInMs) => {
  return jwt.sign({ userId }, secret, { expiresIn: Math.floor(expiresInMs / 1000) });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw createHttpError(401, 'Invalid credentials');
  }

 
  await Session.deleteMany({ userId: user._id });

  const accessToken = generateToken(user._id, process.env.ACCESS_TOKEN_SECRET, accessTokenExpiresIn);
  const refreshToken = generateToken(user._id, process.env.REFRESH_TOKEN_SECRET, refreshTokenExpiresIn);

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenExpiresIn),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenExpiresIn)
  });

  await session.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiresIn,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return accessToken;
};
export default {
  register,
  login,
  refresh
};
