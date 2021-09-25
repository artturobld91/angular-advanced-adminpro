import { Component, OnInit, OnDestroy } from '@angular/core';
import { DoctorService } from 'src/app/services/doctor.service';
import { Doctor } from 'src/app/models/doctor.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchsService } from 'src/app/services/searchs.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [
  ]
})
export class DoctorsComponent implements OnInit, OnDestroy {

  public doctors: Doctor[] = [];
  public doctorsTemp: Doctor[] = [];
  public loading: boolean = true;
  private imgSubs: Subscription;

  constructor( private doctorsService: DoctorService,
               private modalImageService: ModalImageService,
               private searchsService: SearchsService ) { }
  
  ngOnInit(): void {
    this.loadDoctors();
    this.imgSubs = this.modalImageService.imageChanged
    .pipe(delay(100)) // Note: Setting delay since, other process need this to wait a little to perform well.
    .subscribe( img => {
      console.log(img);
      this.loadDoctors(); 
    });
  }

  ngOnDestroy(): void {
     this.imgSubs.unsubscribe();
  }

  loadDoctors(){
    this.loading = true;

    this.doctorsService.loadDoctors()
        .subscribe( doctors => {
          console.log(doctors);
          this.loading = false;
          this.doctors = doctors;
          this.doctorsTemp = doctors;
        });
  }

  saveChanges( doctor: Doctor ){
    console.log(doctor);

    this.doctorsService.updateDoctor( doctor._id, doctor.name )
        .subscribe( res => {
          Swal.fire('Updated', doctor.name, 'success');
        })
  }

  deleteDoctor( doctor: Doctor ){
    console.log(doctor);

    Swal.fire({
      title: 'Are you sure to delete the doctor?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete.'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorsService.deleteDoctor( doctor._id )
        .subscribe( res => {
          Swal.fire('Deleted', doctor.name, 'success');
        })
      }
    });

    
  }

  async openSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create doctor',
      text: 'Please type the new doctors name',
      input: 'text',
      inputPlaceholder: 'Doctor Name',
      showCancelButton: true,
    })
    
    if ( value.trim().length > 0 ) {
      console.log(value);
      this.doctorsService.createDoctor(value)
          .subscribe( (res: any) => {
            this.doctors.push( res.doctor )
            Swal.fire('Created', res.doctor.name, 'success');
          })
    }
  }

  openModal(doctor: Doctor) {
    console.log(doctor);
    this.modalImageService.openModal( 'doctors', doctor._id, doctor.img );
  }

  search(term: string){
    console.log(term);

    if(term.length  === 0){
      return this.doctors = this.doctorsTemp;
    }

    this.searchsService.search('Doctors', term)
        .subscribe( (res: Doctor[]) => {
          console.log(res);
          this.doctors = res;
        });
  }

}
