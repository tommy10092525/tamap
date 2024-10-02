import React from 'react'
import { BusTime} from "./Types"
import Card from './Card';
import { minutesToTime } from '../features/timeHandlers';
import { stationNames } from '@/constants/settings';

// eslint-disable-next-line react/display-name
const TimeCaption = React.memo((props: { firstBus: BusTime | null, secondBus: BusTime | null, isLoading: boolean, handleDirectionChange: () => void }) => {
  const { firstBus, secondBus, isLoading, handleDirectionChange } = props;

  return (
    <div className="w-full">
      <Card>
        <div className="text-center justify-center text-2xl font-bold pt-4 flex">
          <p className='w-full'>{isLoading || !firstBus? "loading": firstBus.isComingToHosei ? stationNames[firstBus.station] : "法政大学"}</p>
          <p>→</p>
          <p className='w-full'>{isLoading || !firstBus? "loading": firstBus.isComingToHosei ? "法政大学" : stationNames[firstBus.station]}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-4xl font-bold">
          <p className="px-1 w-full">{!isLoading && firstBus ? minutesToTime(firstBus.leaveHour * 60 + firstBus.leaveMinute) : "loading"}</p>
          <p className="px-1 w-full">{!isLoading && firstBus ? minutesToTime(firstBus.arriveHour * 60 + firstBus.arriveMinute) : "loading"}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-2xl font-bold opacity-50">
          <p className="px-1 w-full">{!isLoading && secondBus ? minutesToTime(secondBus.leaveHour * 60 + secondBus.leaveMinute) : "loading"}</p>
          <p className="px-1 w-full">{!isLoading && secondBus ? minutesToTime(secondBus.arriveHour * 60 + secondBus.arriveMinute) : "loading"}</p>
        </div>
        <div className="inline-flex text-center items-center mx-auto font-bold w-full">
          {/* ボタンが押されたら状態を書き換える */}
          <div className="my-2 mx-auto border-solid w-1/2 text-center bg-white rounded-md bg-opacity-50 hover:bg-opacity-70">
            <button
              className="w-full"
              onClick={handleDirectionChange}>
              <p className="">【⇆】左右入替</p></button></div>

        </div>
      </Card>
    </div>
    
  )
})

export default TimeCaption
