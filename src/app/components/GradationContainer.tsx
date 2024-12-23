import { getRandomValues, randomInt } from 'crypto';
import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const GradationContainer = (props: { children: ReactNode,now:Date}) => {
    const deviation=+9;
    const { children,now} = props;
    const hour=(now.getUTCHours()+deviation)%24;
    console.log(hour)
    if (8 <= hour && hour < 16) {
        console.log("昼")
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-400 to-blue-700 p-5">
                {children}
            </div>
        )
    } else if (4 <= hour && hour < 20) {
        console.log("朝/夕")
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-purple-700 p-5">
                {children}
            </div>
        )
    } else {
        console.log("夜")
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-700 to-blue-800 p-5">
                {children}
            </div>
        )

    }
}

export default GradationContainer
