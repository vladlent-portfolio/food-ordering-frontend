export type Category = {
  id: number
  title: string
  image?: string
  removable: boolean
}

export type Dish = {
  id: number
  title: string
  price: number
  image?: string
  removable: boolean
  category_id: number
  category: Category
}

export type User = {
  id: number
  created_at: string
  email: string
  is_admin: boolean
}

export type Order = {
  id: number
  created_at: string
  updated_at: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  user_id: number
  user: User
}

export enum OrderStatus {
  Created = 0,
  InProgress = 1,
  Done = 2,
  Canceled = 3,
}

export const OrderStatuses: OrderStatus[] = [
  OrderStatus.Created,
  OrderStatus.InProgress,
  OrderStatus.Done,
  OrderStatus.Canceled,
]

export type OrderItem = {
  id: number
  order_id: number
  dish: Dish
  dish_id: number
  quantity: number
}

export type Pagination = {
  page?: number
  limit?: number
}
