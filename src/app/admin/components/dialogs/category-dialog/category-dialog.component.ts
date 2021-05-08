import { Component, OnInit, ChangeDetectionStrategy, Inject } from "@angular/core"
import { Category } from "../../../../models/models"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"

export type CategoryDialogData = {
  mode: "create" | "edit"
  category?: Category
}

@Component({
  selector: "app-category-dialog",
  templateUrl: "./category-dialog.component.html",
  styleUrls: ["./category-dialog.component.scss"],
})
export class CategoryDialogComponent implements OnInit {
  get title() {
    if (this.data.mode === "create") {
      return "Create new category"
    } else {
      return `Edit category`
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: CategoryDialogData) {}

  ngOnInit(): void {}
}
