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
