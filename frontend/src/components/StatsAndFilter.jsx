import { FilterType } from '@/lib/data'
import { Badge } from './ui/badge'
import React from 'react'
import { Button } from './ui/button'
import { Filter } from 'lucide-react'

const StatsAndFilter = ( {complepteedTaskCount = 0, activeTaskCount = 0, filter = "all", setFilter }) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      {/* Thống kê công việc */}
      <div className="flex gap-3">
        <Badge variant="secondary" className="bg-white/50 text-accent-foreground border-info/20">
          {activeTaskCount} {FilterType.active}
        </Badge>
        <Badge variant="secondary" className="bg-white/50 text-success border-success/20">
          {complepteedTaskCount} {FilterType.completed}
        </Badge>
      </div>

      {/* Bộ lọc công việc */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {Object.keys(FilterType).map((type) => (
          <Button
            key={type}
            variant={filter === type ? 'gradient' : 'ghost'}
            size="sm"
            className="capitalize"
            onClick={() => setFilter(type)}
          >
            <Filter className="size-4" />
            {FilterType[type]}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default StatsAndFilter