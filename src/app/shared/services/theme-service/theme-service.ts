import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public isDarkMode = signal<boolean>(false);

  constructor() {
    this.isDarkMode.set(localStorage.getItem('theme') === 'dark');
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkMode());
  }

  public toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  public getTheme(): string {
    return this.isDarkMode() ? 'dark' : 'light';
  }
}
