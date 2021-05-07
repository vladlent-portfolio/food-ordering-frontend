import { Component, OnInit } from "@angular/core"
import { select, Store } from "@ngrx/store"
import { selectIsLoading } from "./store/selectors"
import { AppState } from "./store/reducers"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select(selectIsLoading)).subscribe(isLoading => {
      console.log(isLoading)
    })
  }
}
