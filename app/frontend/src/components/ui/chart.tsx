"use client"

import * as React from "react"

import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

type ChartConfig = Record<string, { label?: React.ReactNode; icon?: React.ComponentType } & (
  | { color?: string; theme?: never }
  | { color?: never; theme: Record<string, string> }
)>

type ChartContainerProps = React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div data-chart={chartId} ref={ref} className={cn(
      "flex aspect-video justify-center text-xs",
      "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
      "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
      "[&_.recharts-cartesian-grid_line]:stroke-border/50",
      "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
      "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
      "[&_.recharts-layer]:outline-none",
      "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
      "[&_.recharts-radial-bar-background-sector]:fill-muted",
      "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
      "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
      "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
      "[&_.recharts-sector]:outline-none",
      "[&_.recharts-surface]:outline-none",
      className
    )} {...props}>
      <ChartStyle id={chartId} config={config} />
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      config: ChartConfig
      active?: boolean
      payload?: Array<any>
      label?: string
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed" | "none"
      nameKey?: string
      labelKey?: string
    }
>(({ config, active, payload, label, hideLabel, hideIndicator, indicator = "dot", nameKey, labelKey, ...props }, ref) => {
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item.dataKey || item.name || item.key}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !active || !payload.length
        ? null
        : getValueFormatter(itemConfig, item.value)

    if (!active || !payload.length || !itemConfig) {
      return null
    }

    return (
      <div className="flex items-center gap-2 font-medium leading-none">
        <div
          className="flex size-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
          style={
            {
              backgroundColor: item.color,
            } as React.CSSProperties
          }
        />
        {itemConfig.label || item.name}
        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
          {value}
        </div>
      </div>
    )
  }, [label, active, payload, hideLabel, labelKey])

  const tooltipContent = React.useMemo(() => {
    if (!active || !payload?.length) {
      return null
    }

    return (
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        {tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item, _index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = item.color

            if (!itemConfig) {
              return null
            }

            return (
              <div
                key={item.dataKey}
                className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg~*]:shrink-0"
              >
                {indicator !== "none" && (
                  <div
                    className={cn(
                      "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                      {
                        "w-2.5 h-2.5": indicator === "dot",
                        "w-0.5": indicator === "line",
                        "w-0 border-dashed bg-transparent": indicator === "dashed",
                        "my-0.5": indicator !== "dot",
                      }
                    )}
                    style={
                      {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor,
                      } as React.CSSProperties
                    }
                  />
                )}
                <div className="flex flex-1 justify-between leading-none">
                  <div className="grid gap-1.5">
                    <div className="font-medium">
                      {itemConfig.label || item.name}
                    </div>
                    {(() => {
                      const labelValue = labelKey ? item.payload[labelKey] : undefined
                      return labelValue && (
                        <div className="text-muted-foreground">
                          {labelValue}
                        </div>
                      )
                    })()}
                  </div>
                  <div className="font-mono font-medium tabular-nums text-foreground">
                    {getValueFormatter(itemConfig, item.value)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }, [active, payload, nameKey, indicator])

  return (
    <div ref={ref} {...props}>
      {tooltipContent}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
      config: ChartConfig
      payload?: any[]
      verticalAlign?: 'top' | 'bottom' | 'middle'
      hideIcon?: boolean
      nameKey?: string
    }
>(({ config, className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  if (!payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        if (!itemConfig) {
          return null
        }

        return (
          <div
            key={item.value}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg~*]:shrink-0"
          >
            {itemConfig.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              !hideIcon && (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )
            )}
            <div className="font-medium">
              {itemConfig.label}
            </div>
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

// Helpers

function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  const payloadPayload =
    "dataKey" in payload && typeof payload.payload !== "undefined"
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key] === "string"
  ) {
    configLabelKey = payload[key]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

function getValueFormatter(itemConfig: any, value: any) {
  if (typeof itemConfig.formatter === "function") {
    return itemConfig.formatter(value)
  }

  return value
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
