import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService } from 'src/app/services/user.service';
import { SearchsService } from 'src/app/services/searchs.service';
import { ModalImageService } from 'src/app/services/modal-image.service';

import { User } from 'src/app/models/user.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];

  public imgSubs: Subscription;
  public from: number = 0;
  public loading: boolean = true;

  constructor( private userService : UserService,
                private searchsService: SearchsService,
                private modalImageService: ModalImageService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.imgSubs = this.modalImageService.imageChanged
        .pipe(delay(100)) // Note: Setting delay since, other process need this to wait a little to perform well.
        .subscribe( img => {
          console.log(img);
          this.loadUsers(); 
        });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


  changePage( value: number )
  {
    this.from += value;

    if(this.from < 0){
      this.from = 0;
    } else if ( this.from >= this.totalUsers ){
      this.from -= value;
    }

    this.loadUsers();

  }

  loadUsers(){
    this.loading = true;
    this.userService.loadUsers( this.from )
    .subscribe( (LoadUser) => {
      this.totalUsers = LoadUser.total;
      this.users = LoadUser.users;
      this.usersTemp = LoadUser.users;
      this.loading = false;
    });
  }

  search(term: string){
    console.log(term);

    if(term.length  === 0){
      return this.users = this.usersTemp;
    }

    this.searchsService.search('Users', term)
        .subscribe( res => {
          console.log(res);
          this.users = res;
        });
  }

  deleteUser( user: User){
    console.log(user);

    if( user.uid === this.userService.uid ){
      return Swal.fire('Error', 'Delete your own user is not allowed.', 'error');
    }

    Swal.fire({
      title: 'Are you sure to delete the user?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete.'
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.deleteUser(user)
            .subscribe(res => {

              this.loadUsers();

              Swal.fire(
                'User Deleted',
                `${user.name} | ${user.email} was deleted successfully`,
                'success'
              )

             }
            )
      }
    })

  }

  changeRole(user: User){
    this.userService.saveUser(user)
        .subscribe( res => {
          console.log(res);
        });
  }

  openModal(user: User) {
    console.log(user);
    this.modalImageService.openModal( 'users', user.uid, user.img );
  }

}
