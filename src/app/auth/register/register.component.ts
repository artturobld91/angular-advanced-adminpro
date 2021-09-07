import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css'
  ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.formBuilder.group({
    name: ['Oscar', Validators.required],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terms: [true, Validators.required]
  }, {
    validators: this.passwordsEqual('password','password2')
  });

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) { }

  createUser()
  {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid)
    {
      return;
    }

    // Creating the User
    this.userService.createUser( this.registerForm.value ).subscribe( res => {
      console.log('User Created');
      console.log(res);
      // Navigate to dashboard
      this.router.navigateByUrl('/');
    }, (err) => {
        // If an error happens
        Swal.fire('Error', err.error.msg, 'error');
    });
  }

  notValidField(field: string): boolean{
    if(this.registerForm.get(field).invalid && this.formSubmitted )
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  acceptTerms(){
    return !this.registerForm.get('terms').value && this.formSubmitted; 
  }

  passwordsNotValid(){
    const password1 = this.registerForm.get('password').value;
    const password2 = this.registerForm.get('password2').value;

    if(password1 !== password2 && this.formSubmitted)
    {
      return true;
    }
    else
    {
      return false;
    }

  }

  passwordsEqual(pass1Name: string, pass2Name: string){
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value)
      {
        pass2Control.setErrors(null);
      }
      else
      {
        pass2Control.setErrors({ isNotEqual: true});
      }

    }
  }

}
