import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Shop } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  // Mock Courts Malaysia locations
  private shops: Shop[] = [
    {
      id: 1,
      name: 'COURTS Megastore Sri Damansara',
      address: 'No. 1, Jalan Cempaka SD 12/5, Bandar Sri Damansara, 52200 Kuala Lumpur',
      latitude: 3.1979,
      longitude: 101.6086
    },
    {
      id: 2,
      name: 'COURTS Setapak',
      address: 'No. 67, Jalan Genting Kelang, Setapak, 53300 Kuala Lumpur',
      latitude: 3.1935,
      longitude: 101.7226
    },
    {
      id: 3,
      name: 'COURTS Cheras',
      address: 'No. 189, Jalan Cheras, Batu 2 1/2, 56100 Kuala Lumpur',
      latitude: 3.1234,
      longitude: 101.7295
    },
    {
      id: 4,
      name: 'COURTS Subang USJ',
      address: 'USJ 1, Taman Subang Permai, 47600 Subang Jaya, Selangor',
      latitude: 3.0601,
      longitude: 101.5950
    },
    {
      id: 5,
      name: 'COURTS Kajang',
      address: 'Lot 2, Jalan Tun Abdul Aziz, 43000 Kajang, Selangor',
      latitude: 2.9928,
      longitude: 101.7925
    }
  ];

  constructor() { }

  getShops(): Observable<Shop[]> {
    return of(this.shops);
  }

  getNearestShops(userLat: number, userLng: number): Observable<Shop[]> {
    const shopsWithDist = this.shops.map(shop => {
      const distance = this.calculateDistance(userLat, userLng, shop.latitude, shop.longitude);
      return { ...shop, distance };
    });

    return of(shopsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(2));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
