import { ChangeDetectionStrategy, Component, Input } from "@angular/core"
import { OrderStatus } from "../../../models/models"

@Component({
  selector: "app-order-status",
  templateUrl: "./order-status.component.html",
  styleUrls: ["./order-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent {
  private _status: OrderStatus | undefined

  @Input() set status(value: OrderStatus | undefined) {
    this._status = value

    switch (value) {
      case OrderStatus.Created:
        this.className = "created"
        this.statusText = "New Order"
        break
      case OrderStatus.InProgress:
        this.className = "in-progress"
        this.statusText = "In Progress"
        break
      case OrderStatus.Done:
        this.className = "done"
        this.statusText = "Delivered"
        break
      case OrderStatus.Canceled:
        this.className = "canceled"
        this.statusText = "Canceled"
        break
    }
  }

  get status() {
    return this._status
  }

  className = ""
  statusText = ""

  constructor() {}
}
