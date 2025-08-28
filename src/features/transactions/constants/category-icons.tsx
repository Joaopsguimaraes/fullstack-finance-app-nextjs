import {
  Car,
  Coffee,
  CreditCard,
  Gamepad2,
  Globe,
  Heart,
  Home,
  ShoppingCart,
} from 'lucide-react'

export const categoryIcons: Record<string, React.ReactNode> = {
  SALARY: <CreditCard className='h-4 w-4' />,
  FOOD: <Coffee className='h-4 w-4' />,
  ENTERTAINMENT: <Gamepad2 className='h-4 w-4' />,
  FREELANCE: <Globe className='h-4 w-4' />,
  TRANSPORT: <Car className='h-4 w-4' />,
  UTILITIES: <Home className='h-4 w-4' />,
  INVESTMENTS: <Heart className='h-4 w-4' />,
  OTHER: <ShoppingCart className='h-4 w-4' />,
}
