import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { HospitalService } from 'src/app/services/hospital.service';
import { DoctorService } from 'src/app/services/doctor.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Doctor } from 'src/app/models/doctor.model';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: [
  ]
})
export class DoctorComponent implements OnInit {

  public doctorForm: FormGroup;
  public hospitals: Hospital[] = [];
  public selectedHospital: Hospital;
  public selectedDoctor: Doctor;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private doctorService: DoctorService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    // this.activatedRoute.params.subscribe( params => {
    //   console.log(params);
    // })

    this.activatedRoute.params.subscribe( ({ id }) => {
      console.log(id);
      this.loadDoctor(id);
    })

    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.loadHospitals();

    this.doctorForm.get('hospital').valueChanges
        .subscribe( hospitalID => {
          console.log(hospitalID);
          this.selectedHospital = this.hospitals.find( h => h._id === hospitalID );
          console.log(this.selectedHospital);
        } )
  }

  loadDoctor(id: string){

    if(id === 'new'){
      return;
    }

    this.doctorService.getDoctorById( id )
        .pipe(
          delay(100)
        )
        .subscribe( doctor => {

          if(!doctor){
            return this.router.navigateByUrl(`/dashboard/doctors`);
          }

          console.log(doctor);
          const { name, hospital:{ _id } } = doctor;
          console.log(name, _id);
          this.selectedDoctor = doctor;
          this.doctorForm.setValue({ name, hospital: _id });
        })
  }

  loadHospitals(){

    this.hospitalService.loadHospitals()
        .subscribe( (hospitals: Hospital[]) => {
          console.log(hospitals);
          this.hospitals = hospitals;
        })

  }

  saveDoctor()
  {

    const { name } = this.doctorForm.value;

    if( this.selectedDoctor )
    {
      //Update
      const data = {
        ...this.doctorForm.value,
        _id: this.selectedDoctor._id
      }
      this.doctorService.updateDoctor( data )
        .subscribe( (res:any) => {
          console.log(res);
          Swal.fire('Updated', `${ name } successfully updated`, 'success');
        })
    }
    else 
    {
      //Create
      console.log(this.doctorForm.value);
      this.doctorService.createDoctor( this.doctorForm.value )
        .subscribe( (res: any) => {
          console.log(res);
          Swal.fire('Created', `${ name } successfully created`, 'success');
          this.router.navigateByUrl(`/dashboard/doctor/${ res.doctor._id }`);
        })
    }

    
  }

}
