import React from 'react'
import { Style, UserInput } from './Types';
import Modal from './Modal';
import { StationNames } from './Types';
import {Card} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@chakra-ui/react';
import { stationNames } from '@/constants/settings';
import {
  Popover,
  PopoverTrigger,
  PopoverContent } from '@/components/ui/popover';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  


// eslint-disable-next-line react/display-name
const StationSwitch = (props: { userInput: UserInput, isLoading: boolean, handleShowModalChange: () => void, handleStationChange: (station: string) => void }) => {
  let { userInput, isLoading, handleShowModalChange, handleStationChange } = props;
  return (
    <div className='my-3 w-full'>
      <Card className='border-0 bg-opacity-15'>
        <div className="inline-flex h-14">
          <p className="mt-3 ml-2 font-bold text-2xl">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <React.Fragment></React.Fragment> : <p className="mt-5 font-bold text-base dark:text-black">のバス</p>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='float-right mt-[10px] mr-3'>
            <Button className='border-0 bg-white hover:bg-white bg-opacity-35 hover:bg-opacity-45 font-semibold text-black'>バスを変更</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='border-gray-400 bg-opacity-15'>
          {Object.entries(stationNames).map(([key, value]) => {
              return (
                    <DropdownMenuItem
                    key={key}
                    className='bg-white bg-opacity-50 shadow backdrop-blur-sm m-1 rounded-md font-bold text-black transition-colors'
                    onClick={() => {
                      handleStationChange(key);
                    }}><p className='text-center'>{value}</p></DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <MenuRoot>
          <MenuTrigger
            asChild
            className='float-right bg-white bg-opacity-50'>
            <Button className='bg-white bg-opacity-50 shadow m-2 p-2 rounded-md font-bold transition-colors'>バスを変更</Button>
          </MenuTrigger>
          <MenuContent className='border-0 bg-white bg-opacity-0 shadow-none'>
            {Object.entries(stationNames).map(([key, value]) => {
              return (
                <MenuItem value={key} key={key}
                  className='float-left bg-white bg-opacity-0 m-0 px-1 py-0 w-1/3'>
                  <Button
                  className='float-left bg-white bg-opacity-50 shadow my-1 px-1 rounded-md w-full font-bold text-black transition-colors'
                  onClick={() => {
                    handleStationChange(key);
                  }}>{value}</Button>
                </MenuItem>
              )
            })}
          </MenuContent>
        </MenuRoot> */}
      </Card>
    </div>
  )
}

export default StationSwitch
