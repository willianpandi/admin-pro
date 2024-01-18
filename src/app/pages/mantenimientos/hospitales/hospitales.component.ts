import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: ``
})
export class HospitalesComponent implements OnInit, OnDestroy {

  hospitales: Hospital[] =[];
  cargando: boolean = true;
  public imgSubs!: Subscription;


  constructor(
    private hospitalService: HospitalService,
    private modalService: ModalImagenService,
    private busquedaService: BusquedasService,

  ){}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalService.nuevaImagen
      .pipe(delay(1000))
      .subscribe( img => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
    .subscribe( hospitales => {
      this.hospitales = hospitales;
      this.cargando = false;
    })
  }

  guardarCambios( hospital: Hospital) {
    this.hospitalService.actualizarHospital( hospital.uuid!, hospital.nombre )
        .subscribe( resp => {
          Swal.fire('Guardado', hospital.nombre ,'success');
          this.cargarHospitales();
        })

  }

  eliminarHospital( hospital: Hospital) {
    Swal.fire({
      title: "Esta seguro?",
      text: "Desea eliminar " + hospital.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital( hospital.uuid!)
        .subscribe( resp => {
          Swal.fire('Borrado!', hospital.nombre ,'success');
          this.cargarHospitales();
        })
      }
    });

  }

  async abrirSweetAlert() {
    const { value = ''} = await Swal.fire<string>({
      title: 'Nuevo Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Ingrese el nombre del hospital',
      showCancelButton: true,
    })

    if( value.trim().length > 0){
      this.hospitalService.crearHospital( value )
        .subscribe( (resp: any) =>{
          this.hospitales.push( resp.hospital );
        });
    }

  }

  abrirModal(hospital: Hospital ) {
    this.modalService.abrirModal('hospitales', hospital.uuid!, hospital.img )
  }

  buscar( termino: string ): any {
    if( termino.length === 0 ){
      return this.cargarHospitales();
    }
    this.busquedaService.busqueda('hospitales', termino)
        .subscribe( resp => {
          this.hospitales = resp;
        }
        )
  }
}
