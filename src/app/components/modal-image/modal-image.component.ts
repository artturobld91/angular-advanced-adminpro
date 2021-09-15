import { Component, OnInit } from '@angular/core';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: [
  ]
})
export class ModalImageComponent implements OnInit {

  public imageUpload: File;
  public imageTemp: any = null;

  constructor(public modalImageService: ModalImageService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.imageTemp = null;
    this.modalImageService.closeModal();
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

    const id = this.modalImageService.id;
    const type = this.modalImageService.type;

    this.fileUploadService
        .updateImage( this.imageUpload, type, id )
        .then( img => { 
          Swal.fire('Updated', 'Image was updated', 'success');

          this.modalImageService.imageChanged.emit(img);

          this.closeModal();
        }).catch( err => {
          console.log(err.error.msg);
          Swal.fire('Error', 'Error updating image', 'error');
        });

  }

}
