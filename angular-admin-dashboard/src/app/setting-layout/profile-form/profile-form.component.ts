import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent {
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
  profileForm!: FormGroup;
  fullName!: string;
  email!: string|undefined;
  age!: string;
  country!: string;
  


  constructor(private fb: FormBuilder,
    private authService:AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      country: [''],
      avatar: [null]
    },
     { validators: this.passwordMatchValidator }
  );
  }

ngOnInit(){
   this.authService.getUserProfile().subscribe((profile) => {
      if (profile) {
        this.fullName = profile.name; 
        this.country = profile.country; 
      }
    });
   this.authService.getUser().subscribe((user) => {
      if (user) {
        this.email = user.email; 
      }
    });

}
  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile data:', this.profileForm.value);
      alert('✅ Profile updated successfully!');
    } else {
      alert('⚠️ Please fill all required fields correctly.');
    }
  }

  passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
}
