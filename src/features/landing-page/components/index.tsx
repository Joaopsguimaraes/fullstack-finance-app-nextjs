import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import { CtaSection } from './cta-section'
import { FeatureSection } from './feature-section'
import { HeroSection } from './hero-section'

export function LandingPage() {
  return (
    <div className='bg-background min-h-screen'>
      <header className='border-b'>
        <div className='container mx-auto flex items-center justify-between px-4 py-4'>
          <div className='flex items-center space-x-2'>
            <DollarSign className='text-primary h-8 w-8' />
            <h1 className='text-2xl font-bold'>Finance App</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' asChild>
              <a href='/auth/login'>Sign In</a>
            </Button>
            <Button asChild>
              <a href='/auth/login'>Get Started</a>
            </Button>
          </div>
        </div>
      </header>
      <HeroSection />
      <FeatureSection />
      <CtaSection />
      <footer className='border-t px-4 py-8'>
        <div className='text-muted-foreground container mx-auto text-center'>
          <p>&copy; 2024 Finance App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
