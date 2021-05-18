import { Component, Inject, OnInit } from "@angular/core"
import { Category } from "../../../../models/models"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { FormBuilder, FormControl, ValidationErrors, Validators } from "@angular/forms"
import { CategoryService } from "../../../../services/category.service"
import { HttpErrorResponse } from "@angular/common/http"
import { ImageUploadError } from "../../image-upload/image-upload.component"

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
  isLoading = false
  title = ""
  titleError: string | undefined

  formGroup = this.fb.group({
    title: [this.data.category?.title, [Validators.required, this.duplicateError()]],
  })

  get titleControl() {
    return this.formGroup.get("title") as FormControl
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
  ) {}

  ngOnInit() {
    this.setTitle()
  }

  private duplicateError(): () => ValidationErrors | null {
    return () => (this.titleError ? { duplicate: true } : null)
  }

  setTitle() {
    if (this.data.mode === "create") {
      this.title = "Create New Category"
    } else {
      this.title = "Edit Category"
    }
  }

  submit() {
    this.isLoading = true

    const title = this.formGroup.value.title.trim()

    this.categoryService.create(title.trim()).subscribe(
      () => {
        this.dialogRef.close()
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false
        if (err.status === 409) {
          this.titleError = `Category with name '${this.titleControl.value}' already exits.`
        }
      },
    )
  }
}
