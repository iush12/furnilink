import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { OrderService } from '../../services/order';
import { Product } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  activeTab: 'products' | 'sales' = 'products';
  products$: Observable<Product[]>;
  salesStats: any = null;

  // Product Form State
  showForm = false;
  isEdit = false;
  currentProduct: Product = this.getEmptyProduct();

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    this.orderService.getSalesStats().subscribe(stats => {
      this.salesStats = stats;
    });
  }

  setTab(tab: 'products' | 'sales') {
    this.activeTab = tab;
  }

  getEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      description: '',
      price: 0,
      category: 'Living Room',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', // Default
      rating: 0,
      reviews: [],
      stock: 10,
      dimensions: ''
    };
  }

  openAddForm() {
    this.currentProduct = this.getEmptyProduct();
    this.isEdit = false;
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.currentProduct = { ...product }; // Copy
    this.isEdit = true;
    this.showForm = true;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
    }
  }

  saveProduct() {
    if (this.isEdit) {
      this.productService.updateProduct(this.currentProduct);
    } else {
      this.productService.addProduct(this.currentProduct);
    }
    this.showForm = false;
  }

  cancelForm() {
    this.showForm = false;
  }
}
