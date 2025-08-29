import { Home, type LucideIcon } from 'lucide-react'

export const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ name: string; href: string; icon?: LucideIcon }> =
    [{ name: 'Home', href: '/', icon: Home }]

  let currentPath = ''
  segments.forEach(segment => {
    currentPath += `/${segment}`

    const name = segment.charAt(0).toUpperCase() + segment.slice(1)
    breadcrumbs.push({ name, href: currentPath })
  })

  return breadcrumbs
}
