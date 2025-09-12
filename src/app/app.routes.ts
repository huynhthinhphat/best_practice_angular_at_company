import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'products/details/:id', loadComponent: () => import('./pages/product-page/product-detail-page/product-detail-page').then(m => m.ProductDetailPage) }
];
