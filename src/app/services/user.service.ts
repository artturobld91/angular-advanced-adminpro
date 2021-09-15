import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, delay } from 'rxjs/operators'; // tap: This operator triggers a secondary efect
import { of, Observable } from 'rxjs'; //of RX operator that creates an observable of certain type
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { LoadUser } from '../interfaces/load-users.interface';

declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;
  public  user: User;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 
                
                this.googleInit();

              }
  
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid():string {
    return this.user.uid || '';
  }

  get headers() {
    return {
        headers: {
          'x-token': this.token
        }
    }
  }

  updateProfile(data: { email:string, name:string, role:string }){

    data = {
       ...data,
       role: this.user.role
    }

    return this.http.put(`${base_url}/users/${ this.uid }`, data, this.headers );

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
    
    //const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (res:any) => {
        console.log(res);
        
        const { email, google, name, role, img = '', uid } = res.user;
        this.user = new User(name, email, '', img, google, role, uid);

        localStorage.setItem('token', res.token);

        return true;
      }),
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

  loadUsers( from: number = 0 ){

    const url = `${base_url}/users?from=${ from }`
    return this.http.get<LoadUser>( url, this.headers )
            .pipe(
              delay(1000),
              map( res => {
                  const users = res.users.map( user => new User(user.name, user.email, '', user.img, user.google, user.role, user.uid) );
                  return {
                    total: res.total,
                    users
                  }
              })
            )

  }

  deleteUser(user: User){
    const url = `${base_url}/users/${user.uid}`;
    return this.http.delete( url, this.headers );
  }


  
  saveUser(user: User){
      return this.http.put(`${base_url}/users/${ user.uid }`, user, this.headers );
  }

}
