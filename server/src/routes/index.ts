import { Router } from 'express';
import type { ApiResponse, EncryptRequest, EncryptResponse } from '../types.js';
import { encryptText, decryptText } from '../services/encryption.js';
import { isAuthenticated } from '../middleware/auth.js';

export const router = Router();

// Health check
router.get('/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: '✅ API работает!',
  };
  res.json(response);
});

// Encrypt endpoint (защищен авторизацией)
router.post('/encrypt', isAuthenticated, (req, res) => {
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

    const response: ApiResponse<EncryptResponse> = {
      success: true,
      data: { encrypted, key },
    };

    res.json(response);
  } catch (error) {
    console.error('Ошибка шифрования:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Не удалось зашифровать текст!',
    };
    res.status(500).json(response);
  }
});

// Decrypt endpoint (защищен авторизацией)
router.post('/decrypt', isAuthenticated, (req, res) => {
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

// Example endpoint
router.get('/example', (req, res) => {
  const response: ApiResponse = {
    success: true,
    data: {
      message: 'Это пример endpoint',
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

