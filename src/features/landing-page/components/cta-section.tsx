import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function CtaSection() {
  return (
    <section className='px-4 py-20'>
      <div className='container mx-auto text-center'>
        <Card className='mx-auto max-w-2xl'>
          <CardHeader>
            <CardTitle className='text-2xl'>Ready to Get Started?</CardTitle>
            <CardDescription>
              Join thousands of users who are already taking control of their
              finances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size='lg' asChild>
              <a href='/auth/login'>Create Your Account</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
