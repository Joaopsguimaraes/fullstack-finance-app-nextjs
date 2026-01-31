'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { memo } from 'react'
import { getIcon } from '../constants/icons'
import { type StatCardProps } from '../types'

function StatCardComponent({ title, value, iconName }: StatCardProps) {
  return (
    <Card className='bg-card border-border'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
        <div className='flex h-8 w-8 items-center justify-center rounded-full'>
          {getIcon(iconName)}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-foreground text-2xl font-bold'>{value}</div>
      </CardContent>
    </Card>
  )
}

export const StatCard = memo(StatCardComponent)
