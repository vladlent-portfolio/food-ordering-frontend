import { Component, Inject, OnInit } from "@angular/core"
import { Category, Dish } from "../../../../models/models"
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms"
import { DishService } from "../../../../services/dish.service"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { defer } from "rxjs"
import { HttpErrorResponse } from "@angular/common/http"

export type DishDialogData = { categories: Category[] } & (
  | { mode: "create" }
  | { mode: "edit"; dish: Dish }
)

@Component({
  selector: "app-dish-dialog",
  templateUrl: "./dish-dialog.component.html",
  styleUrls: ["./dish-dialog.component.scss"],
})
export class DishDialogComponent implements OnInit {
  isLoading = false
  title = ""
  titleError: string | undefined

  formGroup = this.createFormGroup()

  get titleControl() {
    return this.formGroup.get("title") as FormControl
  }

  get priceControl() {
    return this.formGroup.get("price") as FormControl
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DishDialogData,
    private fb: FormBuilder,
    private dishService: DishService,
    private dialogRef: MatDialogRef<DishDialogData>,
  ) {}

  ngOnInit() {
    this.setTitle()
  }

  removeTitleError() {
    this.titleError = undefined
    this.titleControl.updateValueAndValidity()
  }

  private createFormGroup(): FormGroup {
    let title = null
    let price = null
    let category_id = this.data.categories[0].id

    if (this.data.mode === "edit") {
      ;({ title, price, category_id } = this.data.dish)
    }

    return this.fb.group({
      title: [title, [Validators.required, this.titleValidator()]],
      price: [price, [Validators.required, Validators.min(0)]],
      category_id,
    })
  }

  private titleValidator(): () => ValidationErrors | null {
    return () => (this.titleError ? { title: true } : null)
  }

  setTitle() {
    if (this.data.mode === "create") {
      this.title = "Create New Dish"
    } else {
      this.title = "Edit Dish"
    }
  }

  close() {
    this.dialogRef.close(false)
  }

  submit() {
    if (this.formGroup.invalid) {
      return
    }

    this.isLoading = true

    const { value } = this.formGroup
    value.title = value.title.trim()

    defer(() => {
      if (this.data.mode === "create") {
        return this.dishService.create(value)
      }

      return this.dishService.update({ ...this.data.dish, ...value })
    }).subscribe(
      () => {
        this.dialogRef.close(true)
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false
        if (err.status === 409) {
          this.titleError = `Dish with name '${this.titleControl.value}' already exists.`
        }
        this.titleControl.updateValueAndValidity()
      },
      () => {},
    )
  }
}
