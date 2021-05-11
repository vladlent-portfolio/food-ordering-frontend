import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core"
import { Category } from "../../../../models/models"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { FormBuilder } from "@angular/forms"

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
  title = ""
  newImage: File | undefined
  formGroup = this.fb.group({
    title: this.data.category?.title,
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.setTitle()
  }

  setTitle() {
    if (this.data.mode === "create") {
      this.title = "Create New Category"
    } else {
      this.title = "Edit Category"
    }
  }

  submit() {}
}
