import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
   {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'users', component: UserListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },

  // Ruta comodín
  { path: '**', redirectTo: 'dashboard' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }