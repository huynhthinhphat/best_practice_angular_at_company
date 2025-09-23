import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme-service/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private themeService = inject(ThemeService);

  protected readonly title = signal('mini-shop');

  ngOnInit() {
    document.body.classList.toggle('dark-mode', this.themeService.getTheme() === 'dark');
  }
}
