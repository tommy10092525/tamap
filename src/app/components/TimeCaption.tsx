import React from 'react'
import Image from "next/image"
import { BusTime, Caption } from "./Types"
import {Card} from '@/components/ui/card';
import { minutesToTime } from '../features/timeHandlers';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"


import arrow from "./arrow.png"

// eslint-disable-next-line react/display-name
const TimeCaption = (props: { caption: Caption, isLoading: boolean, handleDirectionChange: () => void }) => {
  const { isLoading, handleDirectionChange } = props;
  let {caption} = props;
  caption.previousBuses.sort((a: BusTime, b: BusTime) => {
    return (a.leaveHour * 60 + a.leaveMinute) - (b.leaveHour * 60 + b.leaveMinute)
  })
  return (
    <div className="w-full">
      <Card className='border-0 bg-opacity-15'>
        <div className="flex justify-center pt-4 font-bold text-2xl text-center">
          <p className='w-full'>{isLoading ? "loading" : caption.departure}</p>
          <p>→</p>
          <p className='w-full'>{isLoading ? "loading" : caption.destination}</p>
        </div>
        <ScrollArea className='h-36'>
        {caption.previousBuses.map(bus=>{
          return (
            <div className="flex justify-center opacity-50 mx-0 font-bold text-2xl text-center" key={JSON.stringify(bus)}>
              <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(bus.leaveHour * 60 + bus.leaveMinute)}</p>
              <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(bus.arriveHour * 60 + bus.arriveMinute)}</p>
            </div>
          )
        })}
        {caption.futureBuses.map(bus=>{
          return (
            <div className="flex justify-center mx-0 font-bold text-3xl text-center" key={JSON.stringify(bus)}>
              <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(bus.leaveHour * 60 + bus.leaveMinute)}</p>
              <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(bus.arriveHour * 60 + bus.arriveMinute)}</p>
            </div>
          )
        })}
        </ScrollArea>
        <div className="inline-flex items-center mx-auto w-full font-bold text-center">
          {/* ボタンが押されたら状態を書き換える */}
            <Button
              size="sm"
              className="bg-white hover:bg-white bg-opacity-30 hover:bg-opacity-45 shadow mx-auto my-2 pt-2 border-solid rounded-md w-1/3 font-semibold text-base text-black text-center transition-colors" 
              onClick={handleDirectionChange}>
                <div className='-mt-3'>
                  <Image
                    alt='arrow'
                    src={arrow}
                    height={20}
                    className=''
                  />
                  <Image
                    alt='arrow'
                    src={arrow}
                    height={20}
                    className='-mt-[10px] rotate-180'
                  />
                </div>
                <p className="-mt-2 font-bold">左右入替</p>
            </Button>
        </div>
      </Card>
    </div>

  )
}

export default TimeCaption
