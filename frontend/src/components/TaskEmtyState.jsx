import { Circle } from 'lucide-react'
import React from 'react'
import { Card } from './ui/card'

export const TaskEmtyState = ({filter}) => {
  return (
    <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
        <div className="space-y-3">
            <Circle className="size-12 mx-auto text-muted-foreground" />
            <div className="font-medium text-foreground">
                <h3 className="font-medium text-foreground">
                    {
                        filter === 'active' ?
                        "Không có công việc đang làm" :
                        filter === 'completed' ?
                        "Không có công việc đã hoàn thành"
                        : "Không có công việc nào"
                    }
                </h3>
                <p className='text-sm text-muted-foreground'>
                    {filter === 'all' ? "Thêm công việc để bắt đầu quản lý công việc của bạn." : `Chuyển sang "tất cả" để xem công việc ${filter === 'active' ? "đẫ làm" : "Đang làm"} `}
                </p>
            </div>
        </div>
    </Card>
  )
}
