import { inject, Injectable } from '@angular/core';
import { AesEncryptionService } from '../security/aes-encryption.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly aesService = inject(AesEncryptionService);

  setItem(key: string, value: any, type: 'local' | 'session'): void {
    const encrypted = this.aesService.storageEncrypt(JSON.stringify(value));

    switch (type) {
      case 'local':
        localStorage.setItem(key, encrypted);
        break;
      case 'session':
        sessionStorage.setItem(key, encrypted);
        break;
    }
  }

  // Get item
  getItem<T>(key: string, type: 'local' | 'session'): T | null {
    let stored: string | null = null;

    switch (type) {
      case 'local':
        stored = localStorage.getItem(key);
        break;
      case 'session':
        stored = sessionStorage.getItem(key);
        break;
    }

    if (!stored) return null;
    const decrypted = this.aesService.storageDecrypt(stored);
    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  }

  // Remove item
  removeItem(key: string, type: 'local' | 'session'): void {
    switch (type) {
      case 'local':
        localStorage.removeItem(key);
        break;
      case 'session':
        sessionStorage.removeItem(key);
        break;
    }
  }

  clear(): void {
    sessionStorage.clear();
  }
}
