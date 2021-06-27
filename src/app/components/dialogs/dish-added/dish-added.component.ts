import { Component, Inject, OnInit } from "@angular/core"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { Dish } from "../../../models/models"

@Component({
  selector: "app-dish-added",
  templateUrl: "./dish-added.component.html",
  styleUrls: ["./dish-added.component.scss"],
})
export class DishAddedComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dish: Dish) {}

  ngOnInit(): void {}
}
