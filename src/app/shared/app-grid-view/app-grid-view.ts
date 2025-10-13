import { Component, effect, ElementRef, inject, input, OnDestroy, OnInit, output, signal, viewChildren } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ColumnDef } from '../models/column-def.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth';
import { ActionMenuDirective } from '../directives/action-menu-directive/action-menu-directive';
import { ResizableDirective } from '../directives/resizable-directive/resizable-directive';
import { ColumnsSortDirective } from '../directives/columns-sort-directive/columns-sort-directive';
import { BUTTON_TOOLTIP } from '../constants/message.constants';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { getCurrentUser } from '../../pages/user-page/user.selector';

@Component({
  selector: 'app-grid-view',
  imports: [RouterLink, ActionMenuDirective, ResizableDirective, ColumnsSortDirective],
  templateUrl: './app-grid-view.html',
  styleUrl: './app-grid-view.scss',
  standalone: true,
  providers: [CurrencyPipe, DatePipe, UpperCasePipe]
})
export class AppGridView<T> implements OnDestroy {   
  private store = inject(Store<AppState>);
  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  private tdTbody = viewChildren<ElementRef>('tdTbody');

  public columns = input<ColumnDef<T>[]>([]);
  public maxHeight = input<number>(0);
  public tableData = input<T[]>([]);

  public actionEmit = output<{ action: string, rowData: T }>();
  public sortEmit = output<SortOption<T>>();

  public columnList = signal<ColumnDef<T>[]>([]);
  public currentUser = toSignal(this.store.select(getCurrentUser));
  public tooltipToogleBtn = BUTTON_TOOLTIP.TOOGLE;
  public tooltipEditBtn = BUTTON_TOOLTIP.EDIT;
  public tooltipDeleteBtn = BUTTON_TOOLTIP.DELETE;
  public tooltipColumnManagement = BUTTON_TOOLTIP.COLUMN_MANAGEMENT;

  public item = signal<T | null>(null);
  public draggedIndex = signal<number | null>(null);
  public isShow = signal<boolean>(true);

  constructor() {
    effect(() => {
      this.cloneColumns();
    })
  }

  public getFieldAsString(row: T, field: keyof T, pipeName: string = ''): string {
    let value = row[field];
    if (value == null) return '';

    switch (pipeName) {
      case 'currency':
        return this.currencyPipe.transform(Number(value), 'VND', 'symbol', '1.0-0') || '0';
      case 'date':
        return this.datePipe.transform(value as string, 'HH:mm dd/MM/yyyy') || '';
      case 'uppercase':
        const val = value as string;
        return value ? val.charAt(0).toUpperCase() + val.slice(1) : '';
      default:
        return String(value);
    }
  }

  public getId(row: { id?: string }): string {
    return row.id ?? '';
  }

  public setData(item: T) {
    if (!item) return;
    this.item.set(item);
  }

  public handleActions(action: string) {
    if (!this.item()) return;
    this.actionEmit.emit({ action: action, rowData: this.item()! });
  }

  public handleWithChange(data: { columnIndex: number, width: number }) {
    if (!data) return;

    const { columnIndex, width } = data;

    this.tdTbody()
      .map(item => item.nativeElement as HTMLElement)
      .filter(element => element.getAttribute('data-col-index') === columnIndex.toString())
      .forEach(element => element.style.width = `${width}px`);
    
    this.columnList()[columnIndex].width = width;
  }

  public onSort(data: SortOption<T>) {
    if (!data) return;
    this.sortEmit.emit(data);
  }

  public onColumnToggle(index: number) {
    this.columnList()[index].isShow = !this.columnList()[index].isShow;

    const isVisible = this.columnList().some(item => item.isShow);
    this.isShow.set(isVisible);
  }

  public onResetColumns() {
    this.cloneColumns();
  }

  private cloneColumns() {
    const clonedColumns = this.columns().map(col => ({ ...col }));
    this.columnList.set([...clonedColumns]);
    this.isShow.set(true);
  }

  public onDragStart(event: DragEvent, index: number) {
    this.draggedIndex.set(index);
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('text/plain', index.toString());
    (event.target as HTMLElement).classList.add('dragging');
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault(); 
  }

  public onDragEnter(index: number) {
    const fromIndex = this.draggedIndex();
    if (fromIndex === null || fromIndex === index) return;

    const updated = [...this.columnList()];

    const [moved] = updated.splice(fromIndex, 1);

    updated.splice(index, 0, moved);

    this.columnList.set(updated);

    this.draggedIndex.set(index);
  }

  public onDragEnd(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('dragging');
    this.draggedIndex.set(null);
  }

  ngOnDestroy() {
    this.item.set(null);
  }
}
