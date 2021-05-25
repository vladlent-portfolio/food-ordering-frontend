import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core"
import { User } from "../../../models/models"
import { UserService } from "../../../services/user.service"

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPageComponent implements OnInit {
  displayedColumns = ["id", "email", "created_at", "is_admin"]
  users: User[] = []

  constructor(private userService: UserService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.userService.getAll().subscribe(users => {
      this.users = users
      this.cdRef.detectChanges()
    })
  }
}
