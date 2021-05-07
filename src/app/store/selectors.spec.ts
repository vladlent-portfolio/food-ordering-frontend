import { selectIsLoading } from "./selectors"

describe("selectIsLoading", () => {
  it("should return true if openRequests is not 0", () => {
    expect(selectIsLoading.projector(5)).toBeTrue()
    expect(selectIsLoading.projector(2)).toBeTrue()
    expect(selectIsLoading.projector(322)).toBeTrue()
  })

  it("should return true if openRequests is 0", () => {
    expect(selectIsLoading.projector(0)).toBeFalse()
  })
})
