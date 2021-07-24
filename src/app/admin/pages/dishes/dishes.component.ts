import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
} from "@angular/core"
import {
  DishDialogComponent,
  DishDialogData,
} from "../../components/dialogs/dish/dish-dialog.component"
import { Category, Dish } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { DishService } from "../../../services/dish.service"
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { filter, map, switchMap, take } from "rxjs/operators"
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from "../../../components/dialogs/confirm/confirm.component"
import { FormControl } from "@angular/forms"
import { combineLatest, Subject } from "rxjs"
import { Store } from "@ngrx/store"
import { AppState } from "../../../store/reducers"
import { selectIsSmallScreen } from "../../../store/selectors"

@Component({
  selector: "app-dishes",
  templateUrl: "./dishes.component.html",
  styleUrls: ["./dishes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishesPageComponent implements OnInit {
  acceptedImageTypes = ["image/png", "image/jpeg", "image/webp"]

  dishes$ = new Subject<Dish[]>()
  categories: Category[] = []
  categoriesFilter = new FormControl({ value: 0, disabled: !this.categories.length })
  filteredDishes$ = combineLatest([
    this.dishes$,
    this.categoriesFilter.valueChanges,
  ]).pipe(
    map(([dishes, id]) => (id !== 0 ? dishes.filter(d => d.category_id === id) : dishes)),
  )

  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    public cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getDishes()
    this.getCategories()
  }

  trackBy: TrackByFunction<Dish> = (_, dish) => dish.id

  getDishes() {
    this.dishService.getAll().subscribe(dishes => {
      this.dishes$.next(dishes)
      this.cdRef.detectChanges()
    })
  }

  getCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories
      this.categoriesFilter.enable()
      this.cdRef.detectChanges()
    })
  }

  openDialog(data: DishDialogData) {
    this.store
      .select(selectIsSmallScreen)
      .pipe(
        take(1),
        map(isSmall => (isSmall ? { maxWidth: "95vw", minWidth: "95vw" } : {})),
        switchMap((config: MatDialogConfig) =>
          this.dialog.open(DishDialogComponent, { data, ...config }).afterClosed(),
        ),
        filter(Boolean),
      )
      .subscribe(() => {
        this.getDishes()
      })
  }

  create() {
    this.openDialog({ mode: "create", categories: this.categories })
  }

  edit(dish: Dish) {
    this.openDialog({ mode: "edit", dish, categories: this.categories })
  }

  remove(dish: Dish) {
    if (!dish.removable) {
      return
    }

    const data: ConfirmDialogData = {
      type: "warn",
      content: `Are you sure you want to delete '${dish.title}'?`,
    }

    this.dialog
      .open(ConfirmDialogComponent, { data })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.dishService.remove(dish.id)),
      )
      .subscribe(() => {
        this.getDishes()
      })
  }

  updateImage(id: number, img: File) {
    this.dishService.updateImage(id, img).subscribe()
  }
}
