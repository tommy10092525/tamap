import React, { ReactNode } from 'react'

const GradationContainer = (props: { children: ReactNode }) => {
    const { children } = props;
    const equationOfTime=+9;
    const hour = (new Date().getUTCHours()+equationOfTime)%24;
    if (7 <= hour && hour < 17) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-200 to-blue-500 p-5">
                {children}
            </div>
        )
    }else if(5<=hour && hour<19){
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-purple-700 p-5">
                {children}
            </div>
        )
    }else{
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b to-purple-800 from-blue-600 p-5">
                {children}
            </div>
        )

    }
}

export default GradationContainer
