import React from 'react'
import { Button } from './ui/button'

function RecentOrderItem({order_name , company_name}) {
  return (
    <div className='flex gap-2 justify-around w-full mb-2'>
      <p>{order_name}</p>
      <p>{company_name}</p>
      <p>status</p>
      <Button>View</Button>
    </div>
  )
}

export default RecentOrderItem
