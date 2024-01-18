import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient,
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private tranformasUsuarios( resultados: any[] ): Usuario[] {
    return resultados.map(
      user =>  new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uuid )
    )
  }
  private tranformasHospitales( resultados: any[] ): Hospital[] {
    return resultados;
  }
  private tranformasMedicos( resultados: any[] ): Medico[] {
    return resultados;
  }

  busqueda( tipo: 'usuarios'|'medicos'|'hospitales', termino: string ) {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any): any => {
          switch (tipo) {
            case 'usuarios':
              return this.tranformasUsuarios( resp.resultados )
              break;
            case 'hospitales':
              return this.tranformasHospitales( resp.resultados )
              break;
            case 'medicos':
              return this.tranformasMedicos( resp.resultados )
              break;

            default:
              break;

            return [];
          }
        })
      )
  }


  busquedaGlobal( termino: string ) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.headers);


  }
}
