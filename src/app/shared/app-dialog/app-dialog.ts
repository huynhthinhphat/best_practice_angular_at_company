import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './app-dialog.html',
  styleUrl: './app-dialog.css'
})
export class AppDialog {
  public data = input<any>(null);
  public isVisible = input<boolean>(false);
  private currentData: any = null;

  constructor() {
    effect(() => {
      if (this.data() && this.data() !== this.currentData) {
        console.log('Dialog data changed:', this.data());
        this.currentData = this.data();
        return;
      }

    })
  }
}
