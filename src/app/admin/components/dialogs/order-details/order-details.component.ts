import { Component, Inject, OnInit } from "@angular/core"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { Order } from "../../../../models/models"

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"],
})
export class OrderDetailsDialogComponent implements OnInit {
  columns = ["img", "dish", "amount"]

  constructor(@Inject(MAT_DIALOG_DATA) public order: Order) {}

  ngOnInit(): void {}
}
