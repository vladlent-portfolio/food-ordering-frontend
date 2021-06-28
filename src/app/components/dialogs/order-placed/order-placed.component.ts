import { Component, Inject, OnInit } from "@angular/core"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { Order } from "../../../models/models"

@Component({
  selector: "app-order-placed",
  templateUrl: "./order-placed.component.html",
  styleUrls: ["./order-placed.component.scss"],
})
export class OrderPlacedComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public order: Order) {}

  ngOnInit(): void {}
}
