import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private userService: UserService,
              private router: Router){}

  canLoad(route: import("@angular/router").Route, segments: import("@angular/router").UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    console.log('[canLoad] - Auth JWT Token Guard');  
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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      console.log('[canActivate] - Auth JWT Token Guard');    
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
