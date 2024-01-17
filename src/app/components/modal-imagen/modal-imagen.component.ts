import { Component } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: ``,
})
export class ModalImagenComponent {
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(
    public modalService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalService.cerrarModal();
  }

  cambiarImagen(event: any): any {
    const files: FileList | null = (event?.target as HTMLInputElement)?.files;

    if (files && files.length > 0) {
      this.imagenSubir = files[0];
    }

    if (!files) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    const id = this.modalService.id;
    const tipo = this.modalService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
    .then(img => {
        Swal.fire('Guardado','Imagen de usuario actualizado con exito','success' );
        this.modalService.nuevaImagen.emit(img);
        this.cerrarModal();
      },
      (err) => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      }
    );
  }
}
