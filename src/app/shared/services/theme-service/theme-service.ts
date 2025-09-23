import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;

  constructor() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  public toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  public getTheme(): string {
    return this.isDarkMode ? 'dark' : 'light';
  }
}
