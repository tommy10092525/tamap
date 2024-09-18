import React from 'react'
import { Style } from './Types';

const Modal = (props: {style:Style,handleStationChange:(station:string)=>void}) => {
  const { style, handleStationChange } = props;
  return (<div className="flex justify-center text-center w-full scroll-mb-36 mt-3 pb-2">
    {/* ボタンが押されたら状態を書き換える */}
    <div className='w-2/5 my-auto mx-1 font-bold rounded-md bg-opacity-60 bg-white shadow'
      style={style.nishihachioji}>
      <button className="w-full"
        style={style.nishihachioji} onClick={() => {
          handleStationChange("nishihachioji")
        }}><p className="text-sm">西八王子</p></button>
    </div>
    <div className='w-2/5 my-auto mx-1 font-bold rounded-md bg-opacity-60 bg-white shadow'
      style={style.mejirodai}>
      <button className="w-full"
        onClick={() => {
          handleStationChange("mejirodai")
        }}><p className="text-sm">めじろ台</p></button>
    </div>
    <div className='w-2/5 my-auto mx-1 font-bold rounded-md bg-opacity-60 bg-white shadow'
      style={style.aihara}>
      <button className="w-full"
        onClick={() => {
          handleStationChange("aihara")
        }}><p className="text-sm">相原</p></button>
    </div>
  </div>)
}

export default Modal
