import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Order } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [
    {
      id: 'ORD-001',
      userId: 2,
      items: [],
      totalAmount: 1299,
      date: new Date('2023-11-15'),
      status: 'Delivered',
      paymentId: 'PAY-123'
    },
    {
      id: 'ORD-002',
      userId: 2,
      items: [],
      totalAmount: 899,
      date: new Date('2023-12-10'),
      status: 'Shipped',
      paymentId: 'PAY-456'
    }
  ];

  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  constructor() { }

  createOrder(order: Order): Observable<boolean> {
    this.orders.push(order);
    this.ordersSubject.next(this.orders);
    return of(true);
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
    return of(this.orders.filter(o => o.userId === userId));
  }

  getAllOrders(): Observable<Order[]> {
    return of(this.orders);
  }

  getSalesStats(): Observable<any> {
    // Mock sales stats
    const monthly = [12000, 15000, 11000, 18000, 20000, 17000, 22000, 19000, 25000, 28000, 30000, 35000];
    const yearly = 250000;
    return of({ monthly, yearly });
  }
}
