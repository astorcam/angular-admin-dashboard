import { SupabaseClient,User, Session } from '@supabase/supabase-js';
import { from, map, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { SupabaseService } from './supabase.service';



@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  @LocalStorage('sb-session') session: Session | null = null;

constructor(private supabaseService: SupabaseService) {
  this.supabase = this.supabaseService.client;
}

  // 🔹 Registro de usuario
    signUp(email: string, password: string, extraData: any): Observable<any> {
    return from(this.supabase.auth.signUp({ email, password })).pipe(
      switchMap(async ({ data, error }) => {
        if (error) throw error;

        const user = data.user;
        if (!user) throw new Error('No se pudo crear el usuario');
        const avatarUrl='https://api.dicebear.com/9.x/dylan/png?seed=${'+user.email+'}';
        // 🔸 Insertar datos adicionales en tabla 'users'
        const { error: insertError } = await this.supabase
          .from('admins')
          .insert([
            {
              id: user.id, // usa el mismo UUID que Supabase Auth
              name: extraData.name,
              avatar: avatarUrl || null,
              created_at: new Date(),
            },
          ]);

        if (insertError) throw insertError;

        return user;
      })
    );
  }

  // 🔹 Inicio de sesión
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
      // Guarda la sesión en localStorage (opcional, para tenerlo accesible)
    this.session = data.session;
    return data;
  }

  // 🔹 Cierre de sesión
  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut().then(() => {this.session = null;
}));
  }

  // 🔹 Obtener usuario actual
  getUser(): Observable<User | null> {
    return from(
      this.supabase.auth.getUser().then(({ data }) => data?.user ?? null)
    );
  }
  getUserProfile(): Observable<any> {
    return this.getUser().pipe(
      switchMap((user) => {
        if (!user) return from([null]); // Si no hay usuario logueado
        return from(
          this.supabase
            .from('admins')
            .select('*')
            .eq('id', user.id) // asumiendo que la columna 'id' coincide con user.id
            .single()
        ).pipe(map(({ data }) => data));
      })
    );
  }

  // 🔹 Comprobar si hay sesión activa (sin Observable)
  isLoggedIn(): boolean {
    return !!this.session; 
  }

  async restoreSession() {
    // Intenta recuperar la sesión activa desde Supabase
    if(this.supabase){
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
  
      if (session) {
        this.session = session; // ✅ restaura sesión en memoria y localStorage
      } else {
        this.session = null;
      }

    }
  }

  getSession() {
    return this.session; 
  }
}
