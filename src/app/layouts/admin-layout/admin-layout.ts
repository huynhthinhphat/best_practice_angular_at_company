import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPage } from '../../pages/header-page/header-page';
import { LeftSidePage } from '../../pages/left-side-page/left-side-page';
import { ResizableDirective } from '../../shared/directives/resizable-directive/resizable-directive';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, HeaderPage, LeftSidePage, ResizableDirective],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
