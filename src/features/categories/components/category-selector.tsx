'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '../hooks/use-categories'

type CategorySelectorProps = {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export const CategorySelector = React.memo(
  ({
    value,
    onValueChange,
    placeholder = 'Select category',
    disabled = false,
  }: CategorySelectorProps) => {
    const { data: categories = [], isLoading } = useCategories()

    return (
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)

CategorySelector.displayName = 'CategorySelector'
