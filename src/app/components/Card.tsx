import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const Card = React.memo((props: { children: ReactNode }) => {
    let { children } = props;
    return (
        <div className='shadow rounded-md bg-white dark:bg-gray-200 bg-opacity-50 dark:bg-opacity-50'>
            {children}
        </div>
    )
})

export default Card
