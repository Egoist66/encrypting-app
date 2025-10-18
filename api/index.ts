import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import type { ApiResponse, EncryptRequest } from './types.js';
import { encryptText, decryptText } from './services/encryption.js';
import { configurePassport, verifyToken } from './config/passport.js';
import { authRouter } from './routes/auth.js';

// Настройка Passport
configurePassport();

// Создаем Express приложение для serverless function
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport middleware (без сессий)
app.use(passport.initialize());

// Auth routes
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: '✅ API работает!',
  };
  res.json(response);
});

// Middleware для проверки авторизации через JWT
const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please log in.',
      });
    }

    const user = verifyToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token.',
      });
    }

    // Добавляем пользователя в req для использования в роутах
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed.',
    });
  }
};

// Encrypt endpoint (защищен)
app.post('/api/encrypt', isAuthenticated, (req, res) => {
  try {
    const { text } = req.body as EncryptRequest;

    if (!text) {
      const response: ApiResponse = {
        success: false,
        error: 'Текст обязательный!',
      };
      return res.status(400).json(response);
    }

    const { encrypted, key } = encryptText(text);

    const response: ApiResponse = {
      success: true,
      data: { encrypted, key },
    };

    res.json(response);
  } catch (error) {
    console.error('Encryption error:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Не удалось зашифровать текст!',
    };
    res.status(500).json(response);
  }
});

// Decrypt endpoint (защищен)
app.post('/api/decrypt', isAuthenticated, (req, res) => {
  try {
    const { encrypted, key } = req.body;

    if (!encrypted || !key) {
      const response: ApiResponse = {
        success: false,
        error: 'Зашифрованный текст и ключ обязательны!',
      };
      return res.status(400).json(response);
    }

    const decrypted = decryptText(encrypted, key);

    const response: ApiResponse = {
      success: true,
      data: { decrypted },
    };

    res.json(response);
  } catch (error) {
    console.error('Ошибка расшифрования:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Не удалось расшифровать текст!',
    };
    res.status(500).json(response);
  }
});

// Export как serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  // @ts-ignore
  return app(req, res);
};

