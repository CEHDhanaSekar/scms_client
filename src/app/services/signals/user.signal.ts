import { computed, inject, Injectable, signal } from '@angular/core';
import { TenantAuthResponseDto } from '../../library/models/auth.model';
import { StorageService } from '../common/storage.service';

export interface AuthSessionData {
  user: TenantAuthResponseDto['user'];
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
}

const AUTH_SESSION_KEY = 'scms.auth';

@Injectable({
  providedIn: 'root',
})
export class UserSignal {
  private readonly storage = inject(StorageService);
  private readonly authState = signal<AuthSessionData | null>(this.loadSession());

  readonly user = computed(() => this.authState()?.user ?? null);
  readonly accessToken = computed(() => this.authState()?.accessToken ?? null);
  readonly refreshToken = computed(() => this.authState()?.refreshToken ?? null);
  readonly isAuthenticated = computed(() => !!this.authState());

  setSession(auth: TenantAuthResponseDto): void {
    const session: AuthSessionData = {
      user: auth.user,
      accessToken: auth.accessToken,
      accessExpiresAt: auth.accessExpiresAt,
      refreshToken: auth.refreshToken,
    };

    this.authState.set(session);
    this.storage.setItem(AUTH_SESSION_KEY, session, 'session');
  }

  getSession(): AuthSessionData | null {
    return this.authState();
  }

  clearSession(): void {
    this.authState.set(null);
    this.storage.removeItem(AUTH_SESSION_KEY, 'session');
  }

  private loadSession(): AuthSessionData | null {
    const session = this.storage.getItem<AuthSessionData>(AUTH_SESSION_KEY, 'session');

    if (
      !session?.user ||
      !session.accessToken ||
      !session.accessExpiresAt ||
      !session.refreshToken
    ) {
      return null;
    }

    return session;
  }
}
