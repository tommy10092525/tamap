import React from 'react'
import { ModalProps } from './Types';


const Modal = (props:ModalProps) => {
    const {style,handleStationChange}=props;
    return (<div className="flex justify-center text-center w-full scroll-mb-36 mt-3">
      {/* ボタンが押されたら状態を書き換える */}
      <button className="w-2/5 my-auto font-bold p-2 rounded-md box-border
      bg-white bg-opacity-30 shadow"
        style={style.nishihachioji} onClick={()=>{
          handleStationChange("nishihachioji")
        }}><p className="text-sm">西八王子</p></button>
      <button className="w-2/5 mx-2 my-auto font-bold p-2 rounded-md box-border
      bg-white bg-opacity-30 shadow"
        style={style.mejirodai} onClick={() => {
          handleStationChange("mejirodai");
        }}><p className="text-sm">めじろ台</p></button>
      <button className="w-2/5 my-auto font-bold p-2 rounded-md box-border
      bg-white bg-opacity-30 shadow"
        style={style.aihara} onClick={() => {
          handleStationChange("aihara");
        }}><p className="text-sm">相原</p></button>
    </div>)
  }

export default Modal
