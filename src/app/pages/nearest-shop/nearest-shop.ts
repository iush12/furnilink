import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop';
import { Shop } from '../../models';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-nearest-shop',
  imports: [CommonModule],
  templateUrl: './nearest-shop.html',
  styleUrl: './nearest-shop.css'
})
export class NearestShop implements OnInit {
  shops$ = new BehaviorSubject<Shop[]>([]);
  isLoading = false;
  error = '';
  userLocation: { lat: number, lng: number } | null = null;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    // Initial load (unsorted or default)
    this.shopService.getShops().subscribe(shops => {
      this.shops$.next(shops);
    });
  }

  findNearest() {
    this.isLoading = true;
    this.error = '';

    if (!navigator.geolocation) {
      this.error = 'Geolocation is not supported by your browser';
      this.isLoading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.shopService.getNearestShops(this.userLocation.lat, this.userLocation.lng)
          .subscribe(shops => {
            this.shops$.next(shops);
            this.isLoading = false;
          });
      },
      (err) => {
        this.error = 'Unable to retrieve your location. Please enable location services.';
        this.isLoading = false;
        console.error(err);
      }
    );
  }
}
