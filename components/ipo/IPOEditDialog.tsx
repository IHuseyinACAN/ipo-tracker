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
    const [price, setPrice] = useState(ipo.price.toString())
    const [sellPrice, setSellPrice] = useState(ipo.sellPrice?.toString() || "")
    const [status, setStatus] = useState(ipo.status)

    const handleSave = () => {
        updateIPO(ipo.id, {
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
                <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Halka Arz Düzenle</DialogTitle>
                    <DialogDescription>
                        {ipo.code} - {ipo.companyName} bilgilerini güncelle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Halka Arz Fiyatı
                        </Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sellPrice" className="text-right">
                            Satış Fiyatı
                        </Label>
                        <Input
                            id="sellPrice"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            placeholder="Henüz satılmadıysa boş bırakın"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Durum
                        </Label>
                        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Yakında</SelectItem>
                                <SelectItem value="open">Talep Topluyor</SelectItem>
                                <SelectItem value="trading">İşlem Görüyor</SelectItem>
                                <SelectItem value="closed">Tamamlandı / Kapandı</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button variant="destructive" onClick={handleDelete}>Sil</Button>
                    <Button type="submit" onClick={handleSave}>Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
