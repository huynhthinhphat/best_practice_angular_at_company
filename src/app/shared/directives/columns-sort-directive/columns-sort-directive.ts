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
    this.handleHover(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.handleHover(false);
  }

  private handleHover(isAdd: boolean) {
    if (!this.icon || ['fa-chevron-up', 'fa-chevron-down'].some(className => this.icon!.classList.contains(className))) return;

    let className = 'fa-sort';
    isAdd ? this.renderer.addClass(this.icon, className) : this.renderer.removeClass(this.icon, className);
  }

  @HostListener('click')
  public toggleSort() {
    if (!this.icon) return; 
    this.renderer.removeClass(this.icon, 'fa-sort');
    
    this.updateIconClass();

    const sortOption: SortOption<T> = { column: this.columnKey()!, direction: this.direction }
    this.directionEmit.emit(sortOption);

    this.direction = this.direction === 'asc' ? 'desc' : (this.direction === 'desc' ? '' : 'asc');
  }

  private updateIconClass() {
    if (!this.icon) return;
    this.renderer.removeClass(this.icon, 'fa-sort');
    this.renderer.removeClass(this.icon, 'fa-chevron-up');
    this.renderer.removeClass(this.icon, 'fa-chevron-down');

    if (this.direction === 'asc') this.renderer.addClass(this.icon, 'fa-chevron-up');
    else if (this.direction === 'desc') this.renderer.addClass(this.icon, 'fa-chevron-down');
    else this.renderer.addClass(this.icon, 'fa-sort');
  }
}
