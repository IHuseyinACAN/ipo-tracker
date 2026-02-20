'use client'

import { useParams } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function IPODetailPage() {
    const params = useParams()
    const id = params.id as string
    const { ipos, accounts, allocations, addAllocation, updateAllocation } = useStore()

    const ipo = ipos.find((i) => i.id === id)

    // Local state for inputs to avoid potential stuttering, though zustand is fast enough usually
    // We will read from store directly for simplicity in this MVP

    if (!ipo) {
        return <div className="p-8">Halka arz bulunamadı.</div>
    }

    const handleAllocationChange = (accountId: string, val: string) => {
        const num = parseInt(val)
        if (isNaN(num)) return

        const existing = allocations.find(a => a.ipoId === id && a.accountId === accountId)
        if (existing) {
            updateAllocation(existing.id, { allocatedLot: num })
        } else {
            addAllocation({
                ipoId: id,
                accountId: accountId,
                allocatedLot: num,
                isSold: false
            })
        }
    }

    const getAllocation = (accountId: string) => {
        return allocations.find(a => a.ipoId === id && a.accountId === accountId)?.allocatedLot || 0
    }

    const totalLots = accounts.reduce((acc, account) => acc + getAllocation(account.id), 0)
    const totalInvestment = totalLots * ipo.price

    // Ceiling Series Calculation (1-15 days, based on first account)
    const singleAccountLots = accounts.length > 0 ? getAllocation(accounts[0].id) : 0
    const singleAccountInvestment = singleAccountLots * ipo.price
    const totalInvestmentCalc = totalLots * ipo.price // Rename to avoid conflict if needed, or just use totalInvestment

    const ceilingSeries = []
    let currentPrice = ipo.price
    for (let i = 1; i <= 15; i++) {
        currentPrice = currentPrice * 1.10
        const value = currentPrice * singleAccountLots
        const profit = value - singleAccountInvestment

        const totalValue = currentPrice * totalLots
        const totalProfit = totalValue - totalInvestmentCalc

        ceilingSeries.push({
            day: i,
            price: currentPrice,
            value: value,
            profit: profit,
            totalProfit: totalProfit,
            percentage: ((currentPrice - ipo.price) / ipo.price) * 100
        })
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold">{ipo.code} - {ipo.companyName}</h1>
                        <Badge variant={ipo.status === 'open' ? 'default' : 'secondary'}>
                            {ipo.status === 'open' ? 'Talep Topluyor' : ipo.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Fiyat: {ipo.price.toFixed(2)} ₺ / Lot</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hesap Dağılımı</CardTitle>
                            <CardDescription>Her hesaba düşen lot sayısını giriniz.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {accounts.map(account => (
                                <div key={account.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                            {account.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium truncate max-w-[150px]">{account.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                className="w-20 text-right bg-background/50"
                                                value={getAllocation(account.id)}
                                                onChange={(e) => handleAllocationChange(account.id, e.target.value)}
                                            />
                                            <span className="text-sm text-muted-foreground">Lot</span>
                                        </div>
                                        <div className="text-right min-w-[80px] font-bold text-blue-400 tabular-nums">
                                            {(getAllocation(account.id) * ipo.price).toFixed(2)} ₺
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Genel Özet</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Toplam Lot:</span>
                                <span className="font-bold text-xl">{totalLots}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Toplam Yatırım:</span>
                                <span className="font-bold text-xl">{totalInvestment.toFixed(2)} ₺</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-emerald-950/20 border-emerald-900/50 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-500 justify-between">
                                <div className="flex items-center">
                                    <Calculator className="mr-2 h-5 w-5" />
                                    Tavan Serisi
                                </div>
                                <span className="text-foreground text-sm font-bold bg-background/20 px-2 py-1 rounded">
                                    {singleAccountLots} Lot
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-x-auto text-sm">
                                <table className="w-full text-left rtl:text-right">
                                    <thead className="text-xs uppercase text-muted-foreground border-b border-border/50">
                                        <tr>
                                            <th scope="col" className="px-2 py-2">Gün</th>
                                            <th scope="col" className="px-2 py-2">Artış</th>
                                            <th scope="col" className="px-2 py-2 text-right">Tek Hesap</th>
                                            <th scope="col" className="px-2 py-2 text-right">Toplam Kar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ceilingSeries.map((day) => (
                                            <tr key={day.day} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                                                <td className="px-2 py-2 font-medium">{day.day}. Tavan</td>
                                                <td className="px-2 py-2 text-muted-foreground">%{day.percentage.toFixed(0)}</td>
                                                <td className="px-2 py-2 text-right font-medium">+{day.profit.toFixed(2)} ₺</td>
                                                <td className="px-2 py-2 text-right text-emerald-500 font-bold">+{day.totalProfit.toFixed(2)} ₺</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
