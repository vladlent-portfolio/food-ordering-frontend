import { Component, Inject, OnInit } from "@angular/core"
import { Category } from "../../../../models/models"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms"
import { CategoryService } from "../../../../services/category.service"
import { HttpErrorResponse } from "@angular/common/http"
import { defer } from "rxjs"

export type CategoryDialogData = { mode: "create" } | { mode: "edit"; category: Category }

@Component({
  selector: "app-category-dialog",
  templateUrl: "./category-dialog.component.html",
  styleUrls: ["./category-dialog.component.scss"],
})
export class CategoryDialogComponent implements OnInit {
  isLoading = false
  title = ""
  titleError: string | undefined

  formGroup = this.createFormGroup()

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

  private createFormGroup(): FormGroup {
    const titleValidators = [Validators.required, this.titleValidator()]

    if (this.data.mode === "create") {
      return this.fb.group({ title: [null, titleValidators] })
    }

    return this.fb.group({
      ...this.data.category,
      title: [this.data.category.title, titleValidators],
    })
  }

  private titleValidator(): () => ValidationErrors | null {
    return () => (this.titleError ? { title: true } : null)
  }

  setTitle() {
    if (this.data.mode === "create") {
      this.title = "Create New Category"
    } else {
      this.title = "Edit Category"
    }
  }

  close() {
    this.dialogRef.close(false)
  }

  submit() {
    this.isLoading = true

    const title = this.formGroup.value.title.trim()

    defer(() => {
      if (this.data.mode === "create") {
        return this.categoryService.create(title.trim())
      }
      return this.categoryService.update({ ...this.data.category, title })
    }).subscribe(
      () => {
        this.dialogRef.close(true)
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false
        if (err.status === 409) {
          this.titleError = `Category with name '${this.titleControl.value}' already exists.`
        }
        this.titleControl.updateValueAndValidity()
      },
    )
  }
}
