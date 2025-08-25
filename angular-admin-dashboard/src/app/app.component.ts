import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./dashboard/home/home.component";

@Component({
  selector: 'app-root',
  imports: [ HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-admin-dashboard';
}
