import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserSignal } from '../services/signals/user.signal';

export const authGuard: CanActivateFn = (_route, state) => {
  const userSignal = inject(UserSignal);
  const router = inject(Router);

  return userSignal.accessToken()
    ? true
    : router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
};

export const loginGuard: CanActivateFn = () => {
  const userSignal = inject(UserSignal);
  const router = inject(Router);

  return userSignal.accessToken() ? router.createUrlTree(['/dashboard']) : true;
};

export const defaultRouteGuard: CanActivateFn = () => {
  const userSignal = inject(UserSignal);
  const router = inject(Router);

  return router.createUrlTree([userSignal.accessToken() ? '/dashboard' : '/login']);
};
