import React, { ReactNode } from 'react'

type Props={
    children:ReactNode;
}

const Card = (props:Props) => {
    let children=props.children
    return (
        <div className='shadow rounded-md bg-white bg-opacity-40'>
            {children}
        </div>
    )
}

export default Card
