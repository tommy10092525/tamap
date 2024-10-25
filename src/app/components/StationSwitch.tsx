import React from 'react'
import { Style, UserInput } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
import Card from './Card';
import { Button } from '@chakra-ui/react';
import { MenuRoot,MenuTrigger,MenuContent,MenuItem } from '@chakra-ui/react';

const stationNames: StationNames = { nishihachioji: "西八王子", mejirodai: "めじろ台", aihara: "相原" };

// eslint-disable-next-line react/display-name
const StationSwitch =(props: { userInput: UserInput, isLoading: boolean, handleShowModalChange: () => void, handleStationChange: (station: string) => void }) => {
  let { userInput, isLoading, handleShowModalChange, handleStationChange } = props;
  return (
    <div className='my-3 w-full'>
      <Card>
        <div className="inline-flex h-14">
          <p className="font-bold text-2xl ml-2 mt-3">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <div></div> : <p className="font-bold text-base mt-5">のバス</p>}
        </div>
        {/* <div className='w-1/2 float-right font-bold mt-2 mr-2 text-center bg-white bg-opacity-50 rounded-md hover:bg-opacity-70 shadow'>
          <Button className="w-full h-2"
            onClick={handleShowModalChange}>
            バスを変更
          </Button></div>
        {userInput.showModal ? <Modal handleStationChange={handleStationChange} userInput={userInput} /> : <></>} */}
        <MenuRoot>
          <MenuTrigger
            asChild
            className='bg-white bg-opacity-50 float-right'>
            <Button className='bg-white bg-opacity-50 rounded-md shadow m-2 p-2 font-bold hover:bg-opacity-70'>バスを変更</Button>
          </MenuTrigger>
          <MenuContent className='bg-white bg-opacity-0 border-0'>
            <MenuItem value="nishihachioji" onClick={()=>{
              handleStationChange("nishihachioji");
            }} className='bg-white bg-opacity-50 shadow rounded-md hover:bg-blue-300 font-bold'>西八王子</MenuItem>
            <MenuItem value="mejirodai" onClick={()=>{
              handleStationChange("mejirodai");
            }} className='bg-white bg-opacity-50 shadow rounded-md my-1 hover:bg-blue-300 font-bold'>めじろ台</MenuItem>
            <MenuItem value="aihara" onClick={()=>{
              handleStationChange("aihara");
            }} className='bg-white bg-opacity-50 shadow rounded-md hover:bg-blue-300 font-bold'>相原</MenuItem>
          </MenuContent>
        </MenuRoot>
      </Card>
    </div>
  )
}

export default StationSwitch
