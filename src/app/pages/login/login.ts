import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.isLoading = true;
    this.error = '';

    // Simulate network delay
    setTimeout(() => {
      this.authService.login(this.email, this.password).subscribe(user => {
        this.isLoading = false;
        if (user) {
          this.router.navigate(['/']);
        } else {
          this.error = 'Invalid email or password';
        }
      });
    }, 1000);
  }
}
