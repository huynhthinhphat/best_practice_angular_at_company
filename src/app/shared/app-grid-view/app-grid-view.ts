import { Component, inject, input, output } from '@angular/core';
import { StatusIcon } from '../directives/status-icon/status-icon';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ColumnDef } from '../models/column-def.model';
import { Actions } from '../models/actions.model';

@Component({
  selector: 'app-grid-view',
  imports: [StatusIcon],
  templateUrl: './app-grid-view.html',
  styleUrl: './app-grid-view.scss',
  standalone: true,
  providers: [CurrencyPipe, DatePipe, UpperCasePipe]
})
export class AppGridView<T> {
  public columns = input<ColumnDef<T>[]>([]);
  public tableData = input<T[]>([]);
  public actionClickEmit = output<{ action: Actions<T>, rowData: T }>();

  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  public getFieldAsString(row: T, field: keyof T, pipeName: string = ''): string {
    let value = row[field];
    if (value == null) return '';

    switch (pipeName) {
      case 'currency':
        return this.currencyPipe.transform(Number(value), 'VND', 'symbol', '1.0-0') || '';
      case 'date':
        return this.datePipe.transform(value as string, 'hh:MM dd/MM/yyyy') || '';
      case 'uppercase':
        const val = value as string;
        return value ? val.charAt(0).toUpperCase() + val.slice(1) : '';
      default:
        return String(value);
    }
  }

  public actionClick(action: Actions<T>, rowData: T) {
    this.actionClickEmit.emit({ action, rowData });
  }
}
