import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCategories } from './shared/services/category-service/state/category.action';
import { ThemeService } from './shared/services/theme-service/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private themeService = inject(ThemeService);
  private store = inject(Store);

  ngOnInit() {
    document.body.classList.toggle('dark-mode', this.themeService.getTheme() === 'dark');
    this.store.dispatch(loadCategories());
  }
}
