import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { Product, Order } from '../../models';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  product: Product | null = null;

  shipping = {
    name: '',
    address: '',
    city: 'Kuala Lumpur',
    zip: '',
    phone: ''
  };

  isProcessing = false;
  paymentSuccess = false;
  orderId = '';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['product']) {
      this.product = nav.extras.state['product'] as Product;
    }
  }

  ngOnInit(): void {
    if (!this.product) {
      // Redirect if no product (e.g. reload page lose state)
      // In real app, fetch from persisted cart or service
      this.router.navigate(['/']);
    }

    // Pre-fill user data
    const user = this.authService.currentUserValue;
    if (user) {
      this.shipping.name = user.name;
      this.shipping.address = user.address || '';
    }
  }

  processPayment() {
    if (!this.product) return;

    this.isProcessing = true;

    // Simulate PayPal interaction
    setTimeout(() => {
      this.completeOrder();
    }, 2000);
  }

  completeOrder() {
    if (!this.product) return;

    const user = this.authService.currentUserValue;
    this.orderId = 'ORD-' + Date.now();

    const newOrder: Order = {
      id: this.orderId,
      userId: user ? user.id : 0, // 0 for guest
      items: [{ product: this.product, quantity: 1 }],
      totalAmount: this.product.price,
      date: new Date(),
      status: 'Paid',
      paymentId: 'PAY-SANDBOX-' + Math.floor(Math.random() * 10000)
    };

    this.orderService.createOrder(newOrder).subscribe(() => {
      this.isProcessing = false;
      this.paymentSuccess = true;
    });
  }

  downloadReceipt() {
    if (!this.product) return;

    const doc = new jsPDF();

    // Branding
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // Primary color
    doc.text('FurniLink', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('by COURTS Malaysia', 105, 25, { align: 'center' });

    doc.line(20, 30, 190, 30);

    // Order Info
    doc.setFontSize(12);
    doc.text(`Order ID: ${this.orderId}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 45);

    doc.text('Customer Details:', 20, 60);
    doc.setFontSize(10);
    doc.text(this.shipping.name, 20, 66);
    doc.text(this.shipping.address, 20, 71);
    doc.text(`${this.shipping.city}, ${this.shipping.zip}`, 20, 76);

    // Product Table
    doc.setFillColor(241, 245, 249);
    doc.rect(20, 85, 170, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 25, 91);
    doc.text('Price', 150, 91, { align: 'right' });
    doc.text('Total', 185, 91, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text(this.product.name, 25, 105);
    doc.text(`RM ${this.product.price}`, 150, 105, { align: 'right' });
    doc.text(`RM ${this.product.price}`, 185, 105, { align: 'right' });

    doc.line(20, 115, 190, 115);

    // Total
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Paid: RM ${this.product.price}`, 190, 130, { align: 'right' });

    doc.save(`Receipt-${this.orderId}.pdf`);
  }
}
