import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: ``
})
export class MedicosComponent implements OnInit, OnDestroy {

  cargando: boolean = true;
  medicos: Medico[] = [];
  imgSubs!: Subscription;


  constructor(
    private medicoService: MedicoService,
    private modalService: ModalImagenService,
    private busquedaService: BusquedasService,


  ){}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalService.nuevaImagen
      .pipe(delay(1000))
      .subscribe( img => this.cargarMedicos());
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.medicos = medicos;
          this.cargando = false;
        })
  }

  abrirModal( medico: Medico ){
    this.modalService.abrirModal('medicos', medico.uuid!, medico.img )
  }

  buscar( termino: string ): any {
    if( termino.length === 0 ){
      return this.cargarMedicos();
    }
    this.busquedaService.busqueda('medicos', termino)
        .subscribe( resp => {
          this.medicos = resp;
        }
        )
  }

  eliminarMedico( medico: Medico) {
    Swal.fire({
      title: "Borrar a Medico?",
      text: "Desea eliminar " + medico.nombre,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico( medico.uuid!)
        .subscribe( resp => {
          Swal.fire('Medico borrado!', `${medico.nombre} fue eliminado correctamente` ,'success');
          this.cargarMedicos();
        })
      }
    });

  }


}
