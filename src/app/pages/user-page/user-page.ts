import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../shared/services/user-service/user-service';
import { AppGridView } from '../../shared/app-grid-view/app-grid-view';
import { ColumnDef } from '../../shared/models/column-def.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-page',
  imports: [AppGridView],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css'
})
export class UserPage implements OnInit {
  private userService = inject(UserService);

  public currentPage = signal<number>(1);
  public headers: ColumnDef<User>[] = [
    { field: 'username', headerText: 'Username', isResize: false },
    { field: 'fullName', headerText: 'Fullname', isResize: false },
    { field: 'role', headerText: 'Role', isResize: false }
  ]

  public ngOnInit() {
    this.userService.getUsersByCondition();
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
    this.userService.getUsersByCondition(page.toString());
  }
}
