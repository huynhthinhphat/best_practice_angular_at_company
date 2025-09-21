import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-tab-filter',
  imports: [CommonModule],
  templateUrl: './app-tab-filter.html',
  styleUrl: './app-tab-filter.css'
})
export class AppTabFilter {
  public status = input<string[]>([]);
  public selectedStatus = signal<string>('');
  public handleSelectedStatus = output<string>();

  public updateStatus(status: string) {
    this.selectedStatus.set(status);
    this.handleSelectedStatus.emit(status);
  }
}
