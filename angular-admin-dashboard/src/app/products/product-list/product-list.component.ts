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
totalProducts!:number;
bestSeller: any = {};
worstSeller: any = {};

constructor(private productService: ProductService,
  private salesService: SaleService
){}

ngOnInit(){
  this.salesService.getBestSeller().subscribe(i=>{
    this.bestSeller.sales=i.totalSold;
    if (i.productId !== null){
      this.productService.getProductById(i.productId).subscribe(p=>this.bestSeller.name=p.name)
    }
  })
  this.salesService.getWorstSeller().subscribe(i=>{
    this.worstSeller.sales=i.totalSold;
    if (i.productId !== null){
      this.productService.getProductById(i.productId).subscribe(p=>this.worstSeller.name=p.name)
    }
  })
  this.productService.getProducts().subscribe(p =>{
    this.totalProducts = p.length
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
