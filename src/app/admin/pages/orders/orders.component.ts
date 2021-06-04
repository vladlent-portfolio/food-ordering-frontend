import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core"
import { Order, OrderStatus } from "../../../models/models"
import { OrderService } from "../../../services/order.service"
import { MatDialog } from "@angular/material/dialog"
import { OrderDetailsDialogComponent } from "../../components/dialogs/order-details/order-details.component"

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit {
  orders: Order[] = []
  displayedColumns = [
    "id",
    "created_at",
    "updated_at",
    "email",
    "amount",
    "status",
    "action",
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
    public cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.orderService.getAll().subscribe(orders => {
      this.orders = orders
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
    this.dialog.open(OrderDetailsDialogComponent, { data: order })
  }
}
