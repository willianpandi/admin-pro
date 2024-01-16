import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';


export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  return usuarioService.validarToke()
    .pipe(
      tap( estaAutenticado => {
        if ( !estaAutenticado ) {
          router.navigateByUrl('/login');
        }
      })
    );
};
