import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css'
  ]
})
export class LoginComponent implements OnInit{

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.formBuilder.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(){

    console.log( this.loginForm.value );

    this.userService.login(this.loginForm.value)
    .subscribe( res => {
      console.log(res)
      if(this.loginForm.get('remember').value)
      {
        localStorage.setItem('email', this.loginForm.get('email').value);
      }
      else
      {
        localStorage.removeItem('email');
      }

      // Navigate to dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
      // If an error happens
      Swal.fire('Error', err.error.msg, 'error');
    });

    //this.router.navigateByUrl('/');
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();

  }

  async startApp() {

      await this.userService.googleInit();
      this.auth2 = this.userService.auth2;

      this.attachSignin(document.getElementById('my-signin2'));
    
  };

  attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          var id_token = googleUser.getAuthResponse().id_token;
          //console.log(id_token);
          this.userService.loginGoogle(id_token)
            .subscribe( res => {
              // Navigate to dashboard
              this.ngZone.run ( () => {
                this.router.navigateByUrl('/');
              })
            });
            
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
