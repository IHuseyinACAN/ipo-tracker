'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, Plus, User } from 'lucide-react'

export default function AccountsPage() {
    const { accounts, addAccount, removeAccount } = useStore()
    const [newAccountName, setNewAccountName] = useState('')

    const handleAddAccount = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAccountName.trim()) return
        addAccount(newAccountName)
        setNewAccountName('')
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Hesap Yönetimi</h2>
                    <p className="text-muted-foreground">Halka arzlara katıldığınız hesapları buradan yönetebilirsiniz.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Yeni Hesap Ekle</CardTitle>
                    <CardDescription>
                        Portföyünüze yeni bir kişi veya hesap ekleyin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddAccount} className="flex space-x-2">
                        <Input
                            placeholder="Hesap Adı (Örn: Ahmet, Hanım, Çocuklar)"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                        />
                        <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" /> Ekle
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">{account.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {account.id.slice(0, 8)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeAccount(account.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
                {accounts.length === 0 && (
                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                        Henüz hiç hesap eklenmemiş.
                    </div>
                )}
            </div>
        </div>
    )
}
