import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import type { User, GoogleProfile } from '../types.js';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-this';

// Хранилище пользователей (в продакшене использовать БД)
const users = new Map<string, User>();

export const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const serverURL = process.env.SERVER_URL || 'http://localhost:3001';
  
  console.log('🔧 Configuring Passport...');
  console.log('📋 Environment check:', {
    hasClientID: !!clientID,
    hasClientSecret: !!clientSecret,
    clientIDLength: clientID ? clientID.length : 0,
    clientSecretLength: clientSecret ? clientSecret.length : 0,
    clientIDPreview: clientID ? `${clientID.substring(0, 10)}...` : 'undefined',
    clientSecretPreview: clientSecret ? `${clientSecret.substring(0, 10)}...` : 'undefined',
    serverURL,
    callbackURL: `${serverURL}/api/auth/google/callback`,
    allEnvVars: {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      JWT_SECRET: !!process.env.JWT_SECRET,
      CLIENT_URL: !!process.env.CLIENT_URL,
      SERVER_URL: !!process.env.SERVER_URL,
      NODE_ENV: process.env.NODE_ENV
    }
  });
  
  // Более детальная проверка переменных окружения
  if (!clientID) {
    console.error('❌ GOOGLE_CLIENT_ID is missing or empty');
    console.error('❌ All environment variables:', Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('JWT') || key.includes('CLIENT') || key.includes('SERVER')));
    throw new Error('GOOGLE_CLIENT_ID environment variable is required but not set.');
  }
  
  if (!clientSecret) {
    console.error('❌ GOOGLE_CLIENT_SECRET is missing or empty');
    console.error('❌ All environment variables:', Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('JWT') || key.includes('CLIENT') || key.includes('SERVER')));
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is required but not set.');
  }
  
  if (clientID.trim() === '') {
    console.error('❌ GOOGLE_CLIENT_ID is empty string');
    throw new Error('GOOGLE_CLIENT_ID environment variable is set but empty.');
  }
  
  if (clientSecret.trim() === '') {
    console.error('❌ GOOGLE_CLIENT_SECRET is empty string');
    throw new Error('GOOGLE_CLIENT_SECRET environment variable is set but empty.');
  }
  
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${serverURL}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔍 Google profile received:', profile.id);
          
          // Преобразуем профиль Google в нашего пользователя
          const googleProfile = profile as unknown as GoogleProfile;
          
          const user: User = {
            id: googleProfile.id,
            email: googleProfile.emails[0]?.value || '',
            name: googleProfile.displayName,
            picture: googleProfile.photos[0]?.value,
            createdAt: new Date(),
          };

          console.log('👤 User created:', user.email);

          // Сохраняем или обновляем пользователя
          users.set(user.id, user);

          return done(null, user);
        } catch (error) {
          console.error('❌ Error in Google strategy:', error);
          return done(error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    const user = users.get(id);
    done(null, user || null);
  });
};

// Функция для создания JWT токена
export const createToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Функция для верификации JWT токена
export const verifyToken = (token: string): User | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      createdAt: new Date(decoded.iat * 1000),
    };
  } catch (error) {
    return null;
  }
};

export { users };

