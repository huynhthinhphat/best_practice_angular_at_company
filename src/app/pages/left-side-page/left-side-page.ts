import { AfterViewInit, Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ResizableDirective } from '../../shared/directives/resizable-directive/resizable-directive';
import { Store } from '@ngrx/store';
import { selectAllCategories } from '../../shared/services/category-service/state/category.selector';
import { Category } from '../../shared/models/category.model';
import { User } from '../../shared/models/user.model';
import { selectUser } from '../../shared/services/user-service/state/user.selector';
import { StorageService } from '../../shared/services/storage-service/storage-service';
import { STORAGE_KEYS } from '../../shared/constants/storage.constants';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../shared/services/category-service/category-service';

@Component({
  selector: 'app-left-side-page',
  imports: [CommonModule, RouterLink, ResizableDirective],
  templateUrl: './left-side-page.html',
  styleUrl: './left-side-page.scss'
})
export class LeftSidePage implements OnInit, AfterViewInit, OnDestroy {
  private categoryTab = viewChild<ElementRef>('categoryTab');

  private store = inject(Store);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private categoryService = inject(CategoryService);

  public isExpanding = computed(() => this.currentWidth() > this.minWidth);
  public minWidth: number = 70;
  public maxWidth: number = 1000;
  public currentWidth = signal<number>(202);

  public currentUser = toSignal(this.store.select(selectUser));
  public categories = signal<Category[]>([]);
  public selectedCategoryName = signal<string>('');
  public routers: {route: string, icon: string}[] = [];

  public titleBtn = 'Toggle Navigation';
  public textFirstCategory = 'All';

  constructor() {
    effect(() => {
      if (this.currentUser()?.role === 'Admin') {
        this.routers = [
          {route: 'users', icon: 'fa-users'},
          {route: 'products', icon: 'fa-box'},
          {route: 'categories', icon: 'fa-tags'},
          {route: 'orders', icon: 'fa-receipt'},
        ];

        const paths = this.router.url.split('/');
        const router = paths[paths.length - 1];

        this.selectedCategoryName.set(router);
      }
    })
  }

  ngOnInit() {
    this.store.select(selectAllCategories).subscribe(categories => this.categories.set(categories));
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

  public onCategoryClick(name: string) {
    this.categoryService.categoryName.set(name);
    this.selectedCategoryName.set(name)
  }

  public toggleTab() {
    const newWidth = this.isExpanding() ? this.minWidth : 202;
    this.currentWidth.set(newWidth);
  }

  ngOnDestroy() {
    this.selectedCategoryName.set('');
    this.categoryService.categoryName.set('');
  }
}
