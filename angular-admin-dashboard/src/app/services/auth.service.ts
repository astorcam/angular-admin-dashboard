import { createClient, SupabaseClient, AuthResponse, User } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroment';
import { from, Observable, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase!: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
  }

  // 🔹 Registro de usuario
    signUp(email: string, password: string, extraData: any): Observable<any> {
    return from(this.supabase.auth.signUp({ email, password })).pipe(
      switchMap(async ({ data, error }) => {
        if (error) throw error;

        const user = data.user;
        if (!user) throw new Error('No se pudo crear el usuario');

        // 🔸 Insertar datos adicionales en tabla 'users'
        const { error: insertError } = await this.supabase
          .from('users_info')
          .insert([
            {
              id: user.id, // usa el mismo UUID que Supabase Auth
              name: extraData.name,
              role: extraData.role || 'User',
              country: extraData.country || null,
              avatar: extraData.avatar || null,
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
    return data;
  }

  // 🔹 Cierre de sesión
  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut().then(() => {}));
  }

  // 🔹 Obtener usuario actual
  getUser(): Observable<User | null> {
    return from(
      this.supabase.auth.getUser().then(({ data }) => data?.user ?? null)
    );
  }

  // 🔹 Comprobar si hay sesión activa (sin Observable)
  async isLoggedIn(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session;
  }
}
