import React, { ReactNode } from 'react'
import { Style } from './Types'

// eslint-disable-next-line react/display-name
const Card = React.memo((props:{children:ReactNode,style?:Style}) => {
    let {children,style}=props;
    return (
        <div className='shadow rounded-md bg-white bg-opacity-60'
            style={style}>
            {children}
        </div>
    )
})

export default Card
