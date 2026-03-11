'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Upload, ShieldCheck, Database, ArrowLeft, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function SettingsPage() {
    const { accounts, ipos, allocations, setAllData } = useStore()
    const [isImporting, setIsImporting] = useState(false)

    const handleExport = () => {
        const data = {
            accounts,
            ipos,
            allocations,
            version: '1.0.0',
            exportDate: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ipo-tracker-yedek-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('Yedek dosyası başarıyla indirildi.')
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string)
                
                if (!json.accounts || !json.ipos || !json.allocations) {
                    throw new Error('Geçersiz yedek dosyası formatı.')
                }

                if (confirm('Mevcut tüm verileriniz silinecek ve yedek dosyasındaki veriler yüklenecek. Onaylıyor musunuz?')) {
                    setAllData({
                        accounts: json.accounts,
                        ipos: json.ipos,
                        allocations: json.allocations
                    })
                    toast.success('Veriler başarıyla geri yüklendi.')
                }
            } catch (err) {
                console.error(err)
                toast.error('Geri yükleme başarısız: Dosya formatı hatalı.')
            } finally {
                setIsImporting(false)
                e.target.value = ''
            }
        }
        reader.readAsText(file)
    }

    const handleReset = () => {
        if (confirm('TÜM VERİLERİNİZİ SİLMEK istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            setAllData({ accounts: [], ipos: [], allocations: [] })
            toast.success('Sistem sıfırlandı.')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
            >
                <Link href="/">
                    <Button variant="ghost" size="icon" className="glass rounded-full h-10 w-10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black neon-text">Ayarlar & Veri Yönetimi</h1>
                    <p className="text-muted-foreground font-medium">Uygulama tercihlerinizi ve verilerinizi yönetin.</p>
                </div>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Backup Section */}
                <Card className="glass border-none neon-border overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/10">
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-400" />
                            Veri Yedekleme
                        </CardTitle>
                        <CardDescription>Portföyünüzü cihazlar arasında taşıyın veya yedekleyin.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-sm text-blue-100/80 leading-relaxed">
                                    Verileriniz yerel tarayıcı hafızasında saklanır. Telefon değiştirirken veya 
                                    farklı cihazlardan erişmek için yedek dosyasını kullanabilirsiniz.
                                </p>
                            </div>
                            
                            <Button 
                                onClick={handleExport}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                            >
                                <Download className="h-5 w-5" />
                                Yedeği Bilgisayara İndir (.json)
                            </Button>

                            <div className="relative">
                                <label className="block">
                                    <span className="sr-only">Dosya Seç</span>
                                    <input 
                                        type="file" 
                                        accept=".json"
                                        onChange={handleImport}
                                        className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-3 file:px-4
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-bold
                                            file:bg-emerald-600/20 file:text-emerald-400
                                            hover:file:bg-emerald-600/30
                                            cursor-pointer transition-all
                                            border-2 border-dashed border-white/10 rounded-xl p-2
                                        "
                                        disabled={isImporting}
                                    />
                                </label>
                                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground px-1">
                                    <Upload className="h-3 w-3" />
                                    <span>Yedek dosyasını seçerek verileri geri yükleyin.</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Section */}
                <Card className="glass border-none neon-border overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/10">
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            Sistem & Güvenlik
                        </CardTitle>
                        <CardDescription>Uygulama genel ayarları ve sistem temizliği.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl glass border-white/5">
                                <div>
                                    <p className="font-bold text-sm">Versiyon Bilgisi</p>
                                    <p className="text-xs text-muted-foreground">v1.0.0 (Geliştirici Sürümü)</p>
                                </div>
                                <RefreshCw className="h-5 w-5 text-muted-foreground opacity-30" />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Tehlikeli Bölge</p>
                                <Button 
                                    variant="ghost" 
                                    onClick={handleReset}
                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-3 h-12"
                                >
                                    <Trash2 className="h-5 w-5" />
                                    Tüm Verileri Sıfırla
                                </Button>
                                <p className="text-[10px] text-red-500/60 mt-2 px-2">
                                    * Dikkat: Bu işlem tüm hesaplarınızı, halka arzlarınızı ve geçmişinizi kalıcı olarak siler.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
