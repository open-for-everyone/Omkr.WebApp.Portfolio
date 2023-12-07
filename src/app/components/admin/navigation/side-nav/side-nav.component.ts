import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { menu } from 'src/app/models/admin/navbar/menu';
import { NavItem } from 'src/app/models/admin/navbar/nav-item';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  animations: [
    trigger('indicatorRotate', [
        state('collapsed', style({ transform: 'rotate(0deg)' })),
        state('expanded', style({ transform: 'rotate(180deg)' })),
        transition('expanded <=> collapsed',
            animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
        ),
    ])
]
})
export class SideNavComponent {
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

  searchText = new FormControl(); // Default to 'over'
  expanded="collapsed";
  navItems: NavItem[] = menu;
  panelOpenState = false;
}
