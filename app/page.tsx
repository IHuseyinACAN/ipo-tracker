'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { Users, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { PortfolioDistribution } from '@/components/charts/PortfolioDistribution'
import { ProfitChart } from '@/components/charts/ProfitChart'
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

  // Veri yoksa tohumla
  useEffect(() => {
    if (ipos.length === 0) {
      seedData()
    }
  }, [ipos.length, seedData])

  const activeIPOs = ipos.filter((ipo: IPO) => ipo.status === 'open' || ipo.status === 'upcoming')

  // Chart Data Preparation
  const portfolioData = ipos.map((ipo: IPO) => {
    if (ipo.status === 'closed') return { name: ipo.code, value: 0 }

    const totalAllocated = allocations
      .filter((a: Allocation) => a.ipoId === ipo.id)
      .reduce((sum: number, a: Allocation) => sum + a.allocatedLot, 0)

    return {
      name: ipo.code,
      value: totalAllocated * ipo.price
    }
  }).filter((item: any) => item.value > 0)

  // Profit Data Calculation
  const profitData = ipos.map((ipo: IPO) => {
    const totalAllocated = allocations
      .filter((a: Allocation) => a.ipoId === ipo.id)
      .reduce((sum: number, a: Allocation) => sum + a.allocatedLot, 0)

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
        <div className="flex items-center space-x-2">
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
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-1 h-6 bg-blue-500 mr-3 rounded-full" />
                      Portföy Dağılımı
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PortfolioDistribution data={portfolioData} />
                  </CardContent>
                </Card>
                <Card className="glass border-none overflow-hidden" key={`profit-${activeTab}`}>
                  <CardHeader className="border-b border-border/30 bg-white/5">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-1 h-6 bg-emerald-500 mr-3 rounded-full" />
                      Kar/Zarar Durumu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ProfitChart data={profitData} />
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
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
