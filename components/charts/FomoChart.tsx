"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface FomoChartProps {
    data: {
        name: string
        realizedProfit: number
        fomoProfit: number // Current value - Initial cost
    }[]
}

export function FomoChart({ data }: FomoChartProps) {
    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Veri yok. Sadece satılan hisseler için formo hesabı yapılır.</div>
    }

    const chartHeight = Math.max(350, data.length * 40) // Make it long if there are many items, although it's landscape usually. Let's stick with height=400 or make it vertical if there are too many items? Actually let's use a standard horizontal chart with a scroll wrapper outside if needed.

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="name" fontSize={12} stroke="#888" tickMargin={10} />
                <YAxis hide />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            const realized = payload.find(p => p.dataKey === 'realizedProfit')?.value as number || 0
                            const fomo = payload.find(p => p.dataKey === 'fomoProfit')?.value as number || 0
                            const difference = fomo - realized

                            return (
                                <div className="rounded-lg border bg-background/95 p-3 shadow-md backdrop-blur">
                                    <div className="font-bold text-sm mb-2">{label}</div>
                                    <div className="grid gap-1">
                                        <div className="flex justify-between items-center gap-4 text-xs">
                                            <span className="text-muted-foreground">Elde Edilen Kâr:</span>
                                            <span className={`font-semibold ${realized >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {realized.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center gap-4 text-xs">
                                            <span className="text-muted-foreground">Satmasaydın Olacak Kâr:</span>
                                            <span className={`font-semibold ${fomo >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                                                {fomo.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </span>
                                        </div>
                                        <div className="border-t my-1"></div>
                                        <div className="flex justify-between items-center gap-4 text-xs font-bold">
                                            <span className="text-muted-foreground">Fark (Kaçan/Kurtarılan):</span>
                                            <span className={difference > 0 ? 'text-blue-400' : 'text-emerald-400'}>
                                                {difference > 0 ? '+' : ''}{difference.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground block text-right mt-0.5 font-normal">
                                                {difference > 0 ? '(Kaçırılan Fırsat)' : '(Kurtarılan Zarar)'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="realizedProfit" name="Elde Edilen Kâr" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="fomoProfit" name="Satmasaydın (Şu Anki Kâr)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </ComposedChart>
        </ResponsiveContainer>
    )
}
