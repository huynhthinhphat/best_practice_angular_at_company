import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPage } from '../../pages/header-page/header-page';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, HeaderPage],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss'
})
export class UserLayout {

}
