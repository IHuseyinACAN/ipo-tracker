"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/store/useStore"
import { IPO } from "@/types"
import { Settings } from "lucide-react"

interface IPOEditDialogProps {
    ipo: IPO
}

export function IPOEditDialog({ ipo }: IPOEditDialogProps) {
    const { updateIPO, removeIPO } = useStore()
    const [open, setOpen] = useState(false)
    const [initialPrice, setInitialPrice] = useState(ipo.initialPrice?.toString() || ipo.price.toString())
    const [price, setPrice] = useState(ipo.price.toString())
    const [sellPrice, setSellPrice] = useState(ipo.sellPrice?.toString() || "")
    const [status, setStatus] = useState(ipo.status)

    const handleSave = () => {
        updateIPO(ipo.id, {
            initialPrice: parseFloat(initialPrice),
            price: parseFloat(price),
            sellPrice: sellPrice ? parseFloat(sellPrice) : undefined,
            status: status
        })
        setOpen(false)
    }

    const handleDelete = () => {
        if (confirm('Bu halka arzı silmek istediğinize emin misiniz?')) {
            removeIPO(ipo.id)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass border-none neon-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Halka Arz Düzenle</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        <span className="font-bold text-blue-400">{ipo.code}</span> bilgilerini güncelliyorsunuz.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-6">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="initialPrice" className="text-right text-xs font-bold uppercase tracking-wider">
                            Arz Fiyatı
                        </Label>
                        <Input
                            id="initialPrice"
                            type="number"
                            step="0.01"
                            value={initialPrice}
                            onChange={(e) => setInitialPrice(e.target.value)}
                            className="col-span-3 bg-white/5 border-white/10"
                        />
                    </div>
                    {(status === 'trading' || status === 'open') && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right text-xs font-bold uppercase tracking-wider text-emerald-400">
                                Güncel Fiyat
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="col-span-3 bg-emerald-500/5 border-emerald-500/20"
                            />
                        </div>
                    )}
                    {status === 'closed' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sellPrice" className="text-right text-xs font-bold uppercase tracking-wider text-orange-400">
                                Satış Fiyatı
                            </Label>
                            <Input
                                id="sellPrice"
                                type="number"
                                step="0.01"
                                value={sellPrice}
                                onChange={(e) => setSellPrice(e.target.value)}
                                placeholder="Mecbur Değil"
                                className="col-span-3 bg-orange-500/5 border-orange-500/20"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right text-xs font-bold uppercase tracking-wider">
                            Durum
                        </Label>
                        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                            <SelectTrigger className="col-span-3 bg-white/5 border-white/10">
                                <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Yakında</SelectItem>
                                <SelectItem value="open">Talep Topluyor</SelectItem>
                                <SelectItem value="trading">İşlem Görüyor</SelectItem>
                                <SelectItem value="closed">Tamamlandı</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="flex justify-between gap-2">
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={handleDelete}>Sil</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 neon-border-blue" onClick={handleSave}>Değişiklikleri Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
