import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { SettingsComponent } from './setting-layout/settings/settings.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';


export const routes: Routes = [
  // 🔓 Rutas públicas (no requieren sesión)
  { path: '', component: AuthLayoutComponent },
  // // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },

  // 🔒 Rutas protegidas (requieren sesión iniciada)
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'users', component: UserListComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }