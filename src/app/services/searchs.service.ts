import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { Hospital } from '../models/hospital.model';
import { Doctor } from '../models/doctor.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchsService {

  constructor( private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
        headers: {
          'x-token': this.token
        }
    }
  }

  search( type: 'Users'|'Doctors'|'Hospitals',
          term: string = '') {

    const url = `${ base_url }/search/collection/${type}/${ term }`;
    return this.http.get<any[]>( url, this.headers )
            .pipe(
              map( (res:any) => {

                switch ( type ) {
                  case 'Users':
                    return this.transformUsers( res.results );
                  case 'Hospitals':
                      return this.transformHospitals( res.results );
                  case 'Doctors':
                    return this.transformDoctors( res.results );
                  default:
                    return [];
                }

              } )
            );
  }

  globalSearches( term: string){
    const url = `${ base_url }/search/${ term }`;
    return this.http.get<any[]>( url, this.headers )
  }

  private transformUsers( results: any[] ): User[] {

    return results.map(
      user => new User(user.name, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private transformHospitals( results: any[] ): Hospital[] {

    return results.map(
      hospital => new Hospital(hospital.name, hospital._id, hospital.img, hospital.user)
    );
  }

  private transformDoctors( results: any[] ): Doctor[] {

    return results.map(
      doctor => new Doctor(doctor.name, doctor._id, doctor.img, doctor.user)
    );
  }


}
