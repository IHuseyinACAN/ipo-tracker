"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts"

interface ProfitChartProps {
    data: {
        name: string
        profit: number
        percent: number
    }[]
    type?: 'profit' | 'percent'
}

export function ProfitChart({ data, type = 'profit' }: ProfitChartProps) {
    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Veri yok.</div>
    }

    const dataKey = type === 'percent' ? 'percent' : 'profit'
    const chartHeight = Math.max(300, data.length * 35) // Dynamic height based on number of items

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const val = payload[0].payload[dataKey] as number
                            const isPositive = val >= 0
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    {type === 'profit' ? (
                                        <>
                                            <div className={`font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </div>
                                            <div className={`text-xs text-right mt-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                                %{payload[0].payload.percent.toFixed(2)}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`font-bold ${isPositive ? 'text-blue-500' : 'text-red-500'}`}>
                                                %{val.toFixed(2)}
                                            </div>
                                            <div className={`text-xs text-right mt-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {payload[0].payload.profit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <ReferenceLine x={0} stroke="#666" />
                <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => {
                        const val = entry[dataKey]
                        return <Cell key={`cell-${index}`} fill={val >= 0 ? (type === 'percent' ? "#3b82f6" : "#10b981") : "#ef4444"} />
                    })}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
