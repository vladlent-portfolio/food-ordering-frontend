import { Component, Inject, OnInit } from "@angular/core"
import { Category } from "../../../../models/models"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { FormBuilder, FormControl, ValidationErrors, Validators } from "@angular/forms"
import { CategoryService } from "../../../../services/category.service"
import { switchMap } from "rxjs/operators"
import { of } from "rxjs"
import { HttpErrorResponse } from "@angular/common/http"

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
  errorMsg: string | undefined = "error"

  newImage: File | undefined
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
    this.formGroup.get("title")?.markAsTouched()
  }

  private duplicateError(): () => ValidationErrors | null {
    return () => (this.errorMsg ? { duplicate: true } : null)
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

    this.categoryService
      .create(this.formGroup.value.title.trim())
      .pipe(
        switchMap(c =>
          this.newImage ? this.categoryService.updateImage(c.id, this.newImage) : of(c),
        ),
      )
      .subscribe(
        () => {
          this.dialogRef.close()
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false
          if (err.status === 409) {
            this.errorMsg = `Category with name '${this.titleControl.value}' already exits.`
          }
        },
      )
  }
}
