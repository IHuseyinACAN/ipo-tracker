'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, Plus, User, Users, Settings2, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BANKS = [
    "Yapıkredi", "Garanti", "Ziraat", "İş bankası", 
    "Kuveyt türk", "Qnb finansbank", "Vakıfbank", "Midas"
]

export default function AccountsPage() {
    const { accounts, addAccount, removeAccount, updateAccount } = useStore()
    const [newAccountName, setNewAccountName] = useState('')
    const [newBankName, setNewBankName] = useState('')
    
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editBank, setEditBank] = useState('')

    const handleAddAccount = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAccountName.trim()) return
        addAccount(newAccountName, newBankName || undefined)
        setNewAccountName('')
        setNewBankName('')
    }

    const startEditing = (account: any) => {
        setEditingId(account.id)
        setEditName(account.name)
        setEditBank(account.bankName || '')
    }

    const saveEdit = () => {
        if (!editingId) return
        updateAccount(editingId, { name: editName, bankName: editBank })
        setEditingId(null)
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight neon-text">Hesap Yönetimi</h2>
                    <p className="text-muted-foreground mt-1">Halka arzlara katıldığınız hesapları yönetin.</p>
                </div>
                <div className="p-3 glass rounded-full neon-border">
                    <Users className="h-6 w-6 text-blue-400" />
                </div>
            </motion.div>

            <Card className="glass border-none neon-border overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/10">
                    <CardTitle className="text-xl">Yeni Hesap Ekle</CardTitle>
                    <CardDescription>
                        Portföyünüze yeni bir kişi veya hesap ekleyin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleAddAccount} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                placeholder="Hesap Adı"
                                value={newAccountName}
                                onChange={(e) => setNewAccountName(e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-blue-500/50 flex-1"
                            />
                            <Select value={newBankName} onValueChange={setNewBankName}>
                                <SelectTrigger className="bg-white/5 border-white/10 w-full sm:w-[200px]">
                                    <SelectValue placeholder="Banka Seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BANKS.map(bank => (
                                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                <Plus className="mr-2 h-4 w-4" /> Ekle
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {accounts.map((account, index) => (
                        <motion.div 
                            key={account.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 glass rounded-xl border-none group hover:bg-white/5 transition-all"
                        >
                            {editingId === account.id ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="bg-white/10 border-blue-500/30 flex-1"
                                        />
                                        <Select value={editBank} onValueChange={setEditBank}>
                                            <SelectTrigger className="bg-white/10 border-blue-500/30 w-full sm:w-[200px]">
                                                <SelectValue placeholder="Banka Seç" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BANKS.map(bank => (
                                                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-2">
                                            <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700" onClick={saveEdit}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-red-400" onClick={() => setEditingId(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                            <User className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-lg group-hover:neon-text transition-all">{account.name}</p>
                                                {account.bankName && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground uppercase tracking-wider font-semibold border border-white/5">
                                                        {account.bankName}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">ID: {account.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => startEditing(account)}
                                            className="text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => {
                                                if(confirm(`${account.name} hesabını silmek istediğinize emin misiniz?`)) {
                                                    removeAccount(account.id)
                                                }
                                            }} 
                                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {accounts.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-12 glass rounded-xl border-dashed border-2 border-white/10"
                    >
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">Henüz hiç hesap eklenmemiş.</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
