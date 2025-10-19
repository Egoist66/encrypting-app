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
try {
  configurePassport();
  console.log('✅ Passport configured successfully');
} catch (error) {
  console.error('❌ Passport configuration failed:', error);
}

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
app.use('/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: '✅ API работает!',
    data: {
      env: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasJwtSecret: !!process.env.JWT_SECRET,
        clientUrl: process.env.CLIENT_URL,
        serverUrl: process.env.SERVER_URL,
      }
    }
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
app.post('/encrypt', isAuthenticated, (req, res) => {
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
app.post('/decrypt', isAuthenticated, (req, res) => {
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
  try {
    console.log(`📝 ${req.method} ${req.url}`, {
      headers: req.headers,
      query: req.query,
      body: req.body ? 'Body present' : 'No body',
      env: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasJwtSecret: !!process.env.JWT_SECRET,
        clientUrl: process.env.CLIENT_URL,
        serverUrl: process.env.SERVER_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
    // Добавляем обработку CORS preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // @ts-ignore
    return app(req, res);
  } catch (error) {
    console.error('❌ Serverless function error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers
    });
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

