import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import type { ApiResponse, EncryptRequest } from '../server/src/types.js';
import { encryptText, decryptText } from '../server/src/services/encryption.js';
import { configurePassport } from '../server/src/config/passport.js';
import { authRouter } from '../server/src/routes/auth.js';

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

// Session middleware для Vercel
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // В продакшене всегда HTTPS
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Middleware для проверки авторизации
const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    success: false,
    error: 'Unauthorized. Please log in.',
  });
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

