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
    console.log('Producto agregado:', product, userId);
    return from(this.supabase.from('products').insert([{ ...product, admin_id: userId }]));
  }
  
  deleteProduct(product: any, userId: string) {
    console.log('Producto borrado:', product, userId);
    return from(
      this.supabase
      .from('products')
      .delete()
      .match({ id: product.id, admin_id: userId })
    );
  }
  editProduct(editedProduct: any, admin_id: string) {
    console.log('Producto editado:', editedProduct, admin_id);
    return from(
    this.supabase
      .from('products')
      .update({
        name: editedProduct.name,
        category: editedProduct.category,
        price: editedProduct.price,
        stock: editedProduct.stock
      })
      .eq('id', editedProduct.id)         // ← identificar por ID
      .eq('admin_id', admin_id)          // ← asegurar que sea del admin
  ); 
  }

}
