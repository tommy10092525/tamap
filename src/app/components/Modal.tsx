import React from 'react'
import { ModalProps } from './Types';
import Card from './Card';

const Modal = (props: ModalProps) => {
  const { style, handleStationChange } = props;
  return (<div className="flex justify-center text-center w-full scroll-mb-36 mt-3 pb-2">
    {/* ボタンが押されたら状態を書き換える */}
    <div className='w-2/5 my-auto mx-1 font-bold'
      style={style.nishihachioji}>
      <Card>
        <button className="w-full"
          style={style.nishihachioji} onClick={() => {
            handleStationChange("nishihachioji")
          }}><p className="text-sm">西八王子</p></button>
      </Card>
    </div>
    <div className='w-2/5 my-auto mx-1 font-bold'
      style={style.mejirodai}>
      <Card>
        <button className="w-full"
          style={style.mejirodai} onClick={() => {
            handleStationChange("mejirodai")
          }}><p className="text-sm">めじろ台</p></button>
      </Card>
    </div>
    <div className='w-2/5 my-auto mx-1 font-bold'
      style={style.aihara}>
      <Card>
        <button className="w-full"
          style={style.aihara} onClick={() => {
            handleStationChange("aihara")
          }}><p className="text-sm">相原</p></button>
      </Card>
    </div>
  </div>)
}

export default Modal
