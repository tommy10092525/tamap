import React, { ReactNode } from 'react'

// eslint-disable-next-line react/display-name
const GradationContainer = React.memo((props: { children: ReactNode,hour:number}) => {
    const { children,hour} = props;
    console.log(hour);
    if (8 <= hour && hour < 16) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-200 to-blue-500 p-5">
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b to-purple-800 from-blue-600 p-5">
                {children}
            </div>
        )

    }
})

export default GradationContainer
