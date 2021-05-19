import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core"
import { CategoryService } from "../../../services/category.service"
import { Observable, throwError } from "rxjs"
import { Category } from "../../../models/models"
import { MatDialog } from "@angular/material/dialog"
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from "../../components/dialogs/category-dialog/category-dialog.component"
import { catchError, filter } from "rxjs/operators"
import { HttpErrorResponse } from "@angular/common/http"
import { ImageUploadError } from "../../components/image-upload/image-upload.component"

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = []
  uploadError: ImageUploadError | string | undefined

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories
      this.cdRef.markForCheck()
    })
  }

  create(): void {
    this.openDialog({ mode: "create" })
  }

  edit(category: Category): void {
    this.openDialog({ mode: "edit", category })
  }

  openDialog(data: CategoryDialogData) {
    this.dialog
      .open(CategoryDialogComponent, {
        data,
        disableClose: true,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.getAll()
      })
  }

  updateImage(id: number, img: File): Observable<string> {
    return this.categoryService.updateImage(id, img).pipe(
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case 413:
            this.uploadError = ImageUploadError.Size
            break
          case 415:
            this.uploadError = ImageUploadError.Type
            break
          default:
            this.uploadError = "Unexpected error. Please try again later."
        }
        return throwError(err)
      }),
    )
  }
}
