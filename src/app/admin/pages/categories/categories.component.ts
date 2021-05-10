import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"
import { CategoryService } from "../../../services/category.service"
import { Observable } from "rxjs"
import { Category } from "../../../models/models"
import { MatDialog } from "@angular/material/dialog"
import {
  CategoryDialogComponent,
  CategoryDialogData,
} from "../../components/dialogs/category-dialog/category-dialog.component"

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  categories$: Observable<Category[]> | undefined

  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    this.categories$ = this.categoryService.getAll()
  }

  openDialog() {
    const data: CategoryDialogData = {
      mode: "create",
    }

    this.dialog.open(CategoryDialogComponent, { data, disableClose: true })
  }
}
