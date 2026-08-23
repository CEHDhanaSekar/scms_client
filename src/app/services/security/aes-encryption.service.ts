import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AesEncryptionService {
  private readonly secretKey = environment.aes_secret_key;

  storageEncrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  storageDecrypt(data: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }
}
