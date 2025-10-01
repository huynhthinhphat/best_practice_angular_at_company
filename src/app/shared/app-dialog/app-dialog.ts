import { CommonModule } from '@angular/common';
import { Component, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './app-dialog.html',
  styleUrl: './app-dialog.css',
  standalone: true
})
export class AppDialog {
  public content = input<TemplateRef<any> | null>(null);
  public isVisible = input<boolean>(false);
}
