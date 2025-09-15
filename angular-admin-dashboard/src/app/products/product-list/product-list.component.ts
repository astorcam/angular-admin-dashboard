import { Component } from '@angular/core';
import { DataTableComponent } from '../../dashboard/layout/data-table/data-table.component';
import { ProductService } from '../../services/product.service';
import { StatsCardComponent } from '../../dashboard/layout/stats-card/stats-card.component';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-product-list',
  imports: [DataTableComponent, StatsCardComponent],
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

constructor(private productService: ProductService,
  private salesService: SaleService
){}

ngOnInit(){
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
    const salesCategories: { [key: string]: number } = {}; 
    const productSales: { [key: number]: number } = {}; 
    completed.forEach(sale => {
        if (!productSales[sale.productId]) {
          productSales[sale.productId] = 0;
        }
        productSales[sale.productId] += sale.quantity;
    })
    for (const key in productSales) {
      this.productService.getProductById(Number(key)).subscribe(p =>{
         p.category
        if (!salesCategories[p.category]) {
            salesCategories[p.category] = 0;
          }
        salesCategories[p.category]+=productSales[key]
      })
    }
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
}
