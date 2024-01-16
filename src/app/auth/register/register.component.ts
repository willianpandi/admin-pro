import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  fromsSubmit = false;


  registerForm = this.fb.group({
    nombre: ['Willian', [Validators.required, Validators.minLength(3)]],
    email: ['test@google.com', [Validators.required, Validators.email ]],
    password: ['123456', [Validators.required, Validators.minLength(3)]],
    password2: ['123456', [Validators.required, Validators.minLength(3)]],
    terminos: [true, [Validators.required, Validators.minLength(3)]],
  },
    {
      validators: this.passwordsIguales('password','password2')
    }
  );
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  crearUsuario() {
    this.fromsSubmit = true;

    if (this.registerForm.invalid) {
      return;

    }

    // realiza el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {
              this.router.navigateByUrl('/');
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error')
        });
  }

  campoNoValido( campo: string ):boolean {

    if (this.registerForm.get(campo)?.invalid && this.fromsSubmit ) {
      return true;
    } else {
      return false;
    }

    return true
  }

  contraseniaNoValido(){
    const pass1= this.registerForm.get('password')!.value;
    const pass2= this.registerForm.get('password2')!.value;

    if ((pass1 !== pass2) && this.fromsSubmit ) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')!.value && this.fromsSubmit;
  }

  passwordsIguales(pass1: string, pass2: string ){
    return (formGroup: FormGroup ) => {
      const pass1Control= formGroup.get(pass1);
      const pass2Control= formGroup.get(pass2);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual:true})
      }
    }
  }
}
