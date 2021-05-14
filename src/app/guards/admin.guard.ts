import { Injectable } from "@angular/core"
import { CanLoad, Route } from "@angular/router"
import { Observable } from "rxjs"
import { AppState } from "../store/reducers"
import { Store } from "@ngrx/store"
import { selectIsAdmin } from "../store/selectors"

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanLoad {
  constructor(private store: Store<AppState>) {}
  canLoad(route: Route): Observable<boolean> {
    return this.store.select(selectIsAdmin)
  }
}
