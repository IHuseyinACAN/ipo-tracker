'use client'

import { useParams } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calculator, TrendingUp, ShieldCheck, Wallet, Share2 } from 'lucide-react'
import Link from 'next/link'
import { IPOEditDialog } from '@/components/ipo/IPOEditDialog'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const BANKS = [
    "Yapıkredi", "Garanti", "Ziraat", "İş bankası", 
    "Kuveyt türk", "Qnb finansbank", "Vakıfbank", "Midas"
]

export default function IPODetailPage() {
    const params = useParams()
    const id = params.id as string
    const { ipos, accounts, allocations, addAllocation, updateAllocation } = useStore()

    const ipo = ipos.find((i) => i.id === id)

    if (!ipo) {
        return <div className="p-8 text-center glass rounded-xl mx-auto max-w-md mt-20 border-none neon-border">Halka arz bulunamadı.</div>
    }

    const getAllocation = (accountId: string) => {
        return allocations.find(a => a.ipoId === id && a.accountId === accountId)
    }

    const handleAllocationChange = (accountId: string, val: string) => {
        const num = parseInt(val)
        if (isNaN(num)) return

        const existing = getAllocation(accountId)
        if (existing) {
            updateAllocation(existing.id, { allocatedLot: num })
        } else {
            // Varsayılan bankayı bul
            const account = accounts.find(a => a.id === accountId)
            addAllocation({
                ipoId: id,
                accountId: accountId,
                allocatedLot: num,
                bankName: account?.bankName,
                isSold: false
            })
        }
    }

    const handleBankChange = (accountId: string, bankName: string) => {
        const existing = getAllocation(accountId)
        if (existing) {
            updateAllocation(existing.id, { bankName })
        } else {
            addAllocation({
                ipoId: id,
                accountId: accountId,
                allocatedLot: 0,
                bankName,
                isSold: false
            })
        }
    }

    const handleShare = async () => {
        const currentPrice = ipo.sellPrice || ipo.price
        const profit = (currentPrice - ipo.initialPrice) * totalLots
        const profitPercent = ((currentPrice - ipo.initialPrice) / ipo.initialPrice) * 100
        
        const shareText = `🚀 ${ipo.code} Halka Arz Özetim\n\n` +
            `💰 Toplam Lot: ${totalLots}\n` +
            `📈 Getiri: %${profitPercent.toFixed(1)}\n` +
            `💵 Net Kâr: ${profit.toLocaleString('tr-TR')} ₺\n\n` +
            `IPO Tracker ile takip ediyorum! 📊`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${ipo.code} Kazanç Özeti`,
                    text: shareText
                })
            } catch (err) {
                console.error(err)
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText)
            toast.success('Paylaşım metni panoya kopyalandı!')
        }
    }

    const totalLots = accounts.reduce((acc, account) => acc + (getAllocation(account.id)?.allocatedLot || 0), 0)
    const totalInvestment = totalLots * ipo.price

    const displayLots = totalLots > 0 ? (accounts.length > 0 ? (getAllocation(accounts[0].id)?.allocatedLot || 0) : 0) : 0

    const ceilingSeries = []
    let currentPrice = ipo.initialPrice
    for (let i = 1; i <= 15; i++) {
        currentPrice = currentPrice * 1.10
        const value = currentPrice * displayLots
        const profit = value - (displayLots * ipo.initialPrice)
        const totalValue = currentPrice * totalLots
        const totalProfit = totalValue - (totalLots * ipo.initialPrice)

        ceilingSeries.push({
            day: i,
            price: currentPrice,
            profit: profit,
            totalProfit: totalProfit,
            percentage: ((currentPrice - ipo.initialPrice) / ipo.initialPrice) * 100
        })
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="glass rounded-full h-12 w-12 border-white/10 hover:bg-white/10">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black neon-text">{ipo.code}</h1>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-3 py-1 uppercase tracking-tighter">
                                {ipo.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium md:text-lg opacity-80 mt-1">{ipo.companyName}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Fiyat / Lot</p>
                        <p className="text-2xl font-bold neon-text">{ipo.price.toFixed(2)} ₺</p>
                    </div>
                    <div className="glass p-1 rounded-xl border-white/10 flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleShare}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 h-10 w-10 rounded-lg"
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <IPOEditDialog ipo={ipo} />
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Left Column: Allocations */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <Card className="glass border-none neon-border overflow-hidden">
                        <CardHeader className="bg-white/5 border-b border-white/10 flex flex-row items-center justify-between py-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    Hesap & Banka Dağılımı
                                </CardTitle>
                                <CardDescription>Bu arza katılan hesapları ve bankaları yönetin.</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground uppercase block font-bold">Toplam</span>
                                <span className="text-xl font-black text-emerald-400">{totalLots} Lot</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {accounts.map((account, idx) => {
                                    const allocation = getAllocation(account.id)
                                    const currentBank = allocation?.bankName || account.bankName || ""

                                    return (
                                        <motion.div 
                                            key={account.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-white/5 transition-all group gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="h-12 w-12 rounded-xl glass border-white/10 flex items-center justify-center text-blue-400 font-bold shrink-0 transition-transform group-hover:scale-110">
                                                    {account.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold truncate group-hover:neon-text transition-all text-lg">{account.name}</p>
                                                    <div className="mt-1">
                                                        <Select 
                                                            value={currentBank} 
                                                            onValueChange={(val) => handleBankChange(account.id, val)}
                                                        >
                                                            <SelectTrigger className="h-7 bg-white/5 border-white/5 w-[160px] text-[11px] uppercase tracking-wider font-bold">
                                                                <SelectValue placeholder="Banka Seç" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {BANKS.map(bank => (
                                                                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={allocation?.allocatedLot || 0}
                                                        onChange={(e) => handleAllocationChange(account.id, e.target.value)}
                                                        className="w-24 bg-white/5 border-white/10 focus:border-emerald-500/50 text-right h-10 font-bold tabular-nums text-lg"
                                                    />
                                                    <span className="text-xs font-black text-muted-foreground">LOT</span>
                                                </div>
                                                <div className="w-28 text-right">
                                                    <p className="text-base font-black text-blue-400 tabular-nums">
                                                        {((allocation?.allocatedLot || 0) * ipo.price).toLocaleString('tr-TR')} ₺
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                                {accounts.length === 0 && (
                                    <div className="p-10 text-center text-muted-foreground text-sm">
                                        Henüz hesap eklenmemiş. "Hesaplar" sayfasından ekleme yapabilirsiniz.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none bg-gradient-to-br from-blue-500/10 to-emerald-500/10 neon-border p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-black">Toplam Yatırım Tutarı</p>
                                <h3 className="text-4xl font-black text-white neon-text">
                                    {totalInvestment.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </h3>
                            </div>
                            <Wallet className="h-12 w-12 text-blue-400 opacity-20" />
                        </div>
                    </Card>
                </div>

                {/* Right Column: Ceiling Calc */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <Card className="glass border-none neon-border overflow-hidden h-full flex flex-col bg-emerald-950/10">
                        <CardHeader className="bg-white/5 border-b border-white/10 py-5">
                            <CardTitle className="text-xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                                    Tavan Serisi Takip
                                </div>
                                {displayLots > 0 && (
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                        {displayLots} Lot / Hesap
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <div className="w-full">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-[10px] uppercase text-muted-foreground border-b border-white/5 bg-white/5">
                                        <tr>
                                            <th className="px-4 py-3 font-black">Gün</th>
                                            <th className="px-4 py-3 font-black">Artış</th>
                                            <th className="px-4 py-3 text-right font-black">1 Hesap Kâr</th>
                                            <th className="px-4 py-3 text-right font-black">Toplam Kâr</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 tabular-nums">
                                        {ceilingSeries.map((day) => (
                                            <tr key={day.day} className="hover:bg-white/5 group transition-colors">
                                                <td className="px-4 py-3 font-medium opacity-60">
                                                    {day.day}. Gün
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                                                        %{day.percentage.toFixed(0)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-white/80">
                                                    +{day.profit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                </td>
                                                <td className="px-4 py-3 text-right font-black text-emerald-400 neon-text">
                                                    +{day.totalProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                </td>
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
