import { TestBed, waitForAsync } from "@angular/core/testing"

import { LoadingInterceptor } from "./loading.interceptor"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http"
import { AppState } from "../store/reducers"
import { Store } from "@ngrx/store"
import { AppModule } from "../app.module"

const url = "/some-url"
describe("LoadingInterceptor", () => {
  let httpClient: HttpClient
  let httpController: HttpTestingController
  let store: Store<AppState>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
      ],
    })

    httpClient = TestBed.inject(HttpClient)
    httpController = TestBed.inject(HttpTestingController)
    store = TestBed.inject(Store)
  })

  afterEach(() => {
    httpController.verify()
  })

  it(
    "should correctly handle successful requests",
    waitForAsync(() => {
      httpClient
        .get(url)
        .subscribe()
        .add(() => verifyRequests(0))

      const req = httpController.expectOne(url)
      Promise.resolve(() => req.flush({}))
      verifyRequests(1)
    }),
  )

  it(
    "should correctly handle requests with error",
    waitForAsync(() => {
      httpClient
        .get(url)
        .subscribe()
        .add(() => verifyRequests(0))

      const req = httpController.expectOne(url)
      Promise.resolve(() => req.flush("error", { status: 404, statusText: "Not Found" }))
      verifyRequests(1)
    }),
  )

  function verifyRequests(count: number) {
    store
      .select(state => state.openRequests)
      .subscribe(req => {
        expect(req).toBe(count)
      })
  }
})
