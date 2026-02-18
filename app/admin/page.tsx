'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IPOStatus } from '@/types'

export default function AdminPage() {
    const router = useRouter()
    const { addIPO } = useStore()

    const [formData, setFormData] = useState({
        code: '',
        companyName: '',
        price: '',
        status: 'upcoming' as IPOStatus,
        startDate: '',
        endDate: ''
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.code || !formData.companyName || !formData.price) return

        addIPO({
            code: formData.code.toUpperCase(),
            companyName: formData.companyName,
            price: parseFloat(formData.price),
            initialPrice: parseFloat(formData.price), // İlk eklenirken maliyet = fiyat
            status: formData.status,
            startDate: formData.startDate,
            endDate: formData.endDate
        })

        router.push('/')
    }

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Halka Arz Ekle</h2>
                <p className="text-muted-foreground">Yeni bir halka arzı sisteme manuel olarak ekleyin.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Şirket Bilgileri</CardTitle>
                    <CardDescription>
                        Halka arz detaylarını eksiksiz doldurunuz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Borsa Kodu</Label>
                            <Input
                                id="code"
                                placeholder="Örn: THYAO"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyName">Şirket Adı</Label>
                            <Input
                                id="companyName"
                                placeholder="Örn: Türk Hava Yolları A.Ş."
                                value={formData.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Fiyat (TL)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Durum</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleChange('status', val as IPOStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Durum seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upcoming">Yakında (Draft)</SelectItem>
                                        <SelectItem value="open">Talep Topluyor</SelectItem>
                                        <SelectItem value="closed">Sonuç Bekleniyor</SelectItem>
                                        <SelectItem value="trading">İşlem Görüyor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => handleChange('startDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            Kaydet
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
