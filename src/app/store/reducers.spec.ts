import { requestsReducer } from "./reducers"
import { loadEnd, loadStart } from "./actions"

describe("RequestsReducer", () => {
  it("should add one req on loading start", () => {
    expect(requestsReducer(0, loadStart)).toBe(1)
    expect(requestsReducer(10, loadStart)).toBe(11)
    expect(requestsReducer(-5, loadStart)).toBe(-4)
  })

  it("should subtract one req on loading end", () => {
    expect(requestsReducer(-5, loadEnd)).toBe(-6)
    expect(requestsReducer(1, loadEnd)).toBe(0)
    expect(requestsReducer(23, loadEnd)).toBe(22)
  })
})
