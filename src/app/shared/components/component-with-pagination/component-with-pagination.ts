import { PageEvent } from "@angular/material/paginator"

export abstract class ComponentWithPagination {
  pagination = {
    page: 0,
    limit: 10,
    total: 0,
    limitOptions: [10, 25, 50, 100],
  }

  updatePagination(e: PageEvent) {
    this.pagination = {
      ...this.pagination,
      page: e.pageIndex,
      limit: e.pageSize,
      total: e.length,
    }
  }
}
