import {
  Car,
  Coffee,
  CreditCard,
  DollarSign,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

export type IconName =
  | 'DollarSign'
  | 'TrendingUp'
  | 'TrendingDown'
  | 'CreditCard'
  | 'Receipt'
  | 'ShoppingCart'
  | 'Coffee'
  | 'Car'

export function getIcon(iconName: IconName, className: string = 'h-4 w-4') {
  const iconMap = {
    DollarSign: <DollarSign className={className} />,
    TrendingUp: <TrendingUp className={className} />,
    TrendingDown: <TrendingDown className={className} />,
    CreditCard: <CreditCard className={className} />,
    Receipt: <Receipt className={className} />,
    ShoppingCart: <ShoppingCart className={className} />,
    Coffee: <Coffee className={className} />,
    Car: <Car className={className} />,
  }

  return iconMap[iconName]
}
