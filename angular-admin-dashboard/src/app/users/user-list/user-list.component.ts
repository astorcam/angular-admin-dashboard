import { Component } from '@angular/core';
import { StatsCardComponent } from "../../dashboard/layout/stats-card/stats-card.component";
import { DataTableComponent } from "../../dashboard/layout/data-table/data-table.component";
import { PieChartComponent } from "../../dashboard/layout/pie-chart/pie-chart.component";
import { Chart } from 'chart.js';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from "../user-form/user-form.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CustomerEditFormComponent } from "../customer-edit-form/customer-edit-form.component";


const hiddenKeys = ['admin_id'];

@Component({
  selector: 'app-user-list',
  imports: [StatsCardComponent, DataTableComponent, PieChartComponent, UserFormComponent, CommonModule, CustomerEditFormComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  usersTableConfig:any={
    columns:[],
    displayedColumns:[{}],
    dataSource:[{}]
  };
  usersRolesPieConfig = {
    labels: [] as string[],
    datasets: [
    {
      label: 'Total users',
      data: [] as number[],
    }
  ]
};
usersCountryPieConfig= {
  labels: [] as string[],
  datasets: [
    {
      label: 'Total users',
      data: [] as number[],
    }
  ]
};

usersCountryBarChart: any;
newUsersLineChart!: Chart;
totalUsers!: number;
newUsers!: number;
usersSuspended!: number;
activeUsers!: number;

showUserForm: boolean=false;
showEditCustomerForm: boolean=false;

editingCustomerFields={
  id:0,
  name:"",  
  country:"",
  email:""
}

constructor(private userService: UserService, private authService: AuthService){}

ngOnInit(){
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  
  const today = `${yyyy}/${mm}/${dd}`;
  this.userService.getUsers().subscribe(users=>{
    this.totalUsers=users.length;
    this.usersSuspended = users.filter(u => u.status === "Suspended").length;
    this.activeUsers = users.filter(u => u.lastLogin===today).length;
    this.newUsers = users.filter(u => {
      const date = new Date(u.created_at);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      return year === yyyy && month === mm;
    }).length;
    //user table config
    const keys = Object.keys(users[0]).filter(k => !hiddenKeys.includes(k));
    this.usersTableConfig.columns=[...keys, 'Actions'];
    this.usersTableConfig.displayedColumns = [
      ...keys.map(k => ({
      key: k,
      label: k.charAt(0).toUpperCase() + k.slice(1)
    })),
     { key: 'Actions', label: '' } 
    ]
    this.usersTableConfig.dataSource=users;

    const userRoles: { [key: string]: number } = {}; 
    const userCountry: { [key: string]: number } = {}; 
    users.forEach(user => {
      userRoles[user.role] = (userRoles[user.role] || 0) + 1;
      userCountry[user.country] = (userCountry[user.country] || 0) + 1;
    });
    this.usersRolesPieConfig = {
      labels: Object.keys(userRoles),
      datasets: [
        {
          label: "Total customers",
          data: Object.values(userRoles)
        }
      ]
    };
    
    this.usersCountryPieConfig = {
      labels: Object.keys(userCountry),
      datasets: [
          {
            label: "Total customers",
            data: Object.values(userCountry)
          }
        ]
      };
    })
    
  }
  
  onCustomerAdded(customer: any) {
     this.authService.getUser().subscribe(admin => {
    if (!admin) return;

    this.userService.addCustomer(customer, admin.id).subscribe({
      next: () => {
        this.showUserForm = false;
        this.userService.getUsers().subscribe(u => {
          this.usersTableConfig.dataSource = u;
        });
      },
      error: err => console.error('Error al agregar Customer:', err)
    });
  });
  }

  onCustomerCanceled() {
    console.log("Customer canceled")
  this.showUserForm=false;
  }


onCustomerDeleted(customerRow: any) {
this.authService.getUser().subscribe(user => {
    if (!user) return;
    
    this.userService.deleteCustomer(customerRow, user.id).subscribe({
      next: () => {
        this.userService.getUsers().subscribe(c => {
          this.usersTableConfig.dataSource = c;
        });
      },
      error: err => console.error('Error al borrar Customer:', err)
    });
  });
}

onEditCustomer(customerRow: any) {
this.showEditCustomerForm=true
this.editingCustomerFields={
  id:customerRow.id,
  name:customerRow.name,
  country:customerRow.country,
  email:customerRow.email
}
console.log(this.editingCustomerFields)
}

onCustomertEdited(editedCustomer: any) {
this.authService.getUser().subscribe(user => {
    if (!user) return;
    this.userService.editCustomer(editedCustomer, user.id).subscribe({
      next: () => {
        this.showEditCustomerForm=false
        this.userService.getUsers().subscribe(c => {
          this.usersTableConfig.dataSource = c;
        });
      },
      error: err => console.error('Error al editar producto:', err)
    });
  });}

  openForm() {
    this.showUserForm=true;
  }
getRandomColor(): string {
  const hue = Math.floor(Math.random() * 360); // 0–360 → todos los colores
  const saturation = 70; // un poco más saturado
  const lightness = 75;  // claro → pastel
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
}
