import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users';
  supabase: SupabaseClient;
   
    constructor(private http: HttpClient, private supabaseService: SupabaseService) { 
      this.supabase = this.supabaseService.client;
    }

  getUsers(): Observable<any[]> {
    return from(this.supabase.from('buyers').select('*').then(({ data }) => data ?? []));  
  }
  getActiveCustomers(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return from(
      this.supabase
        .from('sales')
        .select('buyer_id', { count: 'exact', head: true })
        .eq('status', 'Completed')
        .gte('date', since.toISOString())
    ).pipe(
      map(({ count, error }) => {
        if (error) {
          console.error('Error fetching active customers', error);
          return 0;
        }
        return count ?? 0;
      })
    );
  }

  getInactiveCustomers(days = 90) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return from(
    this.supabase
      .from('buyers')
      .select('id', { count: 'exact', head: true })
      .not(
        'id',
        'in',
        this.supabase
          .from('sales')
          .select('buyer_id')
          .eq('status', 'Completed')
          .gte('date', since.toISOString())
      )
  ).pipe(
    map(({ count, error }) => {
      if (error) {
        console.error('Error fetching inactive customers', error);
        return 0;
      }
      return count ?? 0;
    })
  );
}
  addCustomer(buyer: any, adminId: string) {
  console.log('Buyer agregado:', buyer, adminId);
  return from(this.supabase.from('buyers').insert([{ ...buyer, admin_id: adminId }]));
}

deleteCustomer(customer: any, userId: string) {
  console.log('Customer borrado:', customer, userId);
  return from(
    this.supabase
    .from('buyers')
    .delete()
    .match({ id: customer.id, admin_id: userId })
  );
}

  editCustomer(editedCustomer: any, admin_id: string) {
    console.log('Customer editado:', editedCustomer, admin_id);
    return from(
    this.supabase
      .from('buyers')
      .update({
        name: editedCustomer.name,
        country: editedCustomer.country,
        email: editedCustomer.email,
      })
      .eq('id', editedCustomer.id)         // ← identificar por ID
      .eq('admin_id', admin_id)          // ← asegurar que sea del admin
  ); 
  }


  getUserById(id: number): Observable<any> {
      return from(
        this.supabaseService.client
        .from('buyers')
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
}