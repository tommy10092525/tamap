import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const Card = (props: { children: ReactNode }) => {
    let { children } = props;
    return (
        <div className='shadow-none rounded-md bg-white bg-opacity-30'>
            {children}
        </div>
    )
}

export default Card
