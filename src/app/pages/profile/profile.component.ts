import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;
  public imageUpload: File;
  public imageTemp: any = null;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private fileUploadService: FileUploadService) { 

    this.user = userService.user;

  }

  ngOnInit(): void {

      this.profileForm = this.formBuilder.group({
        name: [this.user.name, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]]
      });
  }

  updateProfile(){
    console.log(this.profileForm.value);
    this.userService.updateProfile(this.profileForm.value)
                    .subscribe( res => {
                      console.log(res);
                      const { name, email } = this.profileForm.value;
                      this.user.name = name;
                      this.user.email = email;

                      Swal.fire('Updated', 'Changes were saved', 'success');
                    }, (err) => {
                      console.log(err.error.msg);
                      Swal.fire('Error', err.error.msg, 'error');
                    })
  }

  changeImage( file: File ){
    console.log(file);
    this.imageUpload = file;

    if(!file){ return this.imageTemp = null; }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imageTemp = reader.result;
      console.log(reader.result);
    }

  }

  uploadImage(){

    this.fileUploadService
        .updateImage( this.imageUpload, 'users', this.user.uid )
        .then( img => { 
          this.user.img = img;
          Swal.fire('Updated', 'Image was updated', 'success');
        }).catch( err => {
          console.log(err.error.msg);
          Swal.fire('Error', 'Error updating image', 'error');
        });

  }

}
