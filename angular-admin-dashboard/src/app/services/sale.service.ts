import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:3000/sales';
  
  constructor(private http: HttpClient) { }
  
  getSales(){
    return this.http.get<any[]>(this.apiUrl);}
    
    getProfit(): Observable<number> {
      return this.http.get<any[]>(this.apiUrl).pipe(
        map(sales => sales.reduce((acc, s) => acc + s.total, 0))
      );
    }
    
    getAnualSales(){
      return this.http.get<any[]>(this.apiUrl).pipe(
        map(sales=>{
          const monthlySales = new Array(12).fill(0);
          sales.forEach(sale => {
            const month = new Date(sale.date).getMonth(); 
            monthlySales[month] += 1; 
          });
          return monthlySales;
        }
      )
    )
  }
  getAnualProfits() {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(sales => {
      const profitsByYear: Record<number, number[]> = {};

      sales.forEach(sale => {
        const date = new Date(sale.date);
        const year = date.getFullYear();
        const month = date.getMonth();

        if (!profitsByYear[year]) {
          profitsByYear[year] = new Array(12).fill(0);
        }

        profitsByYear[year][month] += sale.total;
      });

      return profitsByYear;
    })
  );
}
getBestSeller() {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(sales=>{
      const completed = sales.filter(s => s.status === 'Completed');
      const hashTotals: { [key: number]: number } = {}; 
      completed.forEach(sale => {
        if (!hashTotals[sale.productId]) {
          hashTotals[sale.productId] = 0;
        }
        hashTotals[sale.productId] += sale.quantity;
      });
      let bestSellerId: number | null = null;
      let maxQty = 0;
      
      for (const productId in hashTotals) {
        if (hashTotals[productId] > maxQty) {
          maxQty = hashTotals[productId];
          bestSellerId = +productId;
        }
      }
      return { productId: bestSellerId, totalSold: maxQty };
    }))
  }
  getWorstSeller() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(sales=>{
      const completed = sales.filter(s => s.status === 'Completed');
      const hashTotals: { [key: number]: number } = {}; 
      completed.forEach(sale => {
        if (!hashTotals[sale.productId]) {
          hashTotals[sale.productId] = 0;
        }
        hashTotals[sale.productId] += sale.quantity;
      });
      let worstSellerId: number | null = null;
      let maxQty =Object.values(hashTotals)[0];
      
      for (const productId in hashTotals) {
        if (hashTotals[productId] < maxQty) {
          maxQty = hashTotals[productId];
          worstSellerId = +productId;
        }
      }
      return { productId: worstSellerId, totalSold: maxQty };
    }))
  }
  getAnualSalesPerProduct() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(sales=>{
        const productsSales:{ [key: number]: Array<number> } = {}; 
        
        sales.forEach(sale => {
          if (!productsSales[sale.productId]) {
            productsSales[sale.productId] =new Array(12).fill(0);
          }
          const month = new Date(sale.date).getMonth();
          productsSales[sale.productId][month] = sale.total;
          });
           
        return productsSales;
      }
    )
  )
  }

  getTopProductsOfYear() {
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(sales => {
      const totalsByProduct: Record<number, number> = {};

      sales.forEach(sale => {
        // Sumamos la cantidad total por producto en el año
        totalsByProduct[sale.productId] = (totalsByProduct[sale.productId] || 0) + sale.quantity;
      });

      // Convertimos a array y ordenamos
      const sorted = Object.entries(totalsByProduct)
        .map(([productId, quantity]) => ({ productId: +productId, quantity }))
        .sort((a, b) => b.quantity - a.quantity);

      // Retornar los 5 mejores
      return sorted.slice(0, 5);
    })
  );
}
}

