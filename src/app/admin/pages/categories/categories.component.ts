import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core"
import { CategoryService } from "../../../services/category.service"
import { Observable } from "rxjs"
import { Category } from "../../../models/models"

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPageComponent implements OnInit {
  categories$: Observable<Category[]> | undefined

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getAll()
  }

  getAll(): void {
    this.categories$ = this.categoryService.getAll()
  }
}
