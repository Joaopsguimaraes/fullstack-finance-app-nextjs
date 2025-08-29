import {
  BookOpenIcon,
  CarIcon,
  CoffeeIcon,
  CreditCardIcon,
  DollarSignIcon,
  HeartIcon,
  MoreHorizontalIcon,
  ReceiptIcon,
  ShoppingCartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  ZapIcon,
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
  | 'Zap'
  | 'Heart'
  | 'BookOpen'
  | 'MoreHorizontal'

export function getIcon(iconName: IconName, className: string = 'h-4 w-4') {
  const iconMap = {
    DollarSign: <DollarSignIcon className={className} />,
    TrendingUp: <TrendingUpIcon className={className} />,
    TrendingDown: <TrendingDownIcon className={className} />,
    CreditCard: <CreditCardIcon className={className} />,
    Receipt: <ReceiptIcon className={className} />,
    ShoppingCart: <ShoppingCartIcon className={className} />,
    Coffee: <CoffeeIcon className={className} />,
    Car: <CarIcon className={className} />,
    Zap: <ZapIcon className={className} />,
    Heart: <HeartIcon className={className} />,
    BookOpen: <BookOpenIcon className={className} />,
    MoreHorizontal: <MoreHorizontalIcon className={className} />,
  }

  return iconMap[iconName]
}
