'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { Users, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { PortfolioDistribution } from '@/components/charts/PortfolioDistribution'
import { AccountPerformance } from '@/components/charts/AccountPerformance'
import { ProfitChart } from '@/components/charts/ProfitChart'
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary'
import { IPOCard } from '@/components/ipo/IPOCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Basic Badge component since I missed creating it earlier
function SimpleBadge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}


export default function Home() {
  const { accounts, ipos, allocations } = useStore() // allocations eklendi

  const activeIPOs = ipos.filter((ipo) => ipo.status === 'open' || ipo.status === 'upcoming')
  const openIPOs = ipos.filter((ipo) => ipo.status === 'open')

  // Chart Data Preparation
  const portfolioData = ipos.map(ipo => {
    // Sadece 'open' veya 'trading' olanları portföy dağılımında göster
    if (ipo.status === 'closed') return { name: ipo.code, value: 0 }

    const totalAllocated = allocations
      .filter(a => a.ipoId === ipo.id)
      .reduce((sum, a) => sum + a.allocatedLot, 0)

    return {
      name: ipo.code,
      value: totalAllocated * ipo.price
    }
  }).filter(item => item.value > 0)

  // Profit Data Calculation
  const profitData = ipos.map(ipo => {
    const totalAllocated = allocations
      .filter(a => a.ipoId === ipo.id)
      .reduce((sum, a) => sum + a.allocatedLot, 0)

    const cost = totalAllocated * (ipo.initialPrice || ipo.price)
    const currentVal = totalAllocated * (ipo.sellPrice || ipo.price)
    const profit = currentVal - cost
    const percent = cost > 0 ? (profit / cost) * 100 : 0

    return {
      name: ipo.code,
      profit: profit,
      percent: percent
    }
  }).filter(item => item.profit !== 0)


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin">
            <Button>Halka Arz Ekle</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Hesap
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground">
              Aktif takip edilen hesap
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktif Halka Arzlar
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIPOs.length}</div>
            <p className="text-xs text-muted-foreground">
              Talep toplayan ve beklenenler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              İşlem Görenler
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ipos.filter(i => i.status === 'trading').length}</div>
            <p className="text-xs text-muted-foreground">
              Borsada aktif işlem görenler
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Portföy / Aktif</TabsTrigger>
          <TabsTrigger value="upcoming">Gelecek Arzlar</TabsTrigger>
          <TabsTrigger value="closed">Tamamlananlar</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {/* KPI Cards */}
          <PortfolioSummary />

          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Portföy Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <PortfolioDistribution data={portfolioData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Kar/Zarar Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfitChart data={profitData} />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-semibold tracking-tight mt-8">İşlem Görenler</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ipos.filter(i => i.status === 'trading' || i.status === 'open').map(ipo => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
            {ipos.filter(i => i.status === 'trading' || i.status === 'open').length === 0 && (
              <p className="text-muted-foreground">Aktif bir halka arz yok.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Yaklaşan Halka Arzlar</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeIPOs.filter(i => i.status === 'upcoming').length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">Şuan aktif bir halka arz yok.</p>
            )}
            {activeIPOs.filter(i => i.status === 'upcoming').map((ipo) => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Tamamlanan / Arşiv</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ipos.filter(i => i.status === 'closed').map((ipo) => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
            {ipos.filter(i => i.status === 'closed').length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">Henüz tamamlanmış bir arz yok.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
