import { Component, Inject, OnInit } from "@angular/core"
import { Category } from "../../../../models/models"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { FormGroup } from "@angular/forms"

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
  formGroup = new FormGroup({})
  title = ""

  constructor(@Inject(MAT_DIALOG_DATA) public data: CategoryDialogData) {}

  ngOnInit() {
    this.setTitle()
  }

  setTitle() {
    if (this.data.mode === "create") {
      this.title = "Create New Category"
    } else {
      this.title = `Edit Category`
    }
  }

  onSubmit() {}
}
