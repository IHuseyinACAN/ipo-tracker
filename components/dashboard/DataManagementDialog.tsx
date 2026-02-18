"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { useStore } from "@/store/useStore"
import { Download, Upload, Database, Settings } from "lucide-react"

export function DataManagementDialog() {
    const store = useStore()
    const [open, setOpen] = useState(false)

    const handleExport = () => {
        const data = {
            accounts: store.accounts,
            ipos: store.ipos,
            allocations: store.allocations,
            version: "1.0",
            date: new Date().toISOString()
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ipo-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string)
                if (json.accounts && json.ipos && json.allocations) {
                    if (confirm('Mevcut tüm veriler silinecek ve yedekten geri yüklenecek. Onaylıyor musunuz?')) {
                        store.setAllData({
                            accounts: json.accounts,
                            ipos: json.ipos,
                            allocations: json.allocations
                        })
                        alert('Veriler başarıyla yüklendi!')
                        setOpen(false)
                    }
                } else {
                    alert('Geçersiz yedek dosyası formatı.')
                }
            } catch (error) {
                alert('Dosya okunurken bir hata oluştu.')
                console.error(error)
            }
        }
        reader.readAsText(file)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Veri Yönetimi">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Veri Yönetimi</DialogTitle>
                    <DialogDescription>
                        Verilerinizi yedekleyin veya başka bir cihazdan taşıyın.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-sm font-medium">Burası PC ise (Veri Kaynağı)</h4>
                        <Button onClick={handleExport} className="w-full flex gap-2">
                            <Download className="h-4 w-4" />
                            Verileri İndir (Yedekle)
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Bu cihazdaki tüm hesap ve halka arz verilerini bir dosya olarak indirir.
                        </p>
                    </div>

                    <div className="border-t pt-4 flex flex-col gap-2">
                        <h4 className="text-sm font-medium">Burası Telefon ise (Veri Hedefi)</h4>
                        <div className="grid w-full items-center gap-1.5">
                            <Button variant="outline" className="w-full relative cursor-pointer" asChild>
                                <label>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Yedeği Yükle (İçe Aktar)
                                    <input
                                        type="file"
                                        accept=".json"
                                        className="hidden"
                                        onChange={handleImport}
                                    />
                                </label>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            PC'den indirdiğiniz dosyayı seçerek verileri buraya aktarın.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
