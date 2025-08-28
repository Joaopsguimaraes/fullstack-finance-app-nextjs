import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className='px-4 py-20'>
      <div className='container mx-auto text-center'>
        <h1 className='mb-6 text-4xl font-bold tracking-tight md:text-6xl'>
          Take Control of Your
          <span className='text-primary'> Finances</span>
        </h1>
        <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
          A modern, secure, and intuitive finance management app that helps you
          track expenses, set goals, and achieve financial freedom.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button size='lg' asChild>
            <a href='/auth/login'>Start Managing Your Money</a>
          </Button>
          <Button variant='outline' size='lg'>
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
