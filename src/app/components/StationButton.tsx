import React from 'react'
import { Style } from 'util'

const StationButton = (props: { isSelected:boolean, handleStationChange: (station: string) => void, station: string, stationText: string }) => {
  const { isSelected, handleStationChange, station, stationText } = props;
  if(isSelected){
  return (
    <div className='w-2/5 my-auto mx-1 font-extrabold rounded-md bg-white shadow border-sky-400 border-2'>
      <button className="w-full" onClick={() => {
        handleStationChange(station)
      }}><p className="text-sm">{stationText}</p></button>
    </div>
  )}else{
    return(
      <div className='w-2/5 my-auto mx-1 font-bold rounded-md bg-opacity-40 bg-white shadow'>
      <button className="w-full" onClick={() => {
        handleStationChange(station)
      }}><p className="text-sm">{stationText}</p></button>
    </div>
    )
  }
}

export default StationButton
