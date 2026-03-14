'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { Users, TrendingUp, Calendar, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { PortfolioDistribution } from '@/components/charts/PortfolioDistribution'
import { ProfitChart } from '@/components/charts/ProfitChart'
import { MonthlyProfitChart } from '@/components/charts/MonthlyProfitChart'
import { FomoChart } from '@/components/charts/FomoChart'
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary'
import { IPOCard } from '@/components/ipo/IPOCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'framer-motion'
import { IPO, Allocation } from '@/types'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function Home() {
  const { accounts, ipos, allocations, seedData } = useStore()
  const [activeTab, setActiveTab] = useState('active')

  // Veri yoksa tohumla veya eski verileri göç ettir
  useEffect(() => {
    seedData()
  }, [seedData])

  const activeIPOs = ipos.filter((ipo: IPO) => ipo.status === 'open' || ipo.status === 'upcoming' || ipo.status === 'trading')

  // Chart Data Preparation
  const portfolioData = ipos.map((ipo: IPO) => {
    // Sadece aktif sekmedeki durumla eşleşenleri veya trading olanları göster (genel portföy için)
    const isVisibleInTab = activeTab === 'active' 
      ? (ipo.status === 'trading' || ipo.status === 'open')
      : activeTab === 'upcoming' 
        ? ipo.status === 'upcoming' 
        : ipo.status === 'closed'

    if (!isVisibleInTab) return { name: ipo.code, value: 0 }

    const totalAllocated = allocations
      .filter((a: Allocation) => a.ipoId === ipo.id)
      .reduce((sum: number, a: Allocation) => sum + a.allocatedLot, 0)

    return {
      name: ipo.code,
      value: totalAllocated * ipo.price
    }
  }).filter((item: any) => item.value > 0)

  // Chart Data Preparation (All Portfolio)
  const allPortfolioData = ipos.map((ipo: IPO) => {
    // Tüm iptal olmayan hisseler için değer
    const totalAllocated = allocations
      .filter((a: Allocation) => a.ipoId === ipo.id)
      .reduce((sum: number, a: Allocation) => sum + a.allocatedLot, 0)

    if (totalAllocated === 0) return { name: ipo.code, value: 0 }

    return {
      name: ipo.code,
      value: totalAllocated * ipo.price
    }
  }).filter((item: any) => item.value > 0).sort((a,b) => b.value - a.value)

  // Profit Data Calculation (For Performance Tab)
  const allProfitData = ipos.map((ipo: IPO) => {
    const totalAllocated = allocations
      .filter((a: Allocation) => a.ipoId === ipo.id)
      .reduce((sum: number, a: Allocation) => sum + a.allocatedLot, 0)

    if (totalAllocated === 0) return { name: ipo.code, profit: 0, percent: 0 }

    const cost = totalAllocated * (ipo.initialPrice || ipo.price)
    const currentVal = totalAllocated * (ipo.sellPrice || ipo.price)
    const profit = currentVal - cost
    const percent = cost > 0 ? (profit / cost) * 100 : 0

    return {
      name: ipo.code,
      profit: profit,
      percent: percent
    }
  }).filter((item: any) => item.profit !== 0)

  const profitSortedData = [...allProfitData].sort((a, b) => b.profit - a.profit)
  const percentSortedData = [...allProfitData].sort((a, b) => b.percent - a.percent)
  // Monthly Profit Data Calculation (For Performance Tab)
  const monthlyProfitData = (() => {
    const monthlyMap: Record<string, number> = {}
    
    ipos.filter(i => i.status === 'closed' || i.status === 'trading').forEach(ipo => {
      const totalAllocated = allocations
        .filter((a: Allocation) => a.ipoId === ipo.id)
        .reduce((sum: number, a: Allocation) => sum + a.allocatedLot, 0)

      if (totalAllocated === 0) return

      const cost = totalAllocated * (ipo.initialPrice || ipo.price)
      const currentVal = totalAllocated * (ipo.sellPrice || ipo.price)
      const profit = currentVal - cost
      
      // Use endDate or current month if trading
      const dateStr = ipo.endDate || new Date().toISOString().split('T')[0]
      const monthKey = dateStr.substring(0, 7) // YYYY-MM
      
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + profit
    })

    return Object.entries(monthlyMap)
      .map(([month, profit]) => ({
        month,
        profit: Math.round(profit)
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  })()

  // FOMO Data Calculation (For Performance Tab)
  const fomoData = ipos.filter(i => i.status === 'closed').map(ipo => {
    const soldAllocations = allocations.filter((a: Allocation) => a.ipoId === ipo.id && a.isSold)
    if (soldAllocations.length === 0) return null

    let totalRealizedProfit = 0
    let totalFomoProfit = 0

    const initialPrice = ipo.initialPrice || ipo.price
    const currentPrice = ipo.price

    soldAllocations.forEach(a => {
      const soldPrice = a.soldPrice || ipo.sellPrice || ipo.price
      const cost = a.allocatedLot * initialPrice
      
      const realizedProfit = (a.allocatedLot * soldPrice) - cost
      const fomoProfit = (a.allocatedLot * currentPrice) - cost

      totalRealizedProfit += realizedProfit
      totalFomoProfit += fomoProfit
    })

    if (totalRealizedProfit === 0 && totalFomoProfit === 0) return null

    return {
      name: ipo.code,
      realizedProfit: totalRealizedProfit,
      fomoProfit: totalFomoProfit
    }
  }).filter(Boolean) as { name: string, realizedProfit: number, fomoProfit: number }[]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link href="/">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight neon-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-80 transition-opacity cursor-pointer">
            Kontrol Paneli
          </h2>
        </Link>
        <div className="flex items-center space-x-3">
          <Link href="/settings">
            <Button variant="ghost" className="glass border-white/5 hover:bg-white/10 text-muted-foreground hover:text-white">
              <RefreshCw className="mr-2 h-4 w-4" />
              Ayarlar & Yedek
            </Button>
          </Link>
          <Link href="/admin">
            <Button className="glass border-primary/30 hover:bg-primary/20 neon-border">Halka Arz Ekle</Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <Link href="/accounts" className="block h-full group">
            <Card className="glass neon-border border-none h-full transition-all group-hover:bg-white/10 group-hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground group-hover:text-blue-400 transition-colors">
                  Toplam Hesap
                </CardTitle>
                <Users className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold group-hover:neon-text transition-all">{accounts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Aktif takip edilen hesap (Tıklayın)
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass neon-border border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Aktif Halka Arzlar
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeIPOs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Talep toplayan ve beklenenler
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass neon-border border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                İşlem Görenler
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ipos.filter((i: IPO) => i.status === 'trading').length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Borsada aktif işlem görenler
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-border/50 p-1 glass">
          <TabsTrigger value="active" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400">Portföy / Aktif</TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400">Gelecek Arzlar</TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:bg-slate-600/20">Tamamlananlar</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400">Performans Analizi</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="active" key="active" className="space-y-8 focus-visible:outline-none">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              <motion.div variants={item}>
                <PortfolioSummary />
              </motion.div>

              <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
                <Card className="glass border-none overflow-hidden" key={`dist-${activeTab}`}>
                  <CardHeader className="border-b border-border/30 bg-white/5">
                    <CardTitle className="text-lg font-semibold flex items-center text-blue-400">
                      <div className="w-1 h-6 bg-blue-500 mr-3 rounded-full" />
                      Aktif Portföy Dağılımı
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PortfolioDistribution data={portfolioData} />
                  </CardContent>
                </Card>
                <Card className="glass border-none overflow-hidden" key={`alldist-${activeTab}`}>
                  <CardHeader className="border-b border-border/30 bg-white/5">
                    <CardTitle className="text-lg font-semibold flex items-center text-emerald-400">
                      <div className="w-1 h-6 bg-emerald-500 mr-3 rounded-full" />
                      Tüm Hisseler Dağılımı
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PortfolioDistribution data={allPortfolioData} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item} className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight flex items-center">
                  <TrendingUp className="mr-2 text-blue-400" />
                  İşlem Görenler
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {ipos.filter((i: IPO) => i.status === 'trading' || i.status === 'open').map((ipo: IPO) => (
                    <motion.div key={ipo.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <IPOCard ipo={ipo} />
                    </motion.div>
                  ))}
                  {ipos.filter((i: IPO) => i.status === 'trading' || i.status === 'open').length === 0 && (
                    <p className="text-muted-foreground p-8 glass rounded-xl text-center col-span-full">Aktif bir halka arz yok.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="upcoming" key="upcoming" className="space-y-4 focus-visible:outline-none">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <motion.div variants={item}>
                <h3 className="text-2xl font-bold tracking-tight mb-4 flex items-center">
                  <Calendar className="mr-2 text-emerald-400" />
                  Yaklaşan Halka Arzlar
                </h3>
              </motion.div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeIPOs.filter((i: IPO) => i.status === 'upcoming').length === 0 && (
                  <p className="text-muted-foreground p-8 glass rounded-xl text-center col-span-full">Şuan aktif bir halka arz yok.</p>
                )}
                {activeIPOs.filter((i: IPO) => i.status === 'upcoming').map((ipo: IPO) => (
                  <motion.div key={ipo.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <IPOCard ipo={ipo} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="closed" key="closed" className="space-y-4 focus-visible:outline-none">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <motion.div variants={item}>
                <h3 className="text-2xl font-bold tracking-tight mb-4 flex items-center text-muted-foreground">
                  Tamamlanan / Arşiv
                </h3>
              </motion.div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ipos.filter((i: IPO) => i.status === 'closed').map((ipo: IPO) => (
                  <motion.div key={ipo.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <IPOCard ipo={ipo} />
                  </motion.div>
                ))}
                {ipos.filter((i: IPO) => i.status === 'closed').length === 0 && (
                  <p className="text-muted-foreground p-8 glass rounded-xl text-center col-span-full">Henüz tamamlanmış bir arz yok.</p>
                )}
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="performance" key="performance" className="space-y-4 focus-visible:outline-none">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              <Card className="glass border-none neon-border overflow-hidden bg-purple-950/5">
                <CardHeader className="bg-white/5 border-b border-white/10">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Aylık Getiri Gelişimi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-[350px] w-full">
                    <MonthlyProfitChart data={monthlyProfitData} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass border-none bg-blue-950/10">
                  <CardContent className="p-6">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">En Kârlı Ay</h4>
                    <div className="text-3xl font-black text-emerald-400">
                      {monthlyProfitData.length > 0 
                        ? [...monthlyProfitData].sort((a,b) => b.profit - a.profit)[0].month 
                        : 'Veri Yok'}
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass border-none bg-purple-950/10">
                  <CardContent className="p-6">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Ortalama Aylık Kâr</h4>
                    <div className="text-3xl font-black text-purple-400">
                      {monthlyProfitData.length > 0 
                        ? Math.round(monthlyProfitData.reduce((acc,curr) => acc + curr.profit, 0) / monthlyProfitData.length).toLocaleString('tr-TR')
                        : '0'} ₺
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-8">
                <Card className="glass border-none neon-border overflow-hidden bg-emerald-950/5">
                  <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      TL Bazlı Kâr/Zarar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 overflow-y-auto" style={{ maxHeight: '600px' }}>
                    <ProfitChart data={profitSortedData} type="profit" />
                  </CardContent>
                </Card>
                <Card className="glass border-none neon-border overflow-hidden bg-blue-950/5">
                  <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      Oransal Kâr/Zarar (%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 overflow-y-auto" style={{ maxHeight: '600px' }}>
                    <ProfitChart data={percentSortedData} type="percent" />
                  </CardContent>
                </Card>
              </div>

              <Card className="glass border-none neon-border overflow-hidden bg-slate-950/20 mt-8">
                <CardHeader className="bg-white/5 border-b border-white/10">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-200">
                    <TrendingUp className="h-5 w-5 text-slate-400" />
                    "Satmasaydım Ne Olurdu?" (FOMO Analizi)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <FomoChart data={fomoData} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
