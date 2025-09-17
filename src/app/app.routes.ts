import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'products/details/:id', loadComponent: () => import('./pages/product-page/product-detail-page/product-detail-page').then(m => m.ProductDetailPage) },
    { path: 'cart/:userId', loadComponent: () => import('./pages/cart-page/cart-list-page/cart-list-page').then(m => m.CartListPage) },
    { path: 'checkout', loadComponent: () => import('./pages/checkout-page/checkout-page').then(m => m.CheckoutPage) }
];
