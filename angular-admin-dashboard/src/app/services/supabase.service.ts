import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const supabaseUrl = environment.supabaseUrl;
    const supabaseKey = environment.supabaseKey;

    // ✅ Solo crear el cliente si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } 
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
