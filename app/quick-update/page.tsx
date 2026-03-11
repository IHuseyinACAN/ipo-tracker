'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Zap, Save, TrendingUp, Info } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function QuickUpdatePage() {
    const { ipos, updateIPO } = useStore()
    const [prices, setPrices] = useState<Record<string, string>>(
        Object.fromEntries(ipos.map(i => [i.id, i.price.toString()]))
    )
    const [isSaving, setIsSaving] = useState(false)

    // Filtrele: Sadece işlem gören (trading) veya talep toplayanlar (open) hızlı güncellenir
    const activeIPOs = ipos.filter(i => i.status === 'trading' || i.status === 'open')

    const handleChange = (id: string, val: string) => {
        setPrices(prev => ({ ...prev, [id]: val }))
    }

    const handleSaveAll = async () => {
        setIsSaving(true)
        try {
            activeIPOs.forEach(ipo => {
                const newPrice = parseFloat(prices[ipo.id])
                if (!isNaN(newPrice) && newPrice !== ipo.price) {
                    updateIPO(ipo.id, { price: newPrice })
                }
            })
            toast.success('Tüm fiyatlar başarıyla güncellendi.')
        } catch (err) {
            toast.error('Girişler kontrol edilirken bir hata oluştu.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="glass rounded-full h-10 w-10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black neon-text flex items-center gap-2">
                           <Zap className="h-8 w-8 text-yellow-400 fill-yellow-400/20" />
                           Hızlı Fiyat Güncelle
                        </h1>
                        <p className="text-muted-foreground font-medium">Aktif portföyünüzün fiyatlarını tek ekrandan güncelleyin.</p>
                    </div>
                </div>
                
                <Button 
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 neon-border-emerald h-12 px-8 font-bold gap-2"
                >
                    <Save className="h-5 w-5" />
                    Tümünü Kaydet
                </Button>
            </motion.div>

            <Card className="glass border-none neon-border overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/10 p-6">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Aktif İşlem Gören Arzlar
                    </CardTitle>
                    <CardDescription>Borsada işlem gören arzların anlık fiyatlarını girerek kârınızı güncel tutun.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {activeIPOs.map((ipo, idx) => (
                            <motion.div 
                                key={ipo.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="h-10 w-16 glass border-white/10 flex items-center justify-center font-black text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                                        {ipo.code}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold truncate text-sm">{ipo.companyName}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Maliyet: {ipo.initialPrice?.toFixed(2)} ₺</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] text-muted-foreground font-black">MEVCUT</p>
                                        <p className="font-bold tabular-nums text-sm">{ipo.price.toFixed(2)} ₺</p>
                                    </div>
                                    <div className="relative group/input">
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            value={prices[ipo.id] || ''}
                                            onChange={(e) => handleChange(ipo.id, e.target.value)}
                                            className="w-28 bg-white/5 border-white/10 focus:border-yellow-500/50 text-right h-12 font-black tabular-nums text-lg !ring-0"
                                        />
                                        <div className="absolute -top-2 -right-2 hidden group-hover/input:block">
                                            <div className="bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase">Yeni Fiyat</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {activeIPOs.length === 0 && (
                            <div className="p-20 text-center space-y-4">
                                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <Info className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                                <p className="text-muted-foreground font-medium text-sm">Şu an hızlı güncellenecek aktif bir halka arz bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="p-6 rounded-2xl glass border border-white/5 bg-blue-500/5">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    İpucu: Otomasyon Hakkında
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed leading-relaxed">
                    Borsa verilerini anlık sağlayan API'lar genellikle ücretli veya kısıtlıdır. 
                    Bu "Hızlı Güncelleme" ekranı sayesinde her akşam tavan fiyatlarını tek seferde 
                    girerek portföyünüzü saniyeler içinde güncel tutabilirsiniz.
                </p>
            </div>
        </div>
    )
}
