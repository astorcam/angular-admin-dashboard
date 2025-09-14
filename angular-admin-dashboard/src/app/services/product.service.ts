import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url="http://localhost:3000/products"
  
  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<any[]>{
    return this.http.get<any[]>(this.url);
  }
  getProductById(id: number) {
  return this.http.get<any[]>(this.url).pipe(
    map(products => products.find(p => p.id == id))
  );
}
}
