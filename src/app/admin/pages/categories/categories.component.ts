import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from "@angular/core"
import { CategoryService } from "../../../services/category.service"
import { Category } from "../../../models/models"
import { MatDialog } from "@angular/material/dialog"
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from "../../components/dialogs/category/category-dialog.component"
import { filter, switchMap } from "rxjs/operators"
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from "../../../components/dialogs/confirm/confirm.component"

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = []

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAll()
  }

  trackBy: TrackByFunction<Category> = (_, c) => c.id

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

  remove(category: Category) {
    if (!category.removable) {
      return
    }

    const data: ConfirmDialogData = {
      type: "warn",
      content: `Are you sure you want to delete '${category.title}' category and all it's associated products?`,
    }

    this.dialog
      .open(ConfirmDialogComponent, { data })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.categoryService.remove(category.id)),
      )
      .subscribe(() => {
        this.getAll()
      })
  }

  openDialog(data: CategoryDialogData) {
    this.dialog
      .open(CategoryDialogComponent, { data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.getAll()
      })
  }

  updateImage(id: number, img: File) {
    this.categoryService.updateImage(id, img).subscribe()
  }
}
