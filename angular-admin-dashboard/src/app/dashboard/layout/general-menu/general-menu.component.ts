import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-general-menu',
  imports: [MatMenuModule, MatIconModule, MatToolbarModule,MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './general-menu.component.html',
  styleUrl: './general-menu.component.scss'
})
export class GeneralMenuComponent {
 constructor(private authService:AuthService, 
  private router: Router
){}
fullName!:string;
avatarUrl!:string;

ngOnInit(){
   this.authService.getUserProfile().subscribe((profile) => {
      if (profile) {
        this.fullName = profile.name; 
        this.avatarUrl=profile.avatar;
      }
    });
}

onSignOut()
{
  this.authService.signOut();
  this.router.navigate(["/login"]);
}
}
