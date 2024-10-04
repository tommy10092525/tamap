import React, { Children, ReactNode } from 'react'
import Card from './Card'

// eslint-disable-next-line react/display-name
const LinkBox = React.memo((props: {children:ReactNode}) => {
    const {children}=props;
    return (
        <div className='w-1/2'>
            <div className="font-bold mb-1 mx-1 w-auto text-center">
                <Card>
                    {children}
                </Card>
            </div>
        </div>

    )
})

export default LinkBox
