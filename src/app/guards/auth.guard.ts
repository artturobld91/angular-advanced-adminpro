import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    console.log('Auth JWT Token Guard');  
    return this.userService.validateToken()
      .pipe(
        tap( isAuthenticated => {
          if(!isAuthenticated)
          {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
}
