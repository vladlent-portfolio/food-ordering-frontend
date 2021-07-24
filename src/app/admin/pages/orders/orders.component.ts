import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core"
import { Order, OrderStatus } from "../../../models/models"
import { OrderService } from "../../../services/order.service"
import { MatDialog, MatDialogConfig } from "@angular/material/dialog"
import { OrderDetailsDialogComponent } from "../../components/dialogs/order-details/order-details.component"
import { PageEvent } from "@angular/material/paginator"
import { ComponentWithPagination } from "../../../shared/components/component-with-pagination/component-with-pagination"
import { Store } from "@ngrx/store"
import { AppState } from "../../../store/reducers"
import { selectIsSmallScreen } from "../../../store/selectors"
import { map, take } from "rxjs/operators"

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent extends ComponentWithPagination implements OnInit {
  orders: Order[] = []
  displayedColumns = [
    "id",
    "created_at",
    "updated_at",
    "email",
    "amount",
    "status",
    "actions",
  ]
  menuItems = [
    {
      value: OrderStatus.InProgress,
      text: "Accept Order",
      class: "in-progress",
      icon: "thumb_up",
    },
    {
      value: OrderStatus.Canceled,
      text: "Reject Order",
      class: "canceled",
      icon: "cancel",
    },
    {
      value: OrderStatus.Done,
      text: "Complete Order",
      class: "done",
      icon: "check_circle",
    },
  ]

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    public cdRef: ChangeDetectorRef,
  ) {
    super()
  }

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    const { page, limit } = this.pagination
    this.orderService.getAll({ page, limit }).subscribe(resp => {
      this.orders = resp.orders
      this.pagination = { ...this.pagination, ...resp.pagination }
      this.cdRef.detectChanges()
    })
  }

  changeStatus(id: number, status: OrderStatus) {
    this.orderService.changeStatus(id, status).subscribe(
      () => {
        const order = this.orders.find(o => o.id === id)
        if (order) {
          order.status = status
          this.cdRef.detectChanges()
        }
      },
      () => {},
    )
  }

  openDetails(order: Order) {
    this.store
      .select(selectIsSmallScreen)
      .pipe(
        take(1),
        map(isSmall => (isSmall ? { maxWidth: "95vw", minWidth: "95vw" } : {})),
      )
      .subscribe((config: MatDialogConfig) => {
        this.dialog.open(OrderDetailsDialogComponent, { data: order, ...config })
      })
  }

  updatePagination(e: PageEvent) {
    super.updatePagination(e)
    this.getAll()
  }
}
