import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product, Review } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Modern Gray Sofa',
      description: 'A comfortable 3-seater sofa with premium gray fabric and wooden legs.',
      price: 1299,
      category: 'Living Room',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      reviews: [],
      stock: 10,
      dimensions: '200x90x85 cm'
    },
    {
      id: 2,
      name: 'Oak Dining Table',
      description: 'Solid oak dining table for 6 people. Minimalist design.',
      price: 899,
      category: 'Dining',
      imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      reviews: [],
      stock: 5,
      dimensions: '180x90x75 cm'
    },
    {
      id: 3,
      name: 'King Size Bed Frame',
      description: 'Luxury upholstered bed frame with storage headers.',
      price: 1599,
      category: 'Bedroom',
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwYmVkfGVufDB8fDB8fHww',
      rating: 4.7,
      reviews: [],
      stock: 8,
      dimensions: '180x200 cm'
    },
    {
      id: 4,
      name: 'Ergonomic Office Chair',
      description: 'High-back mesh chair with lumbar support and adjustable arms.',
      price: 499,
      category: 'Office',
      imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80',
      rating: 4.2,
      reviews: [],
      stock: 20
    },
    {
      id: 5,
      name: 'Minimalist Bookshelf',
      description: '5-tier wooden bookshelf, perfect for living room or study.',
      price: 299,
      category: 'Living Room',
      imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80',
      rating: 4.0,
      reviews: [],
      stock: 15
    },
    {
      id: 6,
      name: 'Velvet Armchair',
      description: 'Emerald green velvet armchair with gold accent legs.',
      price: 599,
      category: 'Living Room',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews: [],
      stock: 4
    }
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  products$ = this.productsSubject.asObservable();

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  addProduct(product: Product): Observable<boolean> {
    product.id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    product.reviews = [];
    this.products.push(product);
    this.productsSubject.next(this.products);
    return of(true);
  }

  updateProduct(product: Product): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      this.productsSubject.next(this.products);
      return of(true);
    }
    return of(false);
  }

  deleteProduct(id: number): Observable<boolean> {
    this.products = this.products.filter(p => p.id !== id);
    this.productsSubject.next(this.products);
    return of(true);
  }

  addReview(productId: number, review: Review): Observable<boolean> {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      if (!product.reviews) product.reviews = [];
      product.reviews.push(review);
      // Recalculate rating
      const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.rating = total / product.reviews.length;
      this.productsSubject.next(this.products);
      return of(true);
    }
    return of(false);
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    return of(this.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    ));
  }
}
