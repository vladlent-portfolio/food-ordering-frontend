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
} from "../../components/dialogs/dish-dialog/dish-dialog.component"
import { Category, Dish } from "../../../models/models"
import { CategoryService } from "../../../services/category.service"
import { DishService } from "../../../services/dish.service"
import { MatDialog } from "@angular/material/dialog"
import { filter, switchMap } from "rxjs/operators"
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from "../../../components/dialogs/confirm/confirm.component"

@Component({
  selector: "app-dishes",
  templateUrl: "./dishes.component.html",
  styleUrls: ["./dishes.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DishesPageComponent implements OnInit {
  dishes: Dish[] = []
  categories: Category[] = []

  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getDishes()
    this.getCategories()
  }

  trackBy: TrackByFunction<Dish> = (_, dish) => dish.id

  getDishes() {
    this.dishService.getAll().subscribe(dishes => {
      this.dishes = dishes
      this.cdRef.detectChanges()
    })
  }

  getCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories
      this.cdRef.detectChanges()
    })
  }

  openDialog(data: DishDialogData) {
    this.dialog
      .open(DishDialogComponent, { data })
      .afterClosed()
      .pipe(filter(Boolean))
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
