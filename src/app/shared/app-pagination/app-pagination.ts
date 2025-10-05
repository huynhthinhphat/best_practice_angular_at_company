import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './app-pagination.html',
  styleUrl: './app-pagination.scss'
})
export class AppPagination {
  private elementRef = inject(ElementRef);

  public startIndex = input<number>(0);
  public endIndex = input<number>(20);
  public totalItem = input<number>(1);
  public quantityItem = input<number>(1);

  public direction = output<-1 | 1>();
  public quantityItemEmit = output<number>();

  public options: number[] = [10, 20, 50, 70, 100];
  public isShowMenu = signal<boolean>(false);

  public handleNavigation(direction: -1 | 1) {
    this.direction.emit(direction);
  }

  public handleQuantityItem(index: number) {
    this.quantityItemEmit.emit(this.options[index]);
    this.toggleMenu();
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
