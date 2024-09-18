import React from 'react'
import { Style, UserInput } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
import Card from './Card';
const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };

// eslint-disable-next-line react/display-name
const StationSwitch = React.memo((props:{userInput:UserInput,isLoading:boolean,style:Style,handleShowModalChange:()=>void,handleStationChange:(station:string)=>void}) => {
  let { userInput, isLoading, style, handleShowModalChange, handleStationChange } = props;
  return (
    <div className='my-3 h-full w-full'>
      <Card>
        <div className="inline-flex">
          <p className="font-bold text-lg my-1 ml-1">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <div></div> : <p className="font-bold text-sm mt-3">のバス</p>}
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
  )
})

export default StationSwitch
