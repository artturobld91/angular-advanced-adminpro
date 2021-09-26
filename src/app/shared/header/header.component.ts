import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit{

  public user:User; 

  constructor(private userService: UserService,
              private router: Router) { 
    //console.log(userService.user.imageUrl);
    //this.imgUrl = userService.user.imageUrl;
  }
  ngOnInit(): void {
    console.log(this.userService.user.imageUrl);
    this.user = this.userService.user;
  }

  logout(){
    this.userService.logout();
  }

  search( term: string){
    console.log(term);

    if(term.length === 0)
    {
      return;
    }

    this.router.navigateByUrl(`/dashboard/search/${ term }`);
  }

}
