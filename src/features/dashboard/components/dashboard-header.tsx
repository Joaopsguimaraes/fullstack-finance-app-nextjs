export function DashboardHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-foreground text-3xl font-bold tracking-tight'>
          Dashboard
        </h1>
        <p className='text-muted-foreground'>
          Track your income, expenses, and financial goals
        </p>
      </div>
    </div>
  )
}
