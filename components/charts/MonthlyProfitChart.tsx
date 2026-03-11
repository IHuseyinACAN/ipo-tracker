'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

interface MonthlyProfitChartProps {
  data: {
    month: string
    profit: number
  }[]
}

export function MonthlyProfitChart({ data }: MonthlyProfitChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
        Yeterli veri bulunamadı. Tamamlanmış halka arzlarınız olduğunda burada kâr grafiği görünecektir.
      </div>
    )
  }

  // Format month names (e.g., 2026-02 -> Şub '26)
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' })
  }

  const chartData = data.map(item => ({
    ...item,
    formattedMonth: formatMonth(item.month)
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="formattedMonth" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickFormatter={(value) => `${value.toLocaleString('tr-TR')} ₺`}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)'
          }}
          itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
          labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          formatter={(value: any) => {
            if (value === undefined || value === null) return ['0 ₺', 'Toplam Kâr'];
            const val = Number(value);
            return [`${val.toLocaleString('tr-TR')} ₺`, 'Toplam Kâr']
          }}
          cursor={{ stroke: 'rgba(168, 85, 247, 0.2)', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="#a855f7"
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorProfit)"
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
