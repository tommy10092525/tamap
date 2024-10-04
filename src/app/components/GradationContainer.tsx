import { getRandomValues, randomInt } from 'crypto';
import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const GradationContainer = React.memo((props: { children: ReactNode,hour:number}) => {
    const { children} = props;
    const hour=new Date().getMilliseconds()%24
    console.log(hour);
    if (8 <= hour && hour < 16) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-400 to-blue-700 p-5">
                {children}
            </div>
        )
    } else if (4 <= hour && hour < 20) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-purple-700 p-5">
                {children}
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-700 to-blue-800 p-5">
                {children}
            </div>
        )

    }
})

export default GradationContainer
