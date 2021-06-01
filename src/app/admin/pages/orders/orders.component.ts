import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core"
import { Order } from "../../../models/models"
import { OrderService } from "../../../services/order.service"

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent implements OnInit {
  orders: Order[] = []
  displayedColumns = ["id", "created_at", "updated_at", "email", "amount", "status"]

  constructor(private orderService: OrderService, public cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.orderService.getAll().subscribe(orders => {
      this.orders = orders
      this.cdRef.detectChanges()
    })
  }
}
