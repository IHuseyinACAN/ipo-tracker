'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IPO } from '@/types'
import Link from 'next/link'
import { Calendar, TrendingUp, Info } from 'lucide-react'
import { IPOEditDialog } from './IPOEditDialog'

import { useRouter } from 'next/navigation'

interface IPOCardProps {
    ipo: IPO
}

export function IPOCard({ ipo }: IPOCardProps) {
    const router = useRouter()
    const isTrading = ipo.status === 'trading'
    const isOpen = ipo.status === 'open'
    const isClosed = ipo.status === 'closed'

    const handleCardClick = () => {
        router.push(`/ipo/${ipo.id}`)
    }

    return (
        <Card
            className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 group relative cursor-pointer"
            onClick={handleCardClick}
        >
            <div
                className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
            >
                <IPOEditDialog ipo={ipo} />
            </div>
            <div className={`h-2 w-full ${isOpen ? 'bg-emerald-500' : isTrading ? 'bg-blue-500' : isClosed ? 'bg-gray-500' : 'bg-yellow-500'}`} />
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-2xl font-bold tracking-tight">{ipo.code}</h3>
                            <Badge variant={isOpen ? 'default' : 'secondary'} className={isOpen ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/25' : ''}>
                                {isOpen ? 'Talep Topluyor' : ipo.status === 'upcoming' ? 'Yakında' : ipo.status === 'trading' ? 'İşlem Görüyor' : 'Tamamlandı'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1" title={ipo.companyName}>
                            {ipo.companyName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">Fiyat</p>
                        <div className="flex items-center font-medium">
                            <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                            {ipo.price.toFixed(2)} ₺
                            {ipo.initialPrice && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-md ${ipo.price > ipo.initialPrice
                                    ? 'bg-emerald-500/15 text-emerald-500'
                                    : ipo.price < ipo.initialPrice
                                        ? 'bg-red-500/15 text-red-500'
                                        : 'bg-muted text-muted-foreground'
                                    }`}>
                                    %{((ipo.price - ipo.initialPrice) / ipo.initialPrice * 100).toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase">Tarihler</p>
                        <div className="flex items-center font-medium text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {ipo.startDate} - {ipo.endDate}
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="secondary">
                        Detaylar & Dağıtım
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
