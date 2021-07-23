import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core"
import { User } from "../../../models/models"
import { UserService } from "../../../services/user.service"
import { ComponentWithPagination } from "../../../shared/components/component-with-pagination/component-with-pagination"
import { PageEvent } from "@angular/material/paginator"

@Component({
  selector: "app-customers",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent extends ComponentWithPagination implements OnInit {
  displayedColumns = ["id", "email", "created_at", "is_admin"]
  users: User[] = []

  constructor(private userService: UserService, public cdRef: ChangeDetectorRef) {
    super()
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    const { page, limit } = this.pagination
    this.userService.getAll({ page, limit }).subscribe(resp => {
      this.users = resp.users
      this.pagination = { ...this.pagination, ...resp.pagination }
      this.cdRef.detectChanges()
    })
  }

  updatePagination(e: PageEvent) {
    super.updatePagination(e)
    this.getAll()
  }
}
