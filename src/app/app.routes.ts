import { Routes } from '@angular/router';
import { checkoutGuard } from './core/guard/checkout-guard/checkout-guard';
import { AuthRedirectPage } from './pages/auth-redirect-page/auth-redirect-page';
import { UserLayout } from './layouts/user-layout/user-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { productResolver } from './shared/resolvers/product-resolver/product-resolver';
import { orderResolver } from './shared/resolvers/order-resolver/order-resolver';
import { orderDetailResolver } from './shared/resolvers/order-detail-resolver/order-detail-resolver';
import { categoryDetailResolver } from './shared/resolvers/category-detail-resolver/category-detail-resolver';
import { authGuard } from './core/guard/auth-guard/auth-guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: AuthRedirectPage },

    { path: 'login', loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage) },
    { path: 'register', loadComponent: () => import('./pages/register-page/register-page').then(m => m.RegisterPage) },

    { path: 'not-found', loadComponent: () => import('./pages/not-found-page/not-found-page').then(m => m.NotFoundPage) },

    {
        path: '',
        component: UserLayout,
        children: [
            { path: 'home', loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage) },
            { path: 'checkout', loadComponent: () => import('./pages/checkout-page/checkout-page').then(m => m.CheckoutPage), canActivate: [checkoutGuard] },
            { path: 'orders/user', loadComponent: () => import('./pages/order-page/order-list-page/order-list-page').then(m => m.OrderListPage), canActivate: [authGuard] },
            { path: 'cart/:userId', loadComponent: () => import('./pages/cart-page/cart-list-page/cart-list-page').then(m => m.CartListPage), canActivate: [authGuard] },
            { path: 'products/detail/:id', loadComponent: () => import('./pages/product-page/product-detail-page/product-detail-page').then(m => m.ProductDetailPage), resolve: { product: productResolver } },
            { path: 'orders/detail/:orderId', loadComponent: () => import('./pages/order-page/order-detail-page/order-detail-page').then(m => m.OrderDetailPage), resolve: { order: orderResolver, orderDetail: orderDetailResolver }, canActivate: [authGuard] },
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: 'users', loadComponent: () => import('./pages/user-page/user-page').then(m => m.UserPage), canActivate: [checkoutGuard] },

            { path: 'products', loadComponent: () => import('./pages/product-page/product-list-page/product-list-page').then(m => m.ProductListPage), canActivate: [checkoutGuard] },
            { path: 'products/create', loadComponent: () => import('./pages/product-page/product-edit-page/product-edit-page').then(m => m.ProductEditPage), canActivate: [checkoutGuard] },
            { path: 'products/edit/:id', loadComponent: () => import('./pages/product-page/product-edit-page/product-edit-page').then(m => m.ProductEditPage), canActivate: [checkoutGuard], resolve: { product: productResolver } },

            { path: 'categories', loadComponent: () => import('./pages/category-page/category-list-page/category-list-page').then(m => m.CategoryListPage), canActivate: [checkoutGuard] },
            { path: 'categories/create', loadComponent: () => import('./pages/category-page/category-edit-page/category-edit-page').then(m => m.CategoryEditPage), canActivate: [checkoutGuard] },
            { path: 'categories/edit/:id', loadComponent: () => import('./pages/category-page/category-edit-page/category-edit-page').then(m => m.CategoryEditPage), canActivate: [checkoutGuard], resolve: { category: categoryDetailResolver } },

            { path: 'orders', loadComponent: () => import('./pages/order-page/order-list-page/order-list-page').then(m => m.OrderListPage), canActivate: [checkoutGuard] },
            { path: 'orders/detail/:orderId', loadComponent: () => import('./pages/order-page/order-detail-page/order-detail-page').then(m => m.OrderDetailPage), canActivate: [checkoutGuard], resolve: { order: orderResolver, orderDetail: orderDetailResolver } },
        ]
    },
    { path: '**', redirectTo: 'not-found' }
];
