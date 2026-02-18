'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export function ClientInitializer() {
    const seedData = useStore((state) => state.seedData)

    useEffect(() => {
        seedData()
    }, [seedData])

    return null
}
