import React from 'react'
import {Card} from '@/components/ui/card';

// eslint-disable-next-line react/display-name
const TimeBox =(props: { text: string }) => {
  const { text } = props;
  return (
    <Card className='border-0 bg-opacity-15'>
      <p className='font-semibold text-sm'>{text}</p>
    </Card>
  )
}

export default TimeBox
