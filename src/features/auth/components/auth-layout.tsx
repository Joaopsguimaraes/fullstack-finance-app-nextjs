import { Open_Sans } from 'next/font/google'
import { HeroSection } from './hero-section'

const notoSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

interface AuthLayoutProps {
  readonly children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className={`flex min-h-screen w-full flex-col lg:flex-row ${notoSans.variable} font-sans`}
    >
      <div className='bg-background flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
      <HeroSection />
    </div>
  )
}
