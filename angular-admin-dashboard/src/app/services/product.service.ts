import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url="http://localhost:3000/products"
  supabase: SupabaseClient;
 
  constructor(private http: HttpClient, private supabaseService: SupabaseService) { 
    this.supabase = this.supabaseService.client;
  }
  
  getProducts(): Observable<any[]>{
    return from(this.supabase.from('products').select('*').then(({ data }) => data ?? []));  
    }

  getProductById(id: number): Observable<any> {
    return from(
      this.supabaseService.client
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(result => {
        if (result.error) {
          console.error('Error fetching product:', result.error);
          return null;
        }
        return result.data;
      })
    );
  }
  addProduct(product: any, userId: string) {
    const { id, ...cleanProduct } = product;
    console.log('Producto agregado:', cleanProduct, userId);
  return from(this.supabase.from('products').insert([{ ...cleanProduct, user_id: userId }]));
}

}
