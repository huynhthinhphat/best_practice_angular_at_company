import { Component, effect, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorHelper } from '../helpers/pagination.helper';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './app-pagination.html',
  styleUrl: './app-pagination.scss'
})
export class AppPagination<T> {
  private elementRef = inject(ElementRef);

  public dataInput = input<T[]>([]);
  public dataOutput = output<T[]>();

  public paginator = new PaginatorHelper(() => this.dataInput());

  public startIndex = this.paginator.startIndex;
  public endIndex = this.paginator.endIndex;
  public totalItem = this.paginator.totalItem;
  public quantityItem = this.paginator.quantityItem;
  public receivedData = this.paginator.currentPageItems;

  public options: number[] = [10, 20, 50, 70, 100];
  public isShowMenu = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.dataOutput.emit(this.receivedData());
    });

    effect(() => {
      const data = this.dataInput();
      if (!data) return;

      this.paginator.handleQuantityItem(this.paginator.quantityItem());
    });
  }

  public handleNavigation(direction: -1 | 1) {
    this.paginator.handleNavigation(direction);
  }

  public handleQuantityItem(index: number) {
    this.paginator.handleQuantityItem(this.options[index]);

    if (this.isShowMenu()) {
      this.toggleMenu()
    }
  }

  public toggleMenu() {
    this.isShowMenu.update(val => !val);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.querySelector('.select-container').contains(event.target)) {
      this.isShowMenu.set(false);
    }
  }
}
