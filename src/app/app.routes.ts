import { Routes } from '@angular/router';
import { checkoutActivateGuard } from './core/guard/checkout-activate-guard/checkout-activate-guard';
import { AuthRedirectPage } from './pages/auth-redirect-page/auth-redirect-page';
import { UserLayout } from './layouts/user-layout/user-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { productResolver } from './shared/resolvers/product-resolver/product-resolver';
import { orderResolver } from './shared/resolvers/order-resolver/order-resolver';
import { orderDetailResolver } from './shared/resolvers/order-detail-resolver/order-detail-resolver';
import { categoryDetailResolver } from './shared/resolvers/category-detail-resolver/category-detail-resolver';
import { authGuard } from './core/guard/auth-guard/auth-guard';
import { checkoutDeactivateGuard } from './core/guard/checkout-deactivate-guard/checkout-deactivate-guard';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { HomePage } from './pages/home-page/home-page';
import { UserPage } from './pages/user-page/user-page';
import { ProductListPage } from './pages/product-page/product-list-page/product-list-page';
import { CategoryListPage } from './pages/category-page/category-list-page/category-list-page';
import { OrderListPage } from './pages/order-page/order-list-page/order-list-page';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AuthRedirectPage
    },
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            { path: 'login', component: LoginPage },
            { path: 'register', component: RegisterPage}
        ]
    },
    {
        path: 'not-found',
        component: NotFoundPage
    },
    {
        path: '',
        component: UserLayout,
        children: [
            {
                path: 'home',
                component: HomePage
            },
            {
                path: 'checkout',
                loadComponent: () => import('./pages/checkout-page/checkout-page').then(m => m.CheckoutPage),
                canActivate: [checkoutActivateGuard],
                canDeactivate: [checkoutDeactivateGuard]
            },
            {
                path: 'orders/user',
                loadComponent: () => import('./pages/order-page/order-list-page/order-list-page').then(m => m.OrderListPage),
                canActivate: [authGuard]
            },
            {
                path: 'cart/:userId',
                loadComponent: () => import('./pages/cart-page/cart-list-page/cart-list-page').then(m => m.CartListPage),
                canActivate: [authGuard]
            },
            {
                path: 'products/detail/:id',
                loadComponent: () => import('./pages/product-page/product-detail-page/product-detail-page').then(m => m.ProductDetailPage),
                resolve: { product: productResolver }
            },
            {
                path: 'orders/detail/:orderId',
                loadComponent: () => import('./pages/order-page/order-detail-page/order-detail-page').then(m => m.OrderDetailPage),
                resolve: { order: orderResolver, orderDetail: orderDetailResolver },
                canActivate: [authGuard]
            },
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            {
                path: 'users',
                component: UserPage,
                canActivate: [checkoutActivateGuard]
            },
            {
                path: 'products',
                // canActivate: [checkoutActivateGuard],
                children: [
                    {
                        path: '',
                        component: ProductListPage
                    }
                ]
            },
            {
                path: 'categories',
                canActivate: [checkoutActivateGuard],
                children: [
                    { path: '', component: CategoryListPage },
                    {
                        path: 'create',
                        loadComponent: () => import('./pages/category-page/category-edit-page/category-edit-page').then(m => m.CategoryEditPage)
                    },
                    {
                        path: 'edit/:id',
                        loadComponent: () => import('./pages/category-page/category-edit-page/category-edit-page').then(m => m.CategoryEditPage),
                        resolve: { category: categoryDetailResolver }
                    },
                ]
            },
            {
                path: 'orders',
                canActivate: [checkoutActivateGuard],
                children: [
                    { path: '', component: OrderListPage },
                    {
                        path: 'detail/:orderId',
                        loadComponent: () => import('./pages/order-page/order-detail-page/order-detail-page').then(m => m.OrderDetailPage),
                        resolve: { order: orderResolver, orderDetail: orderDetailResolver }
                    }
                ]
            },
        ]
    },
    // { path: '**', redirectTo: 'not-found' }
];
