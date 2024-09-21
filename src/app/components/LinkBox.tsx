import React, { ReactNode } from 'react'
import Card from './Card'

// eslint-disable-next-line react/display-name
const LinkBox = React.memo((props: {text:string,url:string}) => {
    const {text,url}=props;
    return (
        <div className='w-1/2'>
            <div className="font-bold mb-1 mx-1 w-auto text-center">
                <Card>
                    <a href={url}>{text}</a>
                </Card>
            </div>
        </div>

    )
})

export default LinkBox
