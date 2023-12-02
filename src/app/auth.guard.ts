import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);

//   if (authService.isLoggedIn()) {
//     console.log("logged in successfully!");
//     return true;
//   }

//   // Redirect to the login page
//   return route.redirect('/signin');
// };

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1), // Take the first value emitted by the observable and complete
    map((isLoggedIn: boolean): boolean | UrlTree => {
      if (isLoggedIn) {
        console.log("Logged in successfully!");
        return true;
      } else {
        console.log("Not logged in, redirecting to signin page.");
        // Redirect to the login page
        return router.createUrlTree(['/signin']); // Use createUrlTree for redirection
      }
    })
  );
};
