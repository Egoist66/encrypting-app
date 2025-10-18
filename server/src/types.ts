// API Response типы
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Тип для пользователя
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt?: Date;
}

// Данные из Google OAuth
export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

// Пример типа для запроса авторизации
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Типы для шифрования
export interface EncryptRequest {
  text: string;
  key?: string;
}

export interface EncryptResponse {
  encrypted: string;
  key: string;
}

export interface DecryptRequest {
  encrypted: string;
  key: string;
}

export interface DecryptResponse {
  decrypted: string;
}

