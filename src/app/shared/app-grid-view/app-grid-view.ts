import { Component, inject, input, output, signal } from '@angular/core';
import { StatusIcon } from '../directives/status-icon/status-icon';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ColumnDef } from '../models/column-def.model';
import { Actions } from '../models/actions.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service/auth';
import { AppDialog } from '../app-dialog/app-dialog';
import { ActionMenuDirective } from '../directives/action-menu-directive/action-menu-directive';
import { AppForm } from '../app-form/app-form';

@Component({
  selector: 'app-grid-view',
  imports: [StatusIcon, RouterLink, AppDialog, ActionMenuDirective, AppForm],
  templateUrl: './app-grid-view.html',
  styleUrl: './app-grid-view.scss',
  standalone: true,
  providers: [CurrencyPipe, DatePipe, UpperCasePipe]
})
export class AppGridView<T> {
  private authService = inject(AuthService);

  public currentUser = this.authService.currentUser;

  public columns = input<ColumnDef<T>[]>([]);
  public tableData = input<T[]>([]);
  public actionClickEmit = output<{ action: Actions<T>, rowData: T }>();

  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  public tooltipToogleBtn = 'Toggle Actions';
  public tooltipEditBtn = 'Edit item';
  public tooltipDeleteBtn = 'Delete item';

  public isDialogVisible = signal<boolean>(false);

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

  public getId(row: {id?: string}): string { 
    return row.id ?? '';
  }

  public actionClick(action: Actions<T>, rowData: T) {
    this.actionClickEmit.emit({ action, rowData });
  }

  public showDialog() {
    this.isDialogVisible.set(true);
  }
}
