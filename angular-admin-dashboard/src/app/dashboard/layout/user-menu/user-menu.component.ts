import { Component } from '@angular/core';
import {MatSidenavModule, } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-user-menu',
  imports: [MatSidenavModule, MatListModule, MatIconModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {

}
