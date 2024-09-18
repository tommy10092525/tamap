import React from 'react'
import { StationSwitchProps } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
import Card from './Card';
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };

const StationSwitch = (props: StationSwitchProps) => {
  let { userInput, timeTableIsLoading, style, handleShowModalChange, handleStationChange } = props;
  return (
    <div className='my-3 h-full w-full'>
      <Card>
        <div className="inline-flex">
          <p className="font-bold text-lg my-1 ml-1">{timeTableIsLoading ? "loading" : stationNames[userInput.station]}</p>
          {timeTableIsLoading ? <></> : <p className="font-bold text-sm mt-3">のバス</p>}
        </div>
        <div className='w-1/2 float-right font-bold mt-2 mr-3 text-center'>
          <Card>
            <button className="w-full"
              onClick={handleShowModalChange}>
              <p>バスを変更</p>
            </button>
          </Card>
        </div>
        {userInput.showModal ? <Modal style={style} handleStationChange={handleStationChange} /> : <></>}
      </Card>
    </div>
    // <div className="my-3 shadow rounded-md bg-white bg-opacity-40 h-full p-2 w-full">
    //   <div className="inline-flex">
    //     <p className="font-bold text-xl">{timeTableIsLoading ? "loading" : stationNames[userInput.station]}</p>
    //     {timeTableIsLoading ? <></> : <p className="font-bold text-sm mt-2">のバス</p>}
    //   </div>
    //   <button className="w-1/2 float-right font-bold shadow rounded-md bg-white bg-opacity-40 p-1 text-center"
    //     onClick={handleShowModalChange}>
    //     <p >バスを変更</p>
    //     </button>
    //   {userInput.showModal ? <Modal style={style} handleStationChange={handleStationChange} /> : <></>}
    // </div>
  )
}

export default StationSwitch
