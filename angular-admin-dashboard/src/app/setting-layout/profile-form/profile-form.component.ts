import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})
export class ProfileFormComponent {
  profileForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;

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
  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      age: [null, [Validators.min(0)]],
      country: [''],
      avatar: [null]
    });
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.profileForm.patchValue({ avatar: file });

      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile data:', this.profileForm.value);
      alert('✅ Profile updated successfully!');
    } else {
      alert('⚠️ Please fill all required fields correctly.');
    }
  }
}
