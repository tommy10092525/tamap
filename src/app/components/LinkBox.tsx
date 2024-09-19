import React, { ReactNode } from 'react'
import Card from './Card'

// eslint-disable-next-line react/display-name
const LinkBox = React.memo((props: { children: ReactNode }) => {
    return (
        <div className="font-bold mb-1 mx-1 w-5/12 text-center">
            <Card>
                {props.children}
            </Card>
        </div>
    )
})

export default LinkBox
