import React, { ReactNode } from 'react'
import { Style } from './Types'

type Props={
    children:ReactNode;
    style?:Style
}

const Card = (props:Props) => {
    let {children,style}=props;
    return (
        <div className='shadow rounded-md bg-white bg-opacity-60'
            style={style}>
            {children}
        </div>
    )
}

export default Card
