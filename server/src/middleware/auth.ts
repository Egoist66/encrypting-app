import { Request, Response, NextFunction } from 'express';

// Middleware для проверки аутентификации
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    error: 'Unauthorized. Please log in.',
  });
};

// Middleware для проверки JWT токена (для Vercel)
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
    });
  }

  // В продакшене добавить проверку JWT
  // Для простоты сейчас пропускаем
  next();
};

