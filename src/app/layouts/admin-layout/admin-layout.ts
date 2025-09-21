import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPage } from '../../pages/header-page/header-page';
import { LeftSidePage } from '../../pages/left-side-page/left-side-page';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderPage, LeftSidePage],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
