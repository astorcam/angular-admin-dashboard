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

  addBuyer(buyer: any, adminId: string) {
  console.log('Buyer agregado:', buyer, adminId);
  return from(this.supabase.from('buyers').insert([{ ...buyer, admin_id: adminId }]));
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