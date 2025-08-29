import { BarChart3Icon, DollarSignIcon, TrendingUpIcon } from 'lucide-react'
import { Feature } from './feature'

export function HeroSection() {
  const features = [
    {
      icon: <BarChart3Icon className='h-5 w-5' />,
      title: 'Smart Analytics',
      description:
        'Get insights into your spending patterns with advanced analytics and reports.',
    },
    {
      icon: <TrendingUpIcon className='h-5 w-5' />,
      title: 'Track Goals',
      description:
        'Set and monitor your financial goals with intelligent tracking and recommendations.',
    },
  ]

  return (
    <div className='relative hidden flex-1 overflow-hidden lg:flex'>
      <div className='absolute inset-0 bg-gradient-to-br from-zinc-600 via-green-700 to-zinc-800' />
      <div className='absolute inset-0'>
        <div className='animate-blob absolute top-0 -left-4 h-72 w-72 rounded-full bg-green-500/30 opacity-70 mix-blend-screen blur-xl filter' />
        <div className='animate-blob animation-delay-2000 absolute top-0 -right-4 h-72 w-72 rounded-full bg-green-500/30 opacity-70 mix-blend-screen blur-xl filter' />
        <div className='animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-zinc-500/50 opacity-70 mix-blend-screen blur-xl filter' />
      </div>
      <div className='absolute inset-0 opacity-20'>
        <svg
          className='absolute inset-0 h-full w-full'
          preserveAspectRatio='none'
          viewBox='0 0 1440 560'
        >
          <defs>
            <linearGradient id='gradient1' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor='#002551' stopOpacity='0.3' />
              <stop offset='100%' stopColor='#001051' stopOpacity='0.1' />
            </linearGradient>
          </defs>
          <path
            fill='url(#gradient1)'
            d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z'
          />
        </svg>
      </div>
      <div className='relative z-10 flex w-full items-center justify-center p-8 lg:p-12'>
        <div className='max-w-lg space-y-8 text-center'>
          <div className='mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm'>
            <DollarSignIcon className='h-8 w-8 text-white' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-4xl leading-tight font-bold text-white lg:text-5xl'>
              Take Control of Your{' '}
              <span className='bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent'>
                Finances
              </span>
            </h2>
            <p className='text-xl leading-relaxed text-white/80'>
              Join thousands of users who are already managing their finances
              smarter with our comprehensive platform.
            </p>
          </div>
          <div className='space-y-6 text-left'>
            {features.map((feature, index) => (
              <Feature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          <div className='flex justify-center gap-2 pt-4'>
            {[0, 1, 2].map(index => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full bg-white/${
                  index <= 2 ? 100 - (2 - index) * 20 : 40
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
