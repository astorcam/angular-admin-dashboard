import { Component } from '@angular/core';
import { UserMenuComponent } from '../layout/user-menu/user-menu.component';
import { GeneralMenuComponent } from '../layout/general-menu/general-menu.component';
import { StatsCardComponent } from '../layout/stats-card/stats-card.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { BarChartComponent } from '../layout/bar-chart/bar-chart.component';
import { Chart } from 'chart.js';
import { LineChartComponent } from "../layout/line-chart/line-chart.component";
import { DataTableComponent } from "../layout/data-table/data-table.component";


@Component({
  selector: 'app-home',
  imports: [RouterModule, UserMenuComponent, GeneralMenuComponent, StatsCardComponent, BarChartComponent, MatSidenavModule, LineChartComponent, DataTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  totalUsers=0;
  totalProducts=0;
  totalSales=0;
  profit=0;
  barChart!: Chart;
  lineChart!: Chart;
  months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  barConfig: any = {
    type: 'bar',
    data: {
       labels: this.months,
       datasets: [
      { 
        label: 'Sales 2025',
        data: [],
        backgroundColor: '#EEC584',
        borderColor: '#0e1f2eff',
        borderWidth: 1
      }
    ]
    },
    options: {
        responsive: true
      }
  };
  lineConfig: any = {
  type: 'line',
  data: {
  labels: this.months,
  datasets: [{
    label: 'Anual Profits',
    data: [],
    fill: false,
    borderColor: '#5FAD56',
    tension: 0.1
  }]
}
};
userTableConfig:any={
  columns:[],
  displayedColumns:[{}],
  dataSource:[{}]
}

  constructor(private userService: UserService,
     private productService: ProductService,
     private saleService: SaleService
  ){};
 
ngOnInit(){
  this.userService.getUsers().subscribe(u => {
    this.totalUsers = u.length
    const keys = Object.keys(u[0]);
    this.userTableConfig.columns=keys;
    this.userTableConfig.displayedColumns = keys.map(k => ({
    key: k,
    label: k.charAt(0).toUpperCase() + k.slice(1)
  }));
    this.userTableConfig.dataSource=u;

});
  this.productService.getProducts().subscribe(p => this.totalProducts = p.length);
  this.saleService.getSales().subscribe(s => this.totalSales = s.length);
  this.saleService.getAnualSales().subscribe(monthlySales => {
    this.barConfig.data.datasets[0].data = monthlySales;
    this.barChart=new Chart('BarChart', this.barConfig);
    });
  this.saleService.getAnualProfits().subscribe(monthlyProfits => {
    this.lineConfig.data.datasets[0].data = monthlyProfits;
    this.lineChart=new Chart('LineChart', this.lineConfig);  
    });
  this.saleService.getProfit().subscribe(value => {
  this.profit = value;
  
  });
}

}
