import { AfterViewInit, Directive, effect, ElementRef, HostListener, inject, input, OnInit, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appColumnsSortDirective]',
  standalone: true
})
export class ColumnsSortDirective<T> implements OnInit, AfterViewInit{
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  public columnKey = input<keyof T>();
  public directionEmit = output<SortOption<T>>();

  private direction: 'asc' | 'desc' | '' = 'asc';
  private host!: HTMLElement;
  private icon!: HTMLElement | null;

  ngOnInit() {
    this.host = this.elementRef.nativeElement as HTMLElement;

  }

  ngAfterViewInit() {
    if (this.host) {
      this.icon = this.host.querySelector('i');
      if (this.icon) {
        this.renderer.setStyle(this.host, 'cursor', 'pointer');
      }
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.handleIElement(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.handleIElement(false);
  }

  private handleIElement(isAdd: boolean) {
    if (!this.icon || ['fa-chevron-up', 'fa-chevron-down'].some(className => this.icon!.classList.contains(className))) return;

    let className = 'fa-sort';
    if (isAdd) {
      this.renderer.addClass(this.icon, className);
      return;
    }
    this.renderer.removeClass(this.icon, className);
  }

  @HostListener('click')
  public toggleSort() {
    if (!this.icon) return; 

    this.renderer.removeClass(this.icon, 'fa-sort');
    let removedClassName = '';
    let addedClassName = '';

    if (this.direction === 'asc') {
      removedClassName = 'fa-chevron-down';
      addedClassName = 'fa-chevron-up';
    } else if (this.direction === 'desc') {
      removedClassName = 'fa-chevron-up';
      addedClassName = 'fa-chevron-down';
    } else {
      removedClassName = 'fa-chevron-down';
      addedClassName = 'fa-sort';
    }

    this.handleClass(removedClassName, addedClassName);

    const sortOption : SortOption<T> = {column: this.columnKey()!, direction: this.direction}
    this.directionEmit.emit(sortOption);
    this.direction = this.direction === 'asc' ? 'desc' : (this.direction === 'desc' ? '' : 'asc');
  }

  private handleClass(removedClassName: string, addedClassName: string) {
    this.renderer.removeClass(this.icon, removedClassName);
    this.renderer.addClass(this.icon, addedClassName);
  }
}
