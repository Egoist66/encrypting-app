import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { User, GoogleProfile } from '../types.js';

// Хранилище пользователей (в продакшене использовать БД)
const users = new Map<string, User>();

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${process.env.SERVER_URL || 'http://localhost:3001'}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        // Преобразуем профиль Google в нашего пользователя
        const googleProfile = profile as unknown as GoogleProfile;
        
        const user: User = {
          id: googleProfile.id,
          email: googleProfile.emails[0]?.value || '',
          name: googleProfile.displayName,
          picture: googleProfile.photos[0]?.value,
          createdAt: new Date(),
        };

        // Сохраняем или обновляем пользователя
        users.set(user.id, user);

        return done(null, user);
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

export { users };

