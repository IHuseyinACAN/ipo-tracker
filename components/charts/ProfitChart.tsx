"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts"

interface ProfitChartProps {
    data: {
        name: string
        profit: number
        percent: number
    }[]
}

export function ProfitChart({ data }: ProfitChartProps) {
    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Veri yok.</div>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
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
                            const val = payload[0].value as number
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className={`font-bold ${val >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </div>
                                    <div className={`text-xs text-right mt-1 ${val >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        %{payload[0].payload.percent.toFixed(2)}
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <ReferenceLine x={0} stroke="#666" />
                <Bar dataKey="profit" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? "#10b981" : "#ef4444"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
