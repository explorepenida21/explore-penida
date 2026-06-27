'use client'

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  change?: string
  changeType?: 'up' | 'down'
}

export default function DashboardStats({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {stats.map((stat, i) => (
        <div key={i} className='bg-white p-6 rounded-xl shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-3xl'>{stat.icon}</span>
            {stat.change && (
              <span className={`text-sm ${stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            )}
          </div>
          <h3 className='text-2xl font-bold'>{stat.value}</h3>
          <p className='text-gray-500 text-sm'>{stat.title}</p>
        </div>
      ))}
    </div>
  )
}