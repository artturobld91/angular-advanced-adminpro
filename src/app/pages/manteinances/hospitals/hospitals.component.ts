import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchsService } from 'src/app/services/searchs.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [
  ]
})
export class HospitalsComponent implements OnInit, OnDestroy {

  public hospitals: Hospital[] = [];
  public hospitalsTemp: Hospital[] = [];
  public loading: boolean = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
               private modalImageService:  ModalImageService,
               private searchsService: SearchsService) { }
  

  ngOnInit(): void {

    this.loadHospitals();
    this.imgSubs = this.modalImageService.imageChanged
    .pipe(delay(100)) // Note: Setting delay since, other process need this to wait a little to perform well.
    .subscribe( img => {
      console.log(img);
      this.loadHospitals(); 
    });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  loadHospitals(){
    this.loading = true;

    this.hospitalService.loadHospitals()
        .subscribe( hospitals => {
          console.log(hospitals);
          this.loading = false;
          this.hospitals = hospitals;
          this.hospitalsTemp = hospitals;
        });
  }

  saveChanges( hospital: Hospital ){
    console.log(hospital);

    this.hospitalService.updateHospital( hospital._id, hospital.name )
        .subscribe( res => {
          Swal.fire('Updated', hospital.name, 'success');
        })
  }

  deleteHospital( hospital: Hospital ){
    console.log(hospital);

    this.hospitalService.deleteHospital( hospital._id )
        .subscribe( res => {
          Swal.fire('Deleted', hospital.name, 'success');
        })
  }

  async openSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create hospital',
      text: 'Please type the new hospitals name',
      input: 'text',
      inputPlaceholder: 'Hospital Name',
      showCancelButton: true,
    })
    
    if ( value.trim().length > 0 ) {
      console.log(value);
      this.hospitalService.createHospital(value)
          .subscribe( (res: any) => {
            this.hospitals.push( res.hospital )
            Swal.fire('Created', res.hospital.name, 'success');
          })
    }
  }

  openModal(hospital: Hospital) {
    console.log(hospital);
    this.modalImageService.openModal( 'hospitals', hospital._id, hospital.img );
  }

  search(term: string){
    console.log(term);

    if(term.length  === 0){
      return this.hospitals = this.hospitalsTemp;
    }

    this.searchsService.search('Hospitals', term)
        .subscribe( (res: Hospital[]) => {
          console.log(res);
          this.hospitals = res;
        });
  }

}
