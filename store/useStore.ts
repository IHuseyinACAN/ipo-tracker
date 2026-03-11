import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Account, IPO, Allocation } from '@/types'
import { generateUUID } from '@/lib/utils'

interface AppState {
    accounts: Account[]
    ipos: IPO[]
    allocations: Allocation[]
    addAccount: (name: string, bankName?: string) => void
    updateAccount: (id: string, data: Partial<Account>) => void
    removeAccount: (id: string) => void
    addIPO: (ipo: Omit<IPO, 'id'>) => void
    removeIPO: (id: string) => void
    addAllocation: (allocation: Omit<Allocation, 'id'>) => void
    updateAllocation: (id: string, data: Partial<Allocation>) => void
    setAllData: (data: Partial<AppState>) => void // For Import/Restore
    updateIPO: (id: string, data: Partial<IPO>) => void
    // Seed method
    seedData: () => void
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            accounts: [],
            ipos: [],
            allocations: [],
            addAccount: (name, bankName) =>
                set((state) => ({
                    accounts: [
                        ...state.accounts,
                        { id: generateUUID(), name, bankName },
                    ],
                })),
            updateAccount: (id, data) =>
                set((state) => ({
                    accounts: state.accounts.map((a) =>
                        a.id === id ? { ...a, ...data } : a
                    ),
                })),
            removeAccount: (id) =>
                set((state) => ({
                    accounts: state.accounts.filter((a) => a.id !== id),
                    // Opsiyonel: İlişkili alokasyonları da temizlemek gerekebilir ama kullanıcı istemedikçe dokunmuyoruz
                })),
            addIPO: (ipo) =>
                set((state) => ({
                    ipos: [...state.ipos, { ...ipo, id: generateUUID() }],
                })),
            removeIPO: (id) =>
                set((state) => ({
                    ipos: state.ipos.filter((ipo) => ipo.id !== id),
                    allocations: state.allocations.filter((a) => a.ipoId !== id)
                })),
            updateIPO: (id, data) =>
                set((state) => ({
                    ipos: state.ipos.map((ipo) =>
                        ipo.id === id ? { ...ipo, ...data } : ipo
                    ),
                })),
            addAllocation: (alloc) =>
                set((state) => ({
                    allocations: [
                        ...state.allocations,
                        { ...alloc, id: generateUUID() },
                    ],
                })),
            updateAllocation: (id, data) =>
                set((state) => ({
                    allocations: state.allocations.map((a) =>
                        a.id === id ? { ...a, ...data } : a
                    ),
                })),
            setAllData: (data) =>
                set((state) => ({
                    ...state,
                    ...data
                })),
            seedData: () => {
                const { accounts, ipos, allocations } = get()

                const hasOldData = ipos.some(i => i.code === 'ORNEK')
                const hasNewData = ipos.some(i => i.code === 'EMPAE')

                if (hasNewData && !hasOldData) return

                const newIPOs: IPO[] = [
                    {
                        id: generateUUID(),
                        code: 'EMPAE',
                        companyName: 'Empa Elektronik San. ve Tic. A.Ş.',
                        price: 22.00,
                        initialPrice: 22.00,
                        status: 'upcoming',
                        startDate: '2026-02-19',
                        endDate: '2026-02-20',
                    },
                    {
                        id: generateUUID(),
                        code: 'ATATR',
                        companyName: 'Ata Turizm İşletmecilik A.Ş.',
                        price: 18.50,
                        initialPrice: 18.50,
                        sellPrice: 24.10, // Satış fiyatı eklendi
                        status: 'closed',
                        startDate: '2026-02-11',
                        endDate: '2026-02-13',
                    },
                    {
                        id: generateUUID(),
                        code: 'BESTE',
                        companyName: 'Best Brands Grup Enerji Yatırım A.Ş.',
                        price: 21.40, // Fiyat arttı
                        initialPrice: 14.70,
                        status: 'trading',
                        startDate: '2026-02-05',
                        endDate: '2026-02-06',
                    },
                    {
                        id: generateUUID(),
                        code: 'NETCD',
                        companyName: 'Netcad Yazılım A.Ş.',
                        price: 52.50, // Fiyat arttı
                        initialPrice: 46.00,
                        status: 'trading',
                        startDate: '2026-01-28',
                        endDate: '2026-01-30',
                    },
                    {
                        id: generateUUID(),
                        code: 'AKHAN',
                        companyName: 'Akhan Un Fabrikası A.Ş.',
                        price: 19.80, // Fiyat düştü
                        initialPrice: 21.50,
                        status: 'trading',
                        startDate: '2026-01-28',
                        endDate: '2026-01-30',
                    }
                ]

                if (hasOldData || ipos.length === 0) {
                    const currentAccounts = accounts.length > 0 ? accounts : [
                        { id: generateUUID(), name: 'Kendim', bankName: 'Ziraat' },
                        { id: generateUUID(), name: 'Eşim', bankName: 'Garanti' },
                    ]

                    set({ accounts: currentAccounts, ipos: newIPOs })
                } else {
                    // Veri göçü: Eğer mevcut IPO'larda initialPrice eksikse ata
                    const updatedIPOs = ipos.map(ipo => ({
                        ...ipo,
                        initialPrice: ipo.initialPrice ?? ipo.price
                    }))
                    set({ ipos: updatedIPOs })
                }
            }
        }),
        {
            name: 'ipo-tracker-storage',
        }
    )
)
