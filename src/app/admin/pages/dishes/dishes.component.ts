import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"
import { DishDialogData } from "../../components/dialogs/dish-dialog/dish-dialog.component"

@Component({
  selector: "app-dishes",
  templateUrl: "./dishes.component.html",
  styleUrls: ["./dishes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishesPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  getAll() {}

  openDialog(data: DishDialogData) {}
}
