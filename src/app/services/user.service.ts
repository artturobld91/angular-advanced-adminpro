import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators'; // tap: This operator triggers a secondary efect
import { of, Observable } from 'rxjs'; //of RX operator that creates an observable of certain type
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';

declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 
                
                this.googleInit();

              }

  createUser(formData: RegisterForm){
    console.log('Creating User');

    return this.http.post(`${base_url}/users`, formData)
                .pipe(
                  tap( (res: any) => {
                      localStorage.setItem('token', res.token)
                  })
                );
  }

  login(formData: LoginForm){
    console.log('Login User');

    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (res: any) => {
                      localStorage.setItem('token', res.token)
                  })
                );
  }

  loginGoogle( token ){
    console.log('Login User');

    return this.http.post(`${base_url}/login/google`, {token})
                .pipe(
                  tap( (res: any) => {
                      localStorage.setItem('token', res.token)
                  })
                );
  }

  validateToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (res:any) => {
        localStorage.setItem('token', res.token)
      }),
      map( res => true),
      catchError( error => of(false) ) //of RX operator that creates an observable of certain type
    )

  }

  logout(){
    localStorage.removeItem('token');
    
    this.auth2.signOut().then( () => {

      this.ngZone.run(() => {
        console.log('User signed out.');
        this.router.navigateByUrl('/login');
      })
      
    });
  }

  googleInit()
  {

    return new Promise(resolve => {
      console.log('Google Init')
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '1027678957256-ulq5lkgiqsje3951menrbq5isdi66inf.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });

        resolve();

      });

    })
  }

}