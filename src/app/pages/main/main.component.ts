import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core"
import { Category, Dish } from "../../models/models"
import { CategoryService } from "../../services/category.service"
import { DishService } from "../../services/dish.service"
import { Store } from "@ngrx/store"
import { AppState } from "../../store/reducers"
import { addDishToCart } from "../../store/actions"

@Component({
  selector: "app-main-page",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  private _selectedCategory: number | undefined

  categories: Category[] = []
  dishes: Dish[] = []
  filteredDishes: Dish[] = []

  get selectedCategory(): number | undefined {
    return this._selectedCategory
  }

  set selectedCategory(id: number | undefined) {
    this._selectedCategory = id

    if (id) {
      this.filteredDishes = this.filterDishes(id)
    }
  }

  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private store: Store<AppState>,
    public cdRef: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getInitData()
  }

  async getInitData() {
    await this.getCategories()
    await this.getDishes()
  }

  async getCategories(): Promise<void> {
    const categories = await this.categoryService.getAll().toPromise()
    this.categories = categories
    this.selectedCategory = categories[0]?.id
    this.cdRef.detectChanges()
  }

  async getDishes(): Promise<void> {
    this.dishes = await this.dishService.getAll().toPromise()

    if (this.selectedCategory) {
      this.filteredDishes = this.filterDishes(this.selectedCategory)
    }

    this.cdRef.detectChanges()
  }

  filterDishes(categoryID: number): Dish[] {
    return this.dishes.filter(d => d.category_id === categoryID)
  }

  addToCart(dish: Dish) {
    this.store.dispatch(addDishToCart({ dish }))
  }
}
