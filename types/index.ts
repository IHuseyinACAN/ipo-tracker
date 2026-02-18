export type Account = {
    id: string
    name: string
    // Future: totalBalance, etc.
}

export type IPOStatus = 'upcoming' | 'open' | 'trading' | 'closed'

export interface IPO {
    id: string
    code: string
    companyName: string
    price: number // Güncel Fiyat (Takip için değişebilir)
    initialPrice: number // Halka Arz Fiyatı (Maliyet hesabı için sabit)
    status: IPOStatus
    startDate: string
    endDate: string
    sellPrice?: number // Opsiyonel satış fiyatı
}

export type Allocation = {
    id: string
    ipoId: string
    accountId: string
    requestedAmount?: number // Talep edilen tutar (opsiyonel)
    allocatedLot: number // Kesinleşen lot
    soldPrice?: number // Satış fiyatı (eğer satıldıysa)
    isSold: boolean
}
