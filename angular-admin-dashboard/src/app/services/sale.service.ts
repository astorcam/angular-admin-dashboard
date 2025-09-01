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
getAnualProfits(){
  return this.http.get<any[]>(this.apiUrl).pipe(
    map(sales=>{
      const monthlyProfits = new Array(12).fill(0);
      sales.forEach(sale => {
        const month = new Date(sale.date).getMonth(); 
        monthlyProfits[month] += sale.total; 
      });
       return monthlyProfits;
    }
    )
  )
}
}

