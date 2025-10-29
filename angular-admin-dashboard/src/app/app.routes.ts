import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { SettingsComponent } from './setting-layout/settings/settings.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';


export const routes: Routes = [
  // 🔓 Rutas públicas (no requieren sesión)
  { path: 'login', component: AuthLayoutComponent, canActivate: [LoginGuard] },

  // 🔒 Rutas protegidas (requieren sesión iniciada)
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'users', component: UserListComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // 🚦 Ruta por defecto y fallback
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }