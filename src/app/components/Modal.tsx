import React from 'react'
import { Style, UserInput } from './Types';
import StationButton from './StationButton';

const Modal = (props: {userInput:UserInput, handleStationChange: (station: string) => void }) => {
  const {handleStationChange,userInput} = props;
  return (<div className="flex justify-center text-center w-full scroll-mb-36 mt-0 pb-2">
    {/* ボタンが押されたら状態を書き換える */}
    <StationButton
      handleStationChange={handleStationChange}
      station='nishihachioji'
      stationText='西八王子'
      isSelected={userInput.station=="nishihachioji"}/>
    <StationButton
      handleStationChange={handleStationChange}
      station='mejirodai'
      stationText='めじろ台'
      isSelected={userInput.station=="mejirodai"}/>
    <StationButton
      handleStationChange={handleStationChange}
      station='aihara'
      stationText='相原'
      isSelected={userInput.station=="aihara"}/>
  </div>)
}

export default Modal
