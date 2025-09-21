import { Component, input, output } from '@angular/core';
import { StatusIcon } from '../directives/status-icon/status-icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ColumnDef } from '../models/column-def.model';
import { Actions } from '../models/actions.model';

@Component({
  selector: 'app-table',
  imports: [StatusIcon, CurrencyPipe, DatePipe],
  templateUrl: './app-table.html',
  styleUrl: './app-table.css',
  standalone: true
})
export class AppTable<T> {
  public columns = input<ColumnDef<T>[]>([]);
  public tableData = input<T[]>([]);
  public actionClickEmit = output<{ action: Actions<T>, rowData: T }>();

  public getFieldAsString(row: T, field: keyof T): string {
    const value = row[field];
    return value != null ? String(value) : '';
  }

  public actionClick(action: Actions<T>, rowData: T) {
    this.actionClickEmit.emit({ action, rowData });
  }
}
