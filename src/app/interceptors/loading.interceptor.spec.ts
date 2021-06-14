import { TestBed } from "@angular/core/testing"

import { LoadingInterceptor } from "./loading.interceptor"
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing"
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http"
import { AppState } from "../store/reducers"
import { Store } from "@ngrx/store"
import { provideMockStore } from "@ngrx/store/testing"
import { loadEnd, loadStart } from "../store/actions"

const url = "/some-url"
describe("LoadingInterceptor", () => {
  let httpClient: HttpClient
  let httpController: HttpTestingController
  let store: Store<AppState>
  let dispatchSpy: jasmine.Spy<Store["dispatch"]>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
        provideMockStore({}),
      ],
    })

    httpClient = TestBed.inject(HttpClient)
    httpController = TestBed.inject(HttpTestingController)
    store = TestBed.inject(Store)
    dispatchSpy = spyOn(store, "dispatch")
  })

  afterEach(() => {
    httpController.verify()
  })

  it("should correctly handle successful requests", () => {
    httpClient.get(url).subscribe()

    const req = httpController.expectOne(url)
    expect(dispatchSpy).toHaveBeenCalledWith(loadStart())
    req.flush({})
    expect(dispatchSpy).toHaveBeenCalledWith(loadEnd())
  })

  it("should correctly handle requests with error", () => {
    httpClient.get(url).subscribe({ error() {} })

    const req = httpController.expectOne(url)
    expect(dispatchSpy).toHaveBeenCalledWith(loadStart())
    req.flush("error", { status: 404, statusText: "Not Found" })
    expect(dispatchSpy).toHaveBeenCalledWith(loadEnd())
  })
})
