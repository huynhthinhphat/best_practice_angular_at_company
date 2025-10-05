import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CategoryService } from '../../shared/services/category-service/category-service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product-service/product-service';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router, RouterLink } from '@angular/router';
import { ResizableDirective } from '../../shared/directives/resizable-directive/resizable-directive';

@Component({
  selector: 'app-left-side-page',
  imports: [CommonModule, RouterLink, ResizableDirective],
  templateUrl: './left-side-page.html',
  styleUrl: './left-side-page.scss'
})
export class LeftSidePage implements OnInit, AfterViewInit, OnDestroy {
  private categoryTab = viewChild<ElementRef>('categoryTab');

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isExpanding = computed(() => this.currentWidth() > this.minWidth);
  public minWidth: number = 70;
  public maxWidth: number = 500;
  public currentWidth = signal<number>(202);

  public currentUser = this.authService.currentUser;
  public categories = this.categoryService.categories;
  public selectedCategoryId = signal<string>('');
  public routers: {route: string, icon: string}[] = [];

  public titleBtn = 'Toggle Navigation';

  ngOnInit() {
    if (this.currentUser()?.role === 'Admin') {
      this.routers = [
        {route: 'users', icon: 'fa-users'},
        {route: 'products', icon: 'fa-box'},
        {route: 'categories', icon: 'fa-tags'},
        {route: 'orders', icon: 'fa-receipt'},
      ];

      const paths = this.router.url.split('/');
      const router = paths[paths.length - 1];

      this.selectedCategoryId.set(router);
      this.router.navigate([`/admin/${router}`], { state: { isAdmin: true } });
    }
  }

  ngAfterViewInit() {
    let nativeElement = this.categoryTab()?.nativeElement;
    if (!nativeElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        this.currentWidth.set(width);
      }
    });
    resizeObserver.observe(nativeElement);
  }

  public onCategoryClick(categoryId: string) {
    if (!this.currentUser() || this.currentUser()?.role === 'User') {
      this.productService.categoryId.set(categoryId);
    }

    this.selectedCategoryId.set(categoryId);
  }

  public toggleTab() {
    const newWidth = this.isExpanding() ? this.minWidth : 202;
    this.currentWidth.set(newWidth);
  }

  ngOnDestroy() {
    this.selectedCategoryId.set('');
  }
}
