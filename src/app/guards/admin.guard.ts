import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

export const AdminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  if ( usuarioService.role === 'ADMIN_ROLE') {
      return true;
  } else {
    router.navigateByUrl('/dashboard');
    return false;
  }

  // return (usuarioService.role === 'ADMIN_ROLE') ? true : false;
};
