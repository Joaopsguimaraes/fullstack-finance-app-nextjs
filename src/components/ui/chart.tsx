'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'

import { cn } from '@/lib/utils'

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children']
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = 'Chart'

const ChartStyle = ({
  id,
  config,
}: {
  id: string
  config: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
:root {
  ${colorConfig
    .map(([key, itemConfig]) => {
      const color = itemConfig.theme?.light ?? itemConfig.color
      return color ? `  --color-${key}: ${color};` : null
    })
    .filter(Boolean)
    .join('\n')}
}

.dark {
  ${colorConfig
    .map(([key, itemConfig]) => {
      const color = itemConfig.theme?.dark ?? itemConfig.color
      return color ? `  --color-${key}: ${color};` : null
    })
    .filter(Boolean)
    .join('\n')}
}

[data-chart=${id}] {
  ${colorConfig
    .map(([key]) => {
      return `  --color-${key}: hsl(var(--chart-${(colorConfig.findIndex(([k]) => k === key) % 5) + 1}));`
    })
    .join('\n')}
}
        `,
      }}
    />
  )
}

// Chart tooltip component
const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    value?: any // eslint-disable-line @typescript-eslint/no-explicit-any
    name?: string
    dataKey?: string
    color?: string
    fill?: string
    payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }>
  label?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  labelFormatter?: (label: any, payload: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  formatter?: (
    value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    name: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    props: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    index: number,
    payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string
  indicator?: 'line' | 'dot' | 'dashed'
  hideLabel?: boolean
  hideIndicator?: boolean
  labelClassName?: string
  color?: string
  nameKey?: string
  labelKey?: string
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || 'value'}`
      const itemConfig = item.payload?.[key]
      const value =
        !labelFormatter && typeof label === 'string'
          ? itemConfig
          : (labelFormatter?.(label, payload) ?? label)

      return <div className={cn('font-medium', labelClassName)}>{value}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName, labelKey])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot'

    return (
      <div
        ref={ref}
        className={cn(
          'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className='grid gap-1.5'>
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`
            const itemConfig = item.payload?.[key]
            const indicatorColor = color || item.payload?.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            }
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center'
                      )}
                    >
                      <div className='grid gap-1.5'>
                        {nestLabel ? tooltipLabel : null}
                        <span className='text-muted-foreground'>
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className='text-foreground font-mono font-medium tabular-nums'>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = 'ChartTooltipContent'

// Chart legend component
const ChartLegend = RechartsPrimitive.Legend

interface ChartLegendContentProps extends React.ComponentProps<'div'> {
  payload?: Array<{
    value?: any // eslint-disable-line @typescript-eslint/no-explicit-any
    dataKey?: string
    color?: string
    payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }>
  verticalAlign?: 'top' | 'middle' | 'bottom'
  hideIcon?: boolean
  nameKey?: string
}

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendContentProps
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign: _verticalAlign = 'bottom',
      nameKey,
      ...props
    },
    ref
  ) => {
    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-4', className)}
        {...props}
      >
        {payload.map(item => {
          const key = `${nameKey || item.dataKey || 'value'}`
          const itemConfig = item.payload?.[key]

          return (
            <div
              key={item.value}
              className={cn(
                '[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3'
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className='h-2 w-2 shrink-0 rounded-[2px]'
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              <span className='text-muted-foreground'>
                {itemConfig?.label || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = 'ChartLegendContent'

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}
