import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPage } from './pages/header-page/header-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mini-shop');
}
