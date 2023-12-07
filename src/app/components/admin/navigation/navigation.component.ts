import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  modeN = new FormControl()
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  toggleSidenav() {
    this.sidenav?.toggle();
  }

  openSidenav() {
    this.sidenav?.open();
  }

  closeSidenav() {
    this.sidenav?.close();
  }
}
