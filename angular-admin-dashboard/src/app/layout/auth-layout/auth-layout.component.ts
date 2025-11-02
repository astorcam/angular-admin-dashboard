import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common'; 
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-layout',
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
 countries = [
    'Spain',
    'France',
    'Germany',
    'Italy',
    'United Kingdom',
    'United States',
    'Argentina',
    'Brazil',
    'Mexico',
    'Canada',
    'Australia',
    'Japan'
  ];

  loginForm: FormGroup;
  isLogin: boolean=true;
  isRegister: boolean=false;
  registerForm: FormGroup;
  
  constructor(private fb: FormBuilder,
    private authService:AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
    country: [''],
    });
  }
  
  async onLogin() {
    if (!this.loginForm.valid) return;
    
    const { email, password } = this.loginForm.value;
    
    try {
      // 1️⃣ Hacer login con Supabase
      const { user, session } = await this.authService.signIn(email, password);
      
      if (user) {
        console.log('✅ Login correcto:', user);
        
        // 2️⃣ Guardar la sesión en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('session', JSON.stringify(session));
        
        // 3️⃣ Redirigir al dashboard
        await this.router.navigate(['/dashboard']);
      } else {
      }
    } catch (error: any) {
      console.error('❌ Error al iniciar sesión:', error.message);
    } 
  }
async onRegister() {
  if (this.registerForm.valid) {
    const { email, password, ...extraData } = this.registerForm.value;
    try {
      const result = await firstValueFrom(this.authService.signUp(email, password, extraData));
      console.log('✅ Usuario registrado correctamente:', result);
      this.goLogIn();
    } catch (error: any) {
      console.error('❌ Error al registrar:', error.message);
    }
  }
}

  goLogIn() {
  this.isLogin=true;
  this.isRegister=false ; 

}
  goSignUp() {
  this.isLogin=false;
  this.isRegister=true ; 
}


}
