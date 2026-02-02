import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ProductDetails } from './pages/product-details/product-details';
import { Payment } from './pages/payment/payment';
import { OrderHistory } from './pages/order-history/order-history';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { NearestShop } from './pages/nearest-shop/nearest-shop';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'product/:id', component: ProductDetails },
    { path: 'payment', component: Payment },
    { path: 'orders', component: OrderHistory },
    { path: 'admin', component: AdminDashboard },
    { path: 'shops', component: NearestShop },
    { path: '**', redirectTo: '' }
];
