import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { PromesasComponent } from "./promesas/promesas.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { AuthGuard } from "../guards/auth.guard";
import { PerfilComponent } from "./perfil/perfil.component";

const routes: Routes = [

  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [

      { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
      { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'} },
      { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Grafica 1'} },
      { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Settings'} },
      { path: 'promesas', component: PromesasComponent , data: {titulo: 'Promesas'}},
      { path: 'perfil', component: PerfilComponent , data: {titulo: 'Mi Perfil'}},
      { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'} },
      // { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild( routes )],
  exports: [ RouterModule ],
})
export class PagesRoutingModule {}
