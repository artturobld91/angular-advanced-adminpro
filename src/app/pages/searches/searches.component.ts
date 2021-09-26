import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchsService } from 'src/app/services/searchs.service';

import { User } from 'src/app/models/user.model';
import { Doctor } from 'src/app/models/doctor.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-searches',
  templateUrl: './searches.component.html',
  styles: [
  ]
})
export class SearchesComponent implements OnInit {

  public users: User[] = [];
  public doctors: Doctor[] = [];
  public hospitals: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
                private searchService: SearchsService ) { }

  ngOnInit(): void {

    this.activatedRoute.params 
        .subscribe( ({ term }) => {
          console.log( term );
          this.globalSearch( term );
        })

  }

  globalSearch(term: string){
    this.searchService.globalSearches( term )
        .subscribe( (res: any) => {
          console.log(res);
          this.users = res.users;
          this.doctors = res.doctors;
          this.hospitals = res.hospitals;
        });
  }

  openDoctor(doctor: Doctor){
    
  }

}
