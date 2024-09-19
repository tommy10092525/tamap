import React from 'react'
import { Style } from './Types'

const StationButton = (props: { station: string, style: Style, handleStationChange: (station: string) => void }) => {
    const { station, style, handleStationChange } = props;
    return (
        <div className='w-2/5 my-auto mx-1 font-bold rounded-md bg-opacity-60 bg-white shadow'
            style={style.nishihachioji}>
            <button className="w-full" onClick={() => {
                handleStationChange("nishihachioji")
            }}><p className="text-sm">西八王子</p></button>
        </div>
    )
}

export default StationButton
