import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const Card = (props: { children: ReactNode }) => {
    let { children } = props;
    return (
        <div className='shadow-none rounded-2xl bg-white bg-opacity-10'>
            {children}
        </div>
    )
}

export default Card
