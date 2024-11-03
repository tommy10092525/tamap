import React from 'react'
import { Style, UserInput } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
import Card from './Card';
import { Button } from '@chakra-ui/react';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@chakra-ui/react';
import { stationNames } from '@/constants/settings';



// eslint-disable-next-line react/display-name
const StationSwitch = (props: { userInput: UserInput, isLoading: boolean, handleShowModalChange: () => void, handleStationChange: (station: string) => void }) => {
  let { userInput, isLoading, handleShowModalChange, handleStationChange } = props;
  return (
    <div className='my-3 w-full'>
      <Card>
        <div className="inline-flex h-14">
          <p className="font-bold text-2xl ml-2 mt-3">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <React.Fragment></React.Fragment> : <p className="font-bold text-base mt-5">のバス</p>}
        </div>
        <MenuRoot>
          <MenuTrigger
            asChild
            className='bg-white bg-opacity-50 float-right'>
            <Button className='bg-white bg-opacity-50 rounded-md shadow m-2 p-2 font-bold transition-colors'>バスを変更</Button>
          </MenuTrigger>
          <MenuContent className='bg-white bg-opacity-0 border-0 shadow-none'>
            {Object.entries(stationNames).map(([key, value]) => {
              return (
                <MenuItem value={key} key={key}
                  className='bg-white bg-opacity-0 m-0 px-1 py-0 w-1/3 float-left'>
                  <Button
                  size={"xs"}
                  className='bg-white bg-opacity-50 shadow rounded-md font-bold my-1 transition-colors float-left px-1 w-full'
                  onClick={() => {
                    handleStationChange(key);
                  }}>{value}</Button>
                </MenuItem>
              )
            })}
          </MenuContent>
        </MenuRoot>
      </Card>
    </div>
  )
}

export default StationSwitch
