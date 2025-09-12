import { Component } from '@angular/core';
import { UserMenuComponent } from '../../dashboard/layout/user-menu/user-menu.component'; 
import { GeneralMenuComponent } from '../../dashboard/layout/general-menu/general-menu.component'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard-layout',
  imports: [MatSidenavModule, RouterModule, UserMenuComponent, GeneralMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {

}
