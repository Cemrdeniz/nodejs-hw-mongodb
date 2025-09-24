import authService from '../services/auth.js';
import Session from '../models/session.js';

const registerUser = async (req, res, next) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: result,
  });
};


const loginUser = async (req, res, next) => {
  try {
    const result = await authService.login(req, res); // req ve res gerekiyor çünkü cookie set edilecek
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken: result }
    });
  } catch (error) {
    next(error);
  }
};
const refreshSession = async (req, res, next) => {
  try {
    const newAccessToken = await authService.refresh(req, res);
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken }
    });
  } catch (error) {
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not found in cookies');
    }

    // Oturumu sil (refreshToken ile eşleşen)
    await Session.deleteOne({ refreshToken });

    // Refresh token çerezi temizle
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // üretim ortamıysa secure olsun
      sameSite: 'strict',
      path: '/',
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
export default {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser
};