import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { Product, Review } from '../../models';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  product$: Observable<Product | undefined>;

  newReview: Partial<Review> = { rating: 5, comment: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    public authService: AuthService
  ) {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.productService.getProductById(id);
      })
    );
  }

  ngOnInit(): void { }

  buyNow(product: Product) {
    // Navigate to payment with product details
    // Ideally we store this in a 'CurrentTransactionService' or pass state
    // For now, we will use router state
    this.router.navigate(['/payment'], { state: { product: product } });
  }

  submitReview(productId: number) {
    const user = this.authService.currentUserValue;
    if (!user) {
      alert('Please login to review');
      this.router.navigate(['/login']);
      return;
    }

    const review: Review = {
      id: Date.now(),
      productId,
      userId: user.id,
      userName: user.name,
      rating: this.newReview.rating || 5,
      comment: this.newReview.comment || '',
      date: new Date()
    };

    this.productService.addReview(productId, review).subscribe(() => {
      this.newReview = { rating: 5, comment: '' };
      // Refresh or let the observable handle update if subject-based (it is)
    });
  }
}
