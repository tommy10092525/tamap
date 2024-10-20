import React from 'react'
import Image from "next/image"
import { BusTime, Caption } from "./Types"
import Card from './Card';
import { minutesToTime } from '../features/timeHandlers';
import { stationNames } from '@/constants/settings';

import arrow from "./arrow.png"

// eslint-disable-next-line react/display-name
const TimeCaption = (props: { caption: Caption, isLoading: boolean, handleDirectionChange: () => void }) => {
  const { caption, isLoading, handleDirectionChange } = props;
  return (
    <div className="w-full">
      <Card>
        <div className="text-center justify-center text-2xl font-bold pt-4 flex">
          <p className='w-full'>{isLoading ? "loading" : caption.departure}</p>
          <p>→</p>
          <p className='w-full'>{isLoading ? "loading" : caption.destination}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-2xl font-bold opacity-50">
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.previousBuses[1].leaveHour * 60 + caption.previousBuses[1].leaveMinute)}</p>
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.previousBuses[1].arriveHour * 60 + caption.previousBuses[1].arriveMinute)}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-3xl font-bold opacity-70">
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.previousBuses[0].leaveHour * 60 + caption.previousBuses[0].leaveMinute)}</p>
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.previousBuses[0].arriveHour * 60 + caption.previousBuses[0].arriveMinute)}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-4xl font-bold">
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.futureBuses[0].leaveHour * 60 + caption.futureBuses[0].leaveMinute)}</p>
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.futureBuses[0].arriveHour * 60 + caption.futureBuses[0].arriveMinute)}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-3xl font-bold opacity-70">
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.futureBuses[1].leaveHour * 60 + caption.futureBuses[1].leaveMinute)}</p>
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.futureBuses[1].arriveHour * 60 + caption.futureBuses[1].arriveMinute)}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-2xl font-bold opacity-50">
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.futureBuses[2].leaveHour * 60 + caption.futureBuses[2].leaveMinute)}</p>
          <p className="px-1 w-full">{isLoading ? "loading" : minutesToTime(caption.futureBuses[2].arriveHour * 60 + caption.futureBuses[2].arriveMinute)}</p>
        </div>
        <div className="inline-flex text-center items-center mx-auto font-bold w-full">
          {/* ボタンが押されたら状態を書き換える */}
          <div className="my-2 mx-auto border-solid w-1/2 text-center bg-white rounded-md bg-opacity-50 hover:bg-opacity-70 shadow">
            <button
              className="w-full"
              onClick={handleDirectionChange}>
            <div className='h-2 ml-1 mb-1'>
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
              className='rotate-180 -mt-[10px]'
              />
            </div>
              <p className="-mt-2">左右入替</p></button>
            </div>
        </div>
      </Card>
    </div>

  )
}

export default TimeCaption
