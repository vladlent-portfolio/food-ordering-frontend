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
import { MatDialog } from "@angular/material/dialog"
import { DishAddedComponent } from "../../components/dialogs/dish-added/dish-added.component"

@Component({
  selector: "app-main-page",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  private _selectedCategoryID: number | undefined

  categories: Category[] = []
  dishes: Dish[] = []
  filteredDishes: Dish[] = []

  get selectedCategoryID(): number | undefined {
    return this._selectedCategoryID
  }

  set selectedCategoryID(id: number | undefined) {
    this._selectedCategoryID = id

    if (id) {
      this.filteredDishes = this.filterDishes(id)
    }
  }

  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private store: Store<AppState>,
    private dialog: MatDialog,
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
    this.selectedCategoryID = categories[0].id
    this.cdRef.detectChanges()
  }

  async getDishes(): Promise<void> {
    this.dishes = await this.dishService.getAll().toPromise()

    if (this.selectedCategoryID) {
      this.filteredDishes = this.filterDishes(this.selectedCategoryID)
    }

    this.cdRef.detectChanges()
  }

  filterDishes(categoryID: number): Dish[] {
    return this.dishes.filter(d => d.category_id === categoryID)
  }

  addToCart(dish: Dish) {
    this.store.dispatch(addDishToCart({ dish }))
    this.dialog.open(DishAddedComponent, { data: dish })
  }
}
