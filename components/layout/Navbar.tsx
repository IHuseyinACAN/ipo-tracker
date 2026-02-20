import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { DataManagementDialog } from '@/components/dashboard/DataManagementDialog'

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center mx-auto px-4">
                <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Wallet className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                        <span className="font-bold text-lg tracking-tight">
                            IPO Tracker
                        </span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground mr-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Canlı Takip Aktif
                    </div>
                    <DataManagementDialog />
                </div>
            </div>
        </nav>
    )
}
