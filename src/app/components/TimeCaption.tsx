import React from 'react'
import { BusTime, Caption } from "./Types"
import Card from './Card';


type TimeCaptionProps = {
  firstBus: BusTime | null,
  secondBus: BusTime | null,
  caption: Caption,
  isLoading: boolean;
  handleDirectionChange: () => void
  minutesToTime: (minutes: number) => string
}

const TimeCaption = (props: TimeCaptionProps) => {
  let { firstBus, secondBus, caption, isLoading, handleDirectionChange, minutesToTime } = props;
  return (
    <div className="w-full">
      <Card>
        <div className="text-center justify-center text-2xl font-bold pt-4">
          <p>{`${caption.left}→${caption.right}`}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-4xl font-bold">
          <p className="px-1">{!isLoading && firstBus ? minutesToTime(firstBus.leaveHour * 60 + firstBus.leaveMinute) : "loading"}</p>
          <p className="px-1">{!isLoading && firstBus ? minutesToTime(firstBus.arriveHour * 60 + firstBus.arriveMinute) : "loading"}</p>
        </div>
        <div className="flex justify-center mx-0 text-center text-2xl font-bold opacity-50">
          <p className="px-1">{!isLoading && secondBus ? minutesToTime(secondBus.leaveHour * 60 + secondBus.leaveMinute) : "loading"}</p>
          <p className="px-1">{!isLoading && secondBus ? minutesToTime(secondBus.arriveHour * 60 + secondBus.arriveMinute) : "loading"}</p>
        </div>
        <div className="inline-flex text-center items-center mx-auto font-bold w-full">
          {/* ボタンが押されたら状態を書き換える */}
          <div className="my-2 mx-auto border-solid w-1/2 text-center">
            <Card>
              <button
                className="w-full"
                onClick={handleDirectionChange}>
                <p className="">(⇆)左右入替</p></button>
            </Card>
          </div>
        </div>
      </Card>

    </div>

  )
}

export default TimeCaption
