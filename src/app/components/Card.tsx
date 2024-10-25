import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const Card = (props: { children: ReactNode }) => {
    let { children } = props;
    return (
        <div className='shadow rounded-md bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-80 dark:text-white dark:border-gray-500 dark:border-[1px]'>
            {children}
        </div>
    )
}

export default Card
