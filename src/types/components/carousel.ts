export interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  title?: string
  itemKey?: (item: T) => string | number
}