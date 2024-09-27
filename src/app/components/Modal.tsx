import React from 'react'
import { Style, UserInput } from './Types';
import StationButton from './StationButton';
import { stationNames } from '@/constants/settings';

const Modal = (props: { userInput: UserInput, handleStationChange: (station: string) => void }) => {
  const { handleStationChange, userInput } = props;
  let arr:any[] = [];
  for (const item in stationNames) {
    arr.push(<StationButton
      key={item}
      handleStationChange={handleStationChange}
      station={item}
      stationText={stationNames[item]}
      isSelected={userInput.station == item} />)
  }
  return (<div className="flex justify-center text-center w-full scroll-mb-36 mt-0 pb-2">
    {/* ボタンが押されたら状態を書き換える */}
    {arr.map(item => item)}
  </div>)
}

export default Modal
