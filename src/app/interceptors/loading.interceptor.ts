import { Injectable } from "@angular/core"
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http"
import { Observable } from "rxjs"
import { Store } from "@ngrx/store"
import { AppState } from "../store/reducers"
import { loadEnd, loadStart } from "../store/actions"
import { finalize } from "rxjs/operators"

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.store.dispatch(loadStart())
    return next.handle(request).pipe(finalize(() => this.store.dispatch(loadEnd())))
  }
}
