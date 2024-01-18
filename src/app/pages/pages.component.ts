import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunction(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  public linkTheme = document.querySelector('#theme');
  constructor(
    private settingService: SettingsService,
    private sidebarService: SidebarService,
  ){

  }
  ngOnInit(): void {
    customInitFunction();
    this.sidebarService.caragrMenu();
  }



}
