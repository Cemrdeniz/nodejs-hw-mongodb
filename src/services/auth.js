import User from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

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
export const sendResetPasswordEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, "User not found!");

  // 5 dakikalık JWT token
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 5 minutes.</p>`,
    });

    console.log("Mail gönderildi, response:", info);

    // **Token ve reset linkini geri döndür**
    return { token, resetLink };

  } catch (err) {
    console.error("Mail gönderilemedi:", err);
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }
};

export const resetPassword = async (token, newPassword) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, "User not found!");

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Kullanıcının tüm mevcut oturumlarını sil
  await Session.deleteMany({ userId: user._id });
};
export default {
  register,
  resetPassword,
  sendResetPasswordEmail,
  login,
  refresh
};
