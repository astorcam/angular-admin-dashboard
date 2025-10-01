import { Component } from '@angular/core';
import { StatsCardComponent } from "../../dashboard/layout/stats-card/stats-card.component";
import { DataTableComponent } from "../../dashboard/layout/data-table/data-table.component";
import { PieChartComponent } from "../../dashboard/layout/pie-chart/pie-chart.component";
import { BarChartComponent } from "../../dashboard/layout/bar-chart/bar-chart.component";
import { LineChartComponent } from "../../dashboard/layout/line-chart/line-chart.component";
import { Chart } from 'chart.js';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [StatsCardComponent, DataTableComponent, PieChartComponent, BarChartComponent, LineChartComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
usersTableConfig:any={
  columns:[],
  displayedColumns:[{}],
  dataSource:[{}]
};
usersRolesPieChart!: Chart;
usersCountryBarChart: any;
newUsersLineChart!: Chart;
totalUsers!: number;
newUsers!: number;
usersSuspended!: number;
activeUsers!: number;


constructor(private userService: UserService){}

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
      const [year, month] = u.createdAt.split("-");
      return year === yyyy.toString() && month === mm;
    }).length;
    //user table config
      const keys = Object.keys(users[0]);
      this.usersTableConfig.columns=keys;
      this.usersTableConfig.displayedColumns = keys.map(k => ({
      key: k,
      label: k.charAt(0).toUpperCase() + k.slice(1)
    }));
      this.usersTableConfig.dataSource=users;
  })

}

}
