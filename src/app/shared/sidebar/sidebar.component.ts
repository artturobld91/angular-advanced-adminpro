import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public user:User; 
  //public menuItems: any[];

  constructor(public sidebarService: SidebarService,
              private userService: UserService) { 
    //this.menuItems = sidebarService.menu;
    this.user = this.userService.user;
  }

  ngOnInit(): void {
    //console.log(this.userService.user.imageUrl);
    //this.user = this.userService.user;
  }

}
