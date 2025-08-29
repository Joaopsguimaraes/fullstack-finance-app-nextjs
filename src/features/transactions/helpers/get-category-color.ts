export const getCategoryColor = (category: string) => {
  const colors = [
    'bg-blue-300 text-neutral-950',
    'bg-green-300 text-neutral-950',
    'bg-yellow-300 text-neutral-950',
    'bg-purple-300 text-neutral-950',
    'bg-red-300 text-neutral-950',
    'bg-indigo-300 text-neutral-950',
  ]
  const index = category.length % colors.length
  return colors[index]
}
