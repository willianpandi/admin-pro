import { Component, inject } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {

  // usuario = Usuario;
  public usuario: Usuario;
  menuItems: any[]=[];

  constructor(
    private sidebarService: SidebarService,
    private usuarioService: UsuarioService,
  ){
    this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout()
  }

}
