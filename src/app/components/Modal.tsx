import React from 'react'
import { Style } from './Types';
import StationButton from './StationButton';

const Modal = (props: {style:Style,handleStationChange:(station:string)=>void}) => {
  const { style, handleStationChange } = props;
  return (<div className="flex justify-center text-center w-full scroll-mb-36 mt-0 pb-2">
    {/* ボタンが押されたら状態を書き換える */}
    <StationButton
      handleStationChange={handleStationChange}
      station='nishihachioji'
      stationText='西八王子'
      style={style.nishihachioji}/>
    <StationButton
      handleStationChange={handleStationChange}
      station='mejirodai'
      stationText='めじろ台'
      style={style.mejirodai}/>
    <StationButton
      handleStationChange={handleStationChange}
      station='aihara'
      stationText='相原'
      style={style.aihara}/>
  </div>)
}

export default Modal
