import React from 'react'
import { StationSwitchProps } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
const stationNames:StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };

const StationSwitch = (props:StationSwitchProps) => {
    let {userInput,timeTableIsLoading,style,handleShowModalChange,handleStationChange}=props;
    return (
      <div className="my-3 shadow rounded-md bg-white bg-opacity-40 h-full p-2 w-full">
        <div className="inline-flex">
          <p className="font-bold text-xl">{timeTableIsLoading ? "loading" : stationNames[userInput.station]}</p>
          {timeTableIsLoading ? <></> : <p className="font-bold text-sm mt-2">のバス</p>}
        </div>
        <button className="w-1/2 float-right font-bold shadow rounded-md bg-white bg-opacity-40 p-1 text-center"
          onClick={handleShowModalChange}>
          <p >バスを変更</p>
          </button>
        {userInput.showModal ? <Modal style={style} handleStationChange={handleStationChange} /> : <></>}
      </div>
    )
  }

export default StationSwitch
