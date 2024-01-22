import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  // return false;
  const router = inject(Router);
  const isLoggedIn =  localStorage.getItem('isAdminLoggedIn');

  if (isLoggedIn) {
    console.log("logged in successfully!");
    return true;
  }

  return router.createUrlTree(['/']);
};
