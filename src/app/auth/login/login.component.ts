import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


declare const google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  fromsSubmit = false;

  loginForms = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['' , [Validators.required, Validators.minLength(3)]],
    remember: [false],
  },{
    Validators,
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '895665046270-duj8llq1tumor237ji3iv163htlbleo7.apps.googleusercontent.com',
      callback: (response:any) =>  this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any){
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => {
        this.ngZone.run( () => {
          this.router.navigateByUrl('/');

        })
      })
  }


  login() {
    this.usuarioService.login( this.loginForms.value )
      .subscribe( resp => {

        if (this.loginForms.get('remember')?.value ) {
          localStorage.setItem('email', this.loginForms.get('email')?.value)
        } else {
          localStorage.removeItem('email')

        }

        this.router.navigateByUrl('/');

      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });

    // this.router.navigateByUrl('/');
  }
}
