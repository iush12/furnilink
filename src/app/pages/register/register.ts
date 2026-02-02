import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { User } from '../../models';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user: Partial<User> = {
    name: '',
    email: '',
    password: '',
    address: ''
  };
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    setTimeout(() => {
      this.authService.register(this.user as User).subscribe(success => {
        this.isLoading = false;
        if (success) {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        } else {
          this.error = 'Email already exists';
        }
      });
    }, 1000);
  }
}
