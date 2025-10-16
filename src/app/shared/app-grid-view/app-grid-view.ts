import { Component, computed, effect, ElementRef, inject, input, OnDestroy, OnInit, output, signal, viewChildren } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ColumnDef } from '../models/column-def.model';
import { RouterLink } from '@angular/router';
import { ActionMenuDirective } from '../directives/action-menu-directive/action-menu-directive';
import { ResizableDirective } from '../directives/resizable-directive/resizable-directive';
import { ColumnsSortDirective } from '../directives/columns-sort-directive/columns-sort-directive';
import { BUTTON_TOOLTIP } from '../constants/message.constants';
import { AppForm } from '../app-form/app-form';
import { AppDialog } from '../app-dialog/app-dialog';
import { FormFields } from '../models/form-field.model';
import { initForm } from '../helpers/form.helper';
import { AppPagination } from '../app-pagination/app-pagination';

@Component({
  selector: 'app-grid-view',
  imports: [RouterLink, ActionMenuDirective, ResizableDirective, ColumnsSortDirective, AppDialog, AppForm, AppPagination],
  templateUrl: './app-grid-view.html',
  styleUrl: './app-grid-view.scss',
  standalone: true,
  providers: [CurrencyPipe, DatePipe, UpperCasePipe]
})
export class AppGridView<T> implements OnInit {
  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  private tdTbody = viewChildren<ElementRef>('tdTbody');

  public headers = input<ColumnDef<T>[]>([]);
  public fields = input<FormFields[]>([]);
  public maxHeight = input<number>(0);
  public tableData = input<T[]>([]);
  public titleDialog = input<string>('');
  public buttonLabel = input<string>('');
  public isDialogHidden = input<boolean>(false);

  public actionEmit = output<{ action?: string, prevData?: T | null, newData?: T | null, ids?: string[] }>();

  public columnList = signal<ColumnDef<T>[]>([]);
  public fieldList = signal<FormFields[]>([]);

  public tooltipToogleBtn = BUTTON_TOOLTIP.TOOGLE;
  public tooltipEditBtn = BUTTON_TOOLTIP.EDIT;
  public tooltipDeleteBtn = BUTTON_TOOLTIP.DELETE;
  public tooltipColumnManagement = BUTTON_TOOLTIP.COLUMN_MANAGEMENT;
  public tooltipCreateBtn = BUTTON_TOOLTIP.CREATE;

  private item: T | null = null;
  public draggedIndex = signal<number | null>(null);
  public isShow = signal<boolean>(true);
  public startIndex = signal<number>(1);
  public endIndex = signal<number>(10);
  public quantityItem = signal<number>(10);
  public isToggleDialog = signal<boolean>(false);
  private prevAction: string = '';
  private prevData: T | null = null;
  private selectedSortOptions: SortOption<T>[] = [];
  private allData = signal<T[]>([]);
  private originalData = signal<T[]>([]);
  public filteredData = computed(() => [...this.allData()].slice(this.startIndex() - 1, this.endIndex()));

  constructor() {
    effect(() => {
      this.initData();
      this.setEndIndex();
      this.cloneColumns();

      if (this.isDialogHidden()) {
        this.setToggleDialog(false);
      }
    })
  }

  ngOnInit() {
    this.fieldList.set(this.fields());
  }

  private initData() {
    const data = this.tableData();
    if (data.length !== this.allData().length || this.isDialogHidden()) {
      this.allData.set(data);
      this.originalData.set([...data]);
    }
  }

  private setEndIndex() {
    const length = this.allData().length;
    this.endIndex.update(val => val > length && length !== 0 ? length : val);
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
    this.prevData = { ...item };
  }

  public handleActions(action: string) {
    let ids: string[] = [];
    let newData = this.item;
    let prevData = this.prevData;

    if (action === 'edit') {
      this.setToggleDialog(true, action);
      return;
    }

    if (action === 'delete') {
      if (!prevData) return;

      const id = this.getId(prevData);
      newData = null;
      prevData = null;

      ids.push(id);
    } else if (action === 'submit') {
      if (this.prevAction === 'create') {
        prevData = null;
      }
    }

    this.emitData(action, prevData, newData, ids);

    this.item = null;
    this.prevData = null;
    this.prevAction = '';
  }

  private emitData(action?: string, prevData?: T | null, newData?: T | null, ids: string[] = []) {
    this.actionEmit.emit({ action: action, prevData: prevData, newData: newData, ids: ids });
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

  public onColumnToggle(index: number) {
    this.columnList()[index].isShow = !this.columnList()[index].isShow;

    const isVisible = this.columnList().some(item => item.isShow);
    this.isShow.set(isVisible);
  }

  public setToggleDialog(isShow: boolean, action: string = '') {
    if (action === 'create') {
      this.fieldList.set(initForm<T>(this.fieldList(), null));
    } else if (action === 'edit') {
      this.fieldList.set(initForm<T>(this.fieldList(), this.prevData));
    }
    this.isToggleDialog.set(isShow);
    this.prevAction = action;
  }

  public onResetColumns() {
    this.cloneColumns();
  }

  private cloneColumns() {
    if(this.columnList().length === 0){
      const clonedColumns = this.headers().map(col => ({ ...col }));
      this.columnList.set([...clonedColumns]);
    }
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

  public emitFormData(data: T) {
    this.item = data;
    this.handleActions('submit');
  }

  public handleNavigation(direction: -1 | 1) {
    let quantity = this.quantityItem();
    let total = this.tableData().length;
    let steps = quantity * direction;

    let nextStart = this.startIndex() + steps;
    let nextEnd = this.endIndex() + steps;

    if (this.endIndex() === total) {
      nextEnd = nextStart + quantity - 1;
    } else if (nextEnd > total) {
      nextEnd = total;
    }

    this.startIndex.set(nextStart);
    this.endIndex.set(nextEnd);
  }

  public handleQuantityItem(quantityItem: number) {
    this.quantityItem.set(quantityItem)

    let total = this.tableData().length;
    let quantity = quantityItem > total ? total : quantityItem;

    this.startIndex.set(1);
    this.endIndex.set(quantity)
  }

  public onSort(data: SortOption<T>) {
    if (!data) return;
    const existing = [...this.selectedSortOptions].find(item => item.column === data.column);

    let direction = data.direction;
    if (!existing) {
      if (direction !== '') {
        this.selectedSortOptions.push(data);
      }
    } else {
      existing.direction = data.direction;
    }

    let sorted = [...this.originalData()];
    let options = [...this.selectedSortOptions.filter(item => item.direction !== '')];

    if (options.length > 0) {
      sorted.sort((a, b) => {
        for (const { column, direction } of options) {
          const firstValue = a[column as keyof T];
          const secondValue = b[column as keyof T];

          if (firstValue == null && secondValue == null) continue;
          if (firstValue == null) return 1;
          if (secondValue == null) return -1;

          let compare = 0;
          let firstNumber = Number(firstValue);
          let secondNumber = Number(secondValue);

          if (Number.isFinite(firstNumber) && Number.isFinite(secondNumber)) {
            compare = firstNumber - secondNumber;
          } else if (typeof firstValue === 'string' && typeof secondValue === 'string') {
            compare = firstValue.localeCompare(secondValue, undefined, { sensitivity: 'base' });
          } else if (firstValue instanceof Date && secondValue instanceof Date) {
            compare = firstValue.getTime() - secondValue.getTime();
          }

          if (compare !== 0) {
            return direction === 'desc' ? -compare : compare;
          }
        }
        return 0;
      });
    }
    this.allData.set([...sorted]);
  }
}
