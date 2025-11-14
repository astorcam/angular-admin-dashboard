import { Component } from '@angular/core';
import { DataTableComponent } from '../../dashboard/layout/data-table/data-table.component';
import { ProductService } from '../../services/product.service';
import { StatsCardComponent } from '../../dashboard/layout/stats-card/stats-card.component';
import { SaleService } from '../../services/sale.service';
import { forkJoin, map } from 'rxjs';
import { BarChartComponent } from "../../dashboard/layout/bar-chart/bar-chart.component";
import { Chart, ChartConfiguration } from 'chart.js';
import { PieChartComponent } from "../../dashboard/layout/pie-chart/pie-chart.component";
import { LineChartComponent } from "../../dashboard/layout/line-chart/line-chart.component";
import { ProductFormComponent } from "../product-form/product-form.component";
import { CommonModule } from '@angular/common';

const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
@Component({
  selector: 'app-product-list',
  imports: [CommonModule,DataTableComponent, StatsCardComponent, BarChartComponent, LineChartComponent, PieChartComponent, ProductFormComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  productTableConfig:any={
    columns:[],
    displayedColumns:[{}],
    dataSource:[{}]
  }
  bestSeller: any = {};
  worstSeller: any = {};
  lowStock: any = {};
  mostSalesCategory: any = {};
  productSalesBarConfig= {
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
categorySalesPieConfig= {
  labels: [] as string[],
  datasets: [
    {
      label: 'Total sales',
      data: [] as number[],
    }
  ]
};
productSalesLineConfig= {
  labels: [] as string[],
  datasets: [
    {
      label: 'Total sales',
      data: [] as number[],
      borderColor:'color' as string
    }
  ]
};
showProductForm: boolean=false;

constructor(private productService: ProductService,
  private salesService: SaleService
){}

ngOnInit(){
  let mappedProducts:{
    id:any,
    name:any
  }[];
  this.productService.getProducts().pipe(
    map(products => products.map(product => ({
      id: product.id,
      name: product.name
    })))
  ).subscribe(mProducts=> mappedProducts=mProducts)
  //best seller
  this.salesService.getBestSeller().subscribe(i=>{
    if(i){
      this.bestSeller.sales=i.totalSold;
      if (i.productId !== null){
        this.productService.getProductById(i.productId).subscribe(p=>this.bestSeller.name=p.name)
      }
    }
  })
  
  //worst seller
  this.salesService.getWorstSeller().subscribe(i=>{
    if(i){
      this.worstSeller.sales=i.totalSold;
      if (i.productId !== null){
        this.productService.getProductById(i.productId).subscribe(p=>this.worstSeller.name=p.name)
      }
    }
  })
  
  //most sales category
  this.salesService.getMostSalesCategory().subscribe(result => {
  this.mostSalesCategory = {
    category: result.category,
    sales: result.totalSales
  };
});
this.salesService.getProductSalesBarChartData().subscribe(chart => {
  this.productSalesBarConfig.labels = chart.labels;
  this.productSalesBarConfig.datasets[0].data = chart.data;
  this.productSalesBarConfig.datasets[0].backgroundColor = this.getRandomColor();
  this.productSalesBarConfig.datasets[0].borderColor = this.getRandomColor();
});
// sales per product line chart  
this.salesService.getAnualSalesPerProduct().subscribe(productSales => {
  if(productSales){
    const datasets = Object.keys(productSales).map(key => {
      const product = mappedProducts.find(p => p.id == +key);
      return {
        label: product?.name ,
        data: productSales[+key],
        borderColor: this.getRandomColor(),
      };
    });  
    this.productSalesLineConfig = {
      labels: months,
      datasets: datasets 
    };
  }
})
//pie chart data

this.salesService.getSalesByCategory()
  .pipe(
    map(salesCategories => {
      const sC = salesCategories as { [key: string]: number };

      this.categorySalesPieConfig = {
        labels: Object.keys(sC),
        datasets: [
          {
            label: "Total sales",
            data: Object.values(sC)
          }
        ]
      };
    })
  )
  .subscribe();
  
  this.productService.getProducts().subscribe(p =>{
    //lowest stock
    let lowerStock=p[0].stock;
    let lowerStockName=p[0].name;
    for (let product of p){
      if(product.stock<lowerStock){
        lowerStock=product.stock;
        lowerStockName=product.name;
      }  
    }
    
    this.lowStock.stock=lowerStock;
    this.lowStock.name=lowerStockName;
    //product table config
    const keys = Object.keys(p[0]);
    this.productTableConfig.columns=keys;
    this.productTableConfig.displayedColumns = keys.map(k => ({
      key: k,
      label: k.charAt(0).toUpperCase() + k.slice(1)
    }));
    this.productTableConfig.dataSource=p;
  } );
  
}


onProductAdded(product: any) {
  console.log('Producto agregado:', product);
  this.showProductForm = false;
}
onProductCanceled() {
 console.log('Producto cancelado');
  this.showProductForm = false;
}

openForm() {
  if (this.showProductForm == false) {
    this.showProductForm = true;
  } 
}
getRandomColor(): string {
  const hue = Math.floor(Math.random() * 360); // 0–360 → todos los colores
  const saturation = 70; // un poco más saturado
  const lightness = 75;  // claro → pastel
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
}
