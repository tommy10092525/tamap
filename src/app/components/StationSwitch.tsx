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
const StationSwitch = (props: { userInput: UserInput, isLoading: boolean,handleStationChange: (station: string) => void }) => {
  let { userInput, isLoading, handleStationChange } = props;
  return (
    <div className='my-3 w-full'>
      <Card className='border-0 bg-opacity-15'>
        <div className="inline-flex h-14">
          <p className="mt-3 ml-2 font-bold text-2xl">{isLoading ? "loading" : stationNames[userInput.station]}</p>
          {isLoading ? <React.Fragment></React.Fragment> : <p className="mt-5 font-bold text-base dark:text-black">のバス</p>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className='float-right mt-[10px] mr-3'>
            <Button className='border-0 bg-white hover:bg-white bg-opacity-35 hover:bg-opacity-45'>
              <p className='font-semibold text-black'>
              バスを変更
              </p>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='border-0 bg-opacity-15 shadow-lg backdrop-blur-sm'>
          {Object.entries(stationNames).map(([key, value]) => {
            return (
              <DropdownMenuItem
              key={key}
              className='bg-white bg-opacity-50 shadow backdrop-blur-sm m-1 rounded-md text-black transition-colors'
              onClick={() => {
                handleStationChange(key);
              }}><p className='font-bold text-center text-lg'>{value}</p></DropdownMenuItem>
            )
          })}
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </div>
  )
}

export default StationSwitch
