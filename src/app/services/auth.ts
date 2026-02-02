import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@courts.com',
      password: 'password',
      role: 'admin',
      address: 'HQ'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password',
      role: 'customer',
      address: '123 Jalan Ampang, KL'
    }
  ];

  constructor() {
    // Check localStorage (mock persistence)
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User | null> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    }
    return of(null);
  }

  register(user: User): Observable<boolean> {
    const exists = this.users.find(u => u.email === user.email);
    if (exists) {
      return of(false);
    }
    const newUser = { ...user, id: this.users.length + 1, role: 'customer' as 'customer' };
    this.users.push(newUser);
    return of(true);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateProfile(user: User) {
    // mock update
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
