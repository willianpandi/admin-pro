import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: ``,
})
export class UsuariosComponent implements OnInit, OnDestroy {
  totalUsuarios: number = 0;
  usuarios: Usuario[] = [];
  usuariosTem: Usuario[] = [];
  desde: number = 0;
  cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private busquedaService: BusquedasService,
    private modalService: ModalImagenService,
  ) {}

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalService.nuevaImagen
      .pipe(delay(100),)
      .subscribe( img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTem = usuarios;
        this.cargando = false;
      });
  }

  cambiarpagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar( termino: string ): any {
    if( termino.length === 0 ){
      return this.usuarios = this.usuariosTem;
    }
    this.busquedaService.busqueda('usuarios', termino)
        .subscribe( resp => {
          this.usuarios = resp;
        }
        )
  }

  eliminarUsuario( usuario: Usuario ):any {

    if ( usuario.uuid === this.usuarioService.uuid ) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
        title:'Borrar usuario?',
        text: `Esta a punto de borrar a ${usuario.nombre}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, borrarlo'
      }).then((result) => {
        if (result.value ) {
          this.usuarioService.eliminarUsuario( usuario )
              .subscribe( resp =>{
                this.cargarUsuarios();
                Swal.fire('Eliminado!',
                          `${usuario.nombre} fue eliminado con exito`,
                          'success'
                );
              });
        }
      })
  }

  cambiarRole( usuario: Usuario) {
    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp);
      })
  }

  abrirModal( usuario: Usuario ){
    this.modalService.abrirModal( 'usuarios', usuario.uuid!, usuario.img );
  }

}
