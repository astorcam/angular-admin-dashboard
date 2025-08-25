import { Component } from '@angular/core';
import { UserMenuComponent } from '../layout/user-menu/user-menu.component';
import { GeneralMenuComponent } from '../layout/general-menu/general-menu.component';
import { StatsCardComponent } from '../layout/stats-card/stats-card.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-home',
  imports: [RouterModule, UserMenuComponent, GeneralMenuComponent, StatsCardComponent, MatSidenavModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  totalUsers=0;
  totalProducts=0;

  constructor(private userService: UserService,
     private productService: ProductService
  ){};
 
ngOnInit(){
   this.userService.getUsers().subscribe(u => this.totalUsers = u.length);
   this.productService.getProducts().subscribe(p => this.totalProducts = p.length);
}


}
