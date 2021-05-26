import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core"
import { Category, Dish } from "../../models/models"
import { CategoryService } from "../../services/category.service"
import { DishService } from "../../services/dish.service"

@Component({
  selector: "app-main-page",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  categories: Category[] = []
  dishes: Dish[] = []

  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getDishes()
    this.getCategories()
  }

  getCategories(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories
      this.cdRef.detectChanges()
    })
  }

  getDishes(): void {
    this.dishService.getAll().subscribe(dishes => {
      this.dishes = dishes
      this.cdRef.detectChanges()
    })
  }
}
