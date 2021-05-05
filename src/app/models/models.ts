export type Category = {
  id: number
  title: string
  image: string
  removable: boolean
}

export type Dish = {
  id: number
  title: string
  price: number
  image: string
  removable: boolean
  category_id: number
  category: Category
}
