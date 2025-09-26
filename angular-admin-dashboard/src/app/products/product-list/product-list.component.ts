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

const months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
@Component({
  selector: 'app-product-list',
  imports: [DataTableComponent, StatsCardComponent, BarChartComponent, PieChartComponent, LineChartComponent],
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
productSalesBarChart!: Chart;
productSalesBarConfig: any = {
    type: 'bar',
    data: {
       labels: [],
       datasets: [
      { 
        label: 'Product sales',
        data: [],
        backgroundColor: '#FFC154',
        borderColor: '#0e1f2eff',
        borderWidth: 1
      }
    ]
    },
    options: {
      responsive: true
    }
  };

  categorySalesPieChart!: Chart;
  categorySalesBarConfig:ChartConfiguration<'pie'> = {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Category Sales',
      data: [],
      backgroundColor:[],
      hoverOffset: 4
    }]
  },
};
  lineChart!: Chart;
  lineConfig: any = {
  type: 'line',
  data: {
  labels: months,
  datasets: [{
    label: '',
    data: [],
    fill: false,
    borderColor: '',
    tension: 0.1
  }]
  }
  }; 

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
    this.bestSeller.sales=i.totalSold;
    if (i.productId !== null){
      this.productService.getProductById(i.productId).subscribe(p=>this.bestSeller.name=p.name)
    }
  })
  
  //worst seller
  this.salesService.getWorstSeller().subscribe(i=>{
    this.worstSeller.sales=i.totalSold;
    if (i.productId !== null){
      this.productService.getProductById(i.productId).subscribe(p=>this.worstSeller.name=p.name)
    }
  })
  
  //most sales category
  this.salesService.getSales().subscribe(s=>{
    const completed = s.filter(s => s.status === 'Completed');
    const productSales: { [key: number]: number } = {}; 
    completed.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = 0;
      }
      productSales[sale.productId] += sale.quantity;
    })
    
    const requests = Object.keys(productSales).map(id =>
      this.productService.getProductById(Number(id)).pipe(
        map(product => ({ category: product.category, qty: productSales[Number(id)] }))
      )
    );
    
    forkJoin(requests).subscribe(results => {
      const salesCategories: { [key: string]: number } = {}; 
      results.forEach(r => {
        salesCategories[r.category] = (salesCategories[r.category] || 0) + r.qty;
      });
      this.categorySalesBarConfig.data.labels=Object.keys(salesCategories);
      this.categorySalesBarConfig.data.datasets[0].data=Object.values(salesCategories);
      this.categorySalesBarConfig.data.datasets[0].backgroundColor=this.categorySalesBarConfig.data.labels.map(() => this.getRandomColor());
      this.categorySalesPieChart=new Chart('PieChart', this.categorySalesBarConfig);

      let mostSalesCategory="";
      let maxQty = 0;
      for (const category in salesCategories) {
        if (salesCategories[category] > maxQty) {
          maxQty= salesCategories[category]
          mostSalesCategory=category
        }
      }
      this.mostSalesCategory.category = mostSalesCategory;
      this.mostSalesCategory.sales = maxQty;
    })
    //product sales barChart
        this.productSalesBarConfig.data.labels= mappedProducts.map(p => p.name);
        let productSalesQty=new Array(mappedProducts.length).fill(0);
         completed.forEach(sale =>{
          productSalesQty[Number(sale.productId)-1]+=sale.quantity;
        })
        this.productSalesBarConfig.data.datasets[0].data =productSalesQty;
        this.productSalesBarChart=new Chart('BarChart', this.productSalesBarConfig);


    })
    
    
  this.salesService.getAnualSalesPerProduct().subscribe(productSales => {
      Object.keys(productSales).forEach(key => {
        const product = mappedProducts.find(p => p.id == +key);
        this.lineConfig.data.datasets.push({
            data: productSales[+key],
            label: product?.name,
            borderColor: this.getRandomColor(),
            fill: false
        });
    });
    this.lineConfig.data.datasets.shift();
    this.lineChart=new Chart('LineChart', this.lineConfig);  
    });

  
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

getRandomColor(): string {
  const hue = ((Math.random() * (0.360- 0.001) + 0.1)*360).toFixed(2); 
  console.log(hue);
  const saturation = 60; // menos saturado → pastel
  const lightness = 70;  // más claro → pastel
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
}
