export type DishCreateDTO = {
  title: string
  price: number
  category_id: number
}

export type PaginationDTO = {
  page: number
  limit: number
  total: number
}

export type WithPagination<T> = T & { pagination: PaginationDTO }
