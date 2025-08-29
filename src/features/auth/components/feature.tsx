interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className='flex items-start space-x-4 text-white/90'>
      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm'>
        {icon}
      </div>
      <div>
        <h3 className='mb-1 text-lg font-semibold'>{title}</h3>
        <p className='text-sm leading-relaxed text-white/70'>{description}</p>
      </div>
    </div>
  )
}
