"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"]

interface PortfolioDistributionProps {
    data: {
        name: string
        value: number
    }[]
}

export function PortfolioDistribution({ data }: PortfolioDistributionProps) {
    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Veri yok.</div>
    }

    const totalValue = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--background)" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Hisse
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {payload[0].name}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Değer
                                            </span>
                                            <span className="font-bold">
                                                {payload[0].value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-10" fontSize="12" fill="#888">Toplam</tspan>
                    <tspan x="50%" dy="20" fontSize="18" fontWeight="bold" fill="var(--foreground)">
                        {totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                    </tspan>
                </text>
            </PieChart>
        </ResponsiveContainer>
    )
}
