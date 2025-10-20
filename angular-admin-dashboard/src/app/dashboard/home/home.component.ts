import { Component } from '@angular/core';
import { StatsCardComponent } from '../layout/stats-card/stats-card.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { BarChartComponent } from '../layout/bar-chart/bar-chart.component';
import { LineChartComponent } from "../layout/line-chart/line-chart.component";
import { DataTableComponent } from "../layout/data-table/data-table.component";
import { CommonModule } from '@angular/common';
import { SaleFormComponent } from "../sales/sale-form/sale-form.component";
import { forkJoin } from 'rxjs';


const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, StatsCardComponent, BarChartComponent, MatSidenavModule, LineChartComponent, DataTableComponent, SaleFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  totalUsers=0;
  totalProducts=0;
  totalSales=0;
  profit=0;

  anualSalesBarConfig= {
    labels: [] as string[],
    datasets: [
      {
        label: 'Total sales',
        data: [] as number[],
        borderColor:'color' as string,
        backgroundColor:'color' as string,
        borderWidth: 1
      }
    ]
  };
  
  anualProfitLineConfig= {
  labels: [] as string[],
  datasets: [
    {
      label: 'Total sales',
      data: [] as number[],
      borderColor:'color' as string
    }
  ]
};

salesTableConfig:any={
  columns:[],
  displayedColumns:[{}],
  dataSource:[{}]
}

users: any[] = [];
products: any[] = [];
showSaleForm: boolean=false;


  constructor(private userService: UserService,
     private productService: ProductService,
     private saleService: SaleService
  ){};
 
ngOnInit(){
  this.userService.getUsers().subscribe(u => {
    this.totalUsers = u.length
    this.users = u
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  this.productService.getProducts().subscribe(p => this.totalProducts = p.length);
  this.saleService.getSales().subscribe(s =>{
  this.totalSales = s.length;
  const keys = Object.keys(s[0]);
  this.salesTableConfig.columns=keys;
  this.salesTableConfig.displayedColumns = keys.map(k => ({
  key: k,
  label: k.charAt(0).toUpperCase() + k.slice(1)
}));
  this.salesTableConfig.dataSource=s.reverse();
    } 
  )
this.saleService.getAnualSales().subscribe(salesByYear => {

  const datasets = Object.keys(salesByYear).map(year => ({
    label: `Sales ${year}`,
    data: salesByYear[+year],
    borderColor: this.getRandomColor(),
    backgroundColor:this.getRandomColor(),
    borderWidth:1
    }))
    this.anualSalesBarConfig = {
    labels: months,
    datasets: datasets 
  };

});
  this.saleService.getAnualProfits().subscribe(profitsByYear => {

    const datasets = Object.keys(profitsByYear).map(year => ({
    label: `Profits ${year}`,
    data: profitsByYear[+year],
    borderColor: this.getRandomColor(),
    }))
    this.anualProfitLineConfig = {
    labels: months,
    datasets: datasets 
  };
  });

  this.saleService.getProfit().subscribe(value => {
  this.profit = value;
  });

this.saleService.getTopProductsOfYear().subscribe(top5 => {
  const productRequests = top5.map(sale =>
    this.productService.getProductById(sale.productId)
  );

  forkJoin(productRequests).subscribe(productsData => {
    this.products = productsData
      .filter(p => !!p)
      .map((product, i) => ({
        top:i+1,
        name: product.name,
        category:product.category,
        stock: product.stock,
        totalSold: top5[i].quantity
      }));
  });
});
}


onSaleAdded(sale: any) {
  console.log('Sale agregado:', sale);
  this.showSaleForm = false;
}
onSaleCanceled() {
 console.log('Producto cancelado');
  this.showSaleForm = false;
}

openForm() {
  if (this.showSaleForm == false) {
    this.showSaleForm = true;
  } 
}
getRandomColor(): string {
  const hue = Math.floor(Math.random() * 360); // 0–360 → todos los colores
  const saturation = 70; // un poco más saturado
  const lightness = 75;  // claro → pastel
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
}
