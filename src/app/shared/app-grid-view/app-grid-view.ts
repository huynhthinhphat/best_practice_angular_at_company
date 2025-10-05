import { Component, effect, inject, input, OnDestroy, output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ColumnDef } from '../models/column-def.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth';
import { ActionMenuDirective } from '../directives/action-menu-directive/action-menu-directive';
import { ResizableDirective } from '../directives/resizable-directive/resizable-directive';

@Component({
  selector: 'app-grid-view',
  imports: [RouterLink, ActionMenuDirective, ResizableDirective],
  templateUrl: './app-grid-view.html',
  styleUrl: './app-grid-view.scss',
  standalone: true,
  providers: [CurrencyPipe, DatePipe, UpperCasePipe]
})
export class AppGridView<T> implements OnDestroy {
  private authService = inject(AuthService);
  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  public columns = input<ColumnDef<T>[]>([]);
  public maxHeight = input<number>(0);
  public tableData = input<T[]>([]);

  public actionEmit = output<{ action: string, rowData: T }>();

  public currentUser = this.authService.currentUser;
  public tooltipToogleBtn = 'Toggle Actions';
  public tooltipEditBtn = 'Edit item';
  public tooltipDeleteBtn = 'Delete item';
  public tooltipColumnManagement = 'Choose columns';

  public columnIndex = signal<number>(0);
  public item = signal<T | null>(null);

  public setColumnIndex(index: number) {
    this.columnIndex.set(index);
  }

  public getFieldAsString(row: T, field: keyof T, pipeName: string = ''): string {
    let value = row[field];
    if (value == null) return '';

    switch (pipeName) {
      case 'currency':
        return this.currencyPipe.transform(Number(value), 'VND', 'symbol', '1.0-0') || '0';
      case 'date':
        return this.datePipe.transform(value as string, 'hh:MM dd/MM/yyyy') || '';
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
    this.item.set(item);
  }

  public handleActions(action: string) {
    if (!this.item()) return;
    this.actionEmit.emit({ action: action, rowData: this.item()! });
  }

  public handleWithChange(width: number) {
    console.log(width)
  }

  ngOnDestroy() {
    this.item.set(null);
  }
}
