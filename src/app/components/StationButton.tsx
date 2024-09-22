import React from 'react'
import { Style } from 'util'

const StationButton = (props:{style:{},handleStationChange:(station:string)=>void,station:string,stationText:string}) => {
    const {style,handleStationChange,station,stationText}=props;
  return (
    <div className='w-2/5 my-auto mx-1 font-bold rounded-md bg-opacity-40 bg-white shadow'
    style={style}>
    <button className="w-full" onClick={() => {
        handleStationChange(station)
      }}><p className="text-sm">{stationText}</p></button>
  </div>
  )
}

export default StationButton
