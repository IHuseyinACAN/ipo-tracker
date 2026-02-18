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

    // Profit Calculation (Mock: Assume 10% for now or ceiling series)
    // In a real app we'd fetch current price.
    // Let's just show potential profit for 10 ceilings (approx x2.5) for fun visually

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
                <Card>
                    <CardHeader>
                        <CardTitle>Hesap Dağılımı</CardTitle>
                        <CardDescription>Her hesaba düşen lot sayısını giriniz.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {accounts.map(account => (
                            <div key={account.id} className="flex items-center justify-between space-x-4">
                                <span className="font-medium w-32 truncate">{account.name}</span>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        className="w-24 text-right"
                                        value={getAllocation(account.id)}
                                        onChange={(e) => handleAllocationChange(account.id, e.target.value)}
                                    />
                                    <span className="text-sm text-muted-foreground w-12">Lot</span>
                                </div>
                                <div className="text-right w-24 text-sm tabular-nums">
                                    {(getAllocation(account.id) * ipo.price).toFixed(2)} ₺
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
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

                    <Card className="bg-emerald-950/20 border-emerald-900/50">
                        <CardHeader>
                            <CardTitle className="flex items-center text-emerald-500">
                                <Calculator className="mr-2 h-5 w-5" />
                                Tavan Serisi Tahmini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">5. Tavan (%61 Kar):</span>
                                <span className="font-medium">{(totalInvestment * 0.6105).toFixed(2)} ₺ Kar</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">10. Tavan (%159 Kar):</span>
                                <span className="font-medium">{(totalInvestment * 1.5937).toFixed(2)} ₺ Kar</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
