import { Injectable, signal } from '@angular/core';
import { TenantResolveDto } from '../../library/models/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class TenantContext {
  private readonly tenantState = signal<TenantResolveDto | null>(null);

  readonly tenant = this.tenantState.asReadonly();

  setTenant(tenant: TenantResolveDto): void {
    this.tenantState.set(tenant);
  }

  clear(): void {
    this.tenantState.set(null);
  }
}
