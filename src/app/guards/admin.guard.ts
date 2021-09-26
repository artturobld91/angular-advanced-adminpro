import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private userService: UserService,
                private router: Router ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      

      console.log('Admin Guard')
      //return (this.userService.role === 'ADMIN_ROLE') ? true : false;

       if(this.userService.role === 'ADMIN_ROLE'){
         return true;
       }
       else{
         this.router.navigateByUrl('/dashboard');
         return false;
       }

  }
  
}
