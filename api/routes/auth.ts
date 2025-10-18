import { Router } from 'express';
import passport from 'passport';
import type { ApiResponse, User } from '../types.js';
import { createToken, verifyToken } from '../config/passport.js';

export const authRouter = Router();

// Инициация OAuth с Google
authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // Отключаем сессии
  })
);

// Callback после авторизации Google
authRouter.get(
  '/google/callback',
  (req, res, next) => {
    console.log('🔄 Google callback received');
    next();
  },
  passport.authenticate('google', {
    session: false, // Отключаем сессии
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`,
  }),
  (req, res) => {
    try {
      console.log('✅ Google authentication successful');
      
      // Создаем JWT токен
      const user = req.user as User;
      console.log('👤 User:', user?.email);
      
      if (!user) {
        console.error('❌ No user in request');
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=no_user`);
      }
      
      const token = createToken(user);
      console.log('🔑 Token created successfully');

      // Устанавливаем токен в cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
      });

      console.log('🍪 Cookie set, redirecting to client');
      
      // Успешная авторизация - редирект на клиент
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/`);
    } catch (error) {
      console.error('❌ Auth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=token_failed`);
    }
  }
);

// Получить текущего пользователя
authRouter.get('/user', (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      const response: ApiResponse = {
        success: false,
        error: 'Not authenticated',
      };
      return res.status(401).json(response);
    }

    const user = verifyToken(token);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid token',
      };
      return res.status(401).json(response);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };
    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Authentication error',
    };
    res.status(500).json(response);
  }
});

// Выход
authRouter.post('/logout', (req, res) => {
  try {
    // Удаляем cookie с токеном
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    const response: ApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };
    res.json(response);
  } catch (error) {
    console.error('Logout error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Logout failed',
    };
    res.status(500).json(response);
  }
});

// Health check для auth
authRouter.get('/status', (req, res) => {
  const token = req.cookies.auth_token;
  const user = token ? verifyToken(token) : null;
  
  const response: ApiResponse = {
    success: true,
    data: {
      authenticated: !!user,
    },
  };
  res.json(response);
});

