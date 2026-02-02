import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Product } from '../../models';
import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products$: Observable<Product[]>;
  searchQuery = new BehaviorSubject<string>('');
  selectedCategory = new BehaviorSubject<string>('All');

  categories = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office'];

  filteredProducts$: Observable<Product[]>;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();

    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchQuery,
      this.selectedCategory
    ]).pipe(
      map(([products, search, category]) => {
        return products.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase());
          const matchesCategory = category === 'All' || p.category === category;
          return matchesSearch && matchesCategory;
        });
      })
    );
  }


  ngOnInit(): void { }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.next(target.value);
  }

  setCategory(category: string) {
    this.selectedCategory.next(category);
  }
}
