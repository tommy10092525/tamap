import React from 'react'
import Card from './Card';

// eslint-disable-next-line react/display-name
const TimeBox=React.memo((props:{text:string,arr?:[]})=>{
    const {text}=props;
    return(
      <Card>
        <p className='text-sm font-semibold'>{text}</p>
      </Card>
    )
  })

export default TimeBox
