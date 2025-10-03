import { CommonModule } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './app-dialog.html',
  styleUrl: './app-dialog.scss',
  standalone: true
})
export class AppDialog {
  public content = input<TemplateRef<any> | null>(null);
  public showDialog = output<boolean>();

  public closeDialog() {
    this.showDialog.emit(false);
  }
}
