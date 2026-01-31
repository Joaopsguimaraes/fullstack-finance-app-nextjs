import { Suspense, lazy } from 'react'

const CategoryList = lazy(() =>
  import('@/features/categories/components/category-list').then(module => ({
    default: module.CategoryList,
  }))
)

export default function CategoriesPage() {
  return (
    <div className='container mx-auto py-8'>
      <Suspense
        fallback={
          <div className='text-muted-foreground'>Loading categories...</div>
        }
      >
        <CategoryList />
      </Suspense>
    </div>
  )
}
