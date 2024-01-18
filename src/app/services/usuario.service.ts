import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login.interface';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/usuarios.interface';
import Swal from 'sweetalert2';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario: Usuario | any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uuid(): string {
    return this.usuario.uuid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('pandiwillian@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToke(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          const { email, google, nombre, role, img = '', uuid } = resp.usuario;
          this.usuario = new Usuario(
            nombre,
            email,
            '',
            img,
            google,
            role,
            uuid
          );
          localStorage.setItem('token', resp.token);
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role,
    };
    return this.http.put(
      `${base_url}/usuarios/${this.uuid}`,
      data,
      this.headers
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }
  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  // CARGAR DATOS

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers).pipe(
      // delay(2000),
      map((resp) => {
        const usuarios = resp.usuarios.map(
          (user) =>
            new Usuario(
              user.nombre,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uuid
            )
        );
        return {
          total: resp.total,
          usuarios,
        };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uuid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uuid}`,
      usuario,
      this.headers
    );
  }
}
