"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/store/useStore"
import { ArrowDown, ArrowUp, DollarSign, Wallet, TrendingUp } from "lucide-react"

export function PortfolioSummary() {
    const { ipos, allocations } = useStore()

    // Calculate Metrics
    let totalInvestment = 0
    let currentValue = 0
    let bestPerformer = { code: '-', profitPercent: -Infinity }

    allocations.forEach(alloc => {
        const ipo = ipos.find(i => i.id === alloc.ipoId)
        if (!ipo) return

        const cost = (ipo.initialPrice || ipo.price) * alloc.allocatedLot
        const price = ipo.sellPrice || ipo.price
        const value = price * alloc.allocatedLot

        totalInvestment += cost
        currentValue += value

        // Per IPO performance
        if (cost > 0) {
            const profit = value - cost
            const percent = (profit / cost) * 100
            if (percent > bestPerformer.profitPercent) {
                bestPerformer = { code: ipo.code, profitPercent: percent }
            }
        }
    })

    const netProfit = currentValue - totalInvestment
    const profitPercent = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0
    const isProfit = netProfit >= 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass neon-border border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Toplam Yatırım
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalInvestment.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Halka arz maliyeti
                    </p>
                </CardContent>
            </Card>
            <Card className="glass neon-border border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Güncel Varlık
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentValue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Mevcut piyasa değeri
                    </p>
                </CardContent>
            </Card>
            <Card className="glass neon-border border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Net Kar/Zarar
                    </CardTitle>
                    {isProfit ? <ArrowUp className="h-4 w-4 text-emerald-400" /> : <ArrowDown className="h-4 w-4 text-red-500" />}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${isProfit ? 'text-emerald-500 neon-text' : 'text-red-500'}`}>
                        {netProfit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </div>
                    <p className={`text-xs ${isProfit ? 'text-emerald-400' : 'text-red-400'} mt-1`}>
                        %{profitPercent.toFixed(2)} getiri
                    </p>
                </CardContent>
            </Card>
            <Card className="glass neon-border border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Yıldız Hisse
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold neon-text text-blue-400">{bestPerformer.code}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {bestPerformer.profitPercent > -Infinity ? `%${bestPerformer.profitPercent.toFixed(2)} artış` : '-'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
