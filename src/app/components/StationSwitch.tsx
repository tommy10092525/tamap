import React from 'react'
import { Style, UserInput } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
import Card from './Card';
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };

// eslint-disable-next-line react/display-name
const StationSwitch =(props: { userInput: UserInput, isLoading: boolean, handleShowModalChange: () => void, handleStationChange: (station: string) => void }) => {
  let { userInput, isLoading, handleShowModalChange, handleStationChange } = props;
  return (
    <div className='my-3 w-full'>
      <Card>
        <div className="inline-flex h-10">
          <p className="font-bold text-2xl ml-2 mt-[3px]">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <div></div> : <p className="font-bold text-base mt-3">のバス</p>}
        </div>
        <div className='w-1/2 float-right font-bold mt-2 mr-2 text-center bg-white bg-opacity-50 rounded-md hover:bg-opacity-70 shadow'>
          <button className="w-full"
            onClick={handleShowModalChange}>
            <p>バスを変更</p>
          </button></div>
        {userInput.showModal ? <Modal handleStationChange={handleStationChange} userInput={userInput} /> : <></>}
      </Card>
    </div>
  )
}

export default StationSwitch
