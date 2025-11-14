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
    return from(this.supabase.from('users_info').select('*').then(({ data }) => data ?? []));  
  }
}