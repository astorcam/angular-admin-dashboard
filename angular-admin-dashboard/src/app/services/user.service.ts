import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
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
}