import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart3, DollarSign, Shield, TrendingUp } from 'lucide-react'

const FEATURES = [
  {
    icon: <DollarSign className='h-6 w-6' />,
    title: 'Track Expenses',
    description:
      'Monitor your spending with detailed categorization and insights.',
  },
  {
    icon: <TrendingUp className='h-6 w-6' />,
    title: 'Financial Goals',
    description:
      'Set and track your financial goals with progress visualization.',
  },
  {
    icon: <BarChart3 className='h-6 w-6' />,
    title: 'Smart Analytics',
    description:
      'Get insights into your spending patterns with interactive charts.',
  },
  {
    icon: <Shield className='h-6 w-6' />,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and stored securely.',
  },
]

export function FeatureSection() {
  return (
    <section className='bg-muted/50 px-4 py-20'>
      <div className='container mx-auto'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Everything You Need</h2>
          <p className='text-muted-foreground mx-auto max-w-2xl'>
            Powerful features designed to help you understand and improve your
            financial health.
          </p>
        </div>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {FEATURES.map((feature, index) => (
            <Card key={index} className='text-center'>
              <CardHeader>
                <div className='bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
                  {feature.icon}
                </div>
                <CardTitle className='text-lg'>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
