import { Router } from 'express';
import passport from 'passport';
import type { ApiResponse, User } from '../types.js';

export const authRouter = Router();

// Инициация OAuth с Google
authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Callback после авторизации Google
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Успешная авторизация - редирект на клиент
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/`);
  }
);

// Получить текущего пользователя
authRouter.get('/user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const response: ApiResponse<User> = {
      success: true,
      data: req.user as User,
    };
    res.json(response);
  } else {
    const response: ApiResponse = {
      success: false,
      error: 'Not authenticated',
    };
    res.status(401).json(response);
  }
});

// Выход
authRouter.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      const response: ApiResponse = {
        success: false,
        error: 'Logout failed',
      };
      return res.status(500).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };
    res.json(response);
  });
});

// Health check для auth
authRouter.get('/status', (req, res) => {
  const response: ApiResponse = {
    success: true,
    data: {
      authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    },
  };
  res.json(response);
});

