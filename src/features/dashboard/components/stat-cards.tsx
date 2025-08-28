import { StatCard } from './stat-card'
import { type DashboardStats } from '../types'

interface StatCardsProps {
  stats: DashboardStats[]
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}
