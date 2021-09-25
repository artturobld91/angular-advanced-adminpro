import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/doctor.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

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

  constructor( private http: HttpClient ) { }


  loadDoctors( ){

    const url = `${base_url}/doctors`
    return this.http.get( url, this.headers )
              .pipe(
                map( (res: { ok: boolean, doctors: Doctor[]}) => res.doctors)
              )
  }

  getDoctorById(id: string){
    const url = `${base_url}/doctors/${id}`
    return this.http.get( url, this.headers )
              .pipe(
                map( (res: { ok: boolean, doctor: Doctor}) => res.doctor)
              )
  }

  createDoctor( doctor: { name: string, hospital: string } ){

    const url = `${base_url}/doctors`
    return this.http.post( url, doctor, this.headers );
              
  }

  updateDoctor( doctor: Doctor ){

    const url = `${base_url}/doctors/${doctor._id}`
    return this.http.put( url, doctor, this.headers );
              
  }

  deleteDoctor( _id: string ){

    const url = `${base_url}/doctors/${_id}`
    return this.http.delete( url, this.headers );
              
  }

}
