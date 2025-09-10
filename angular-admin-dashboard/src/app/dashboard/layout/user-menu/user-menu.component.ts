import { Component } from '@angular/core';
import {MatSidenavModule, } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-user-menu',
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterLink],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {

}
