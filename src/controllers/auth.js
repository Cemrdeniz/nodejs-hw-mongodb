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
    const result = await authService.login(req, res); 
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
const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not found in cookies');
    }

    
    await Session.deleteOne({ refreshToken });

   
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      path: '/',
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.sendResetPasswordEmail(email);

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: result 
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
export default {
  registerUser,
  resetPassword,
  sendResetEmail,
  loginUser,
  refreshSession,
  logoutUser
};