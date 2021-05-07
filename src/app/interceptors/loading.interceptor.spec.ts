import { TestBed } from "@angular/core/testing"

import { LoadingInterceptor } from "./loading.interceptor"

describe("LoadingInterceptor", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [LoadingInterceptor],
    }),
  )

  it("should correctly handle successful requests", () => {})
})
