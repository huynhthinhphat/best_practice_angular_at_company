import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, OnInit, output, signal, viewChild } from '@angular/core';
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
  public currentWidth = signal<number>(202);

  public currentUser = this.authService.currentUser;
  public categories = this.categoryService.categories;
  public selectedCategoryId = signal<string>('');
  public routers: string[] = [];

  ngOnInit() {
    if (this.currentUser()?.role === 'Admin') {
      this.routers = ['users', 'products', 'categories', 'orders'];

      const router = this.routers[0];
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
    const newWidth = this.isExpanding() ? this.minWidth : 250;
    this.currentWidth.set(newWidth);
  }

  ngOnDestroy() {
    this.selectedCategoryId.set('');
  }
}
