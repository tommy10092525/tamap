"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { Buildings, BusTime, Caption, Style } from "../app/components/Types"
import TimeCaption from "./components/TimeCaption";
import StationSwitch from "./components/StationSwitch";
import MapCaption from "./components/MapCaption";
import DiscountInformation from "./components/DiscountInformation";
import Logo from "./components/Logo";
import LinkBox from "./components/LinkBox";
import { dayIndices, findNextBuses, minutesToTime, } from "./features/timeHandlers";
import { buildings, holidaysAPI, inquiryURL, stationNames, timeTableAPI } from "@/constants/settings";
import { initializeCaption, holidaysFetcher, timeTableFetcher } from "./features/utilities";
import TimeBox from "./components/TimeBox";


// 現在の時刻と曜日を取得

export default function Home() {
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDay = dayIndices[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();


  const { data: holidayData, error: holidayError, isLoading: holidayIsLoading } = useSWR(holidaysAPI, holidaysFetcher);
  let { data: timeTable, error: timeTableError, isLoading: timeTableIsLoading } = useSWR(timeTableAPI, timeTableFetcher);


  let [userInput, setUserInput] = useState({ isComingToHosei: true, station: "nishihachioji", showModal: false });
  let [_, setNow] = useState(new Date(`2000/1/1 ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`));

  const initializeUserInput = () => {
    if (localStorage.getItem("firstAccessed") === "false") {
      // ２回目以降のアクセスにはlocalStorageから入力を復元する
      let isComingToHosei: string | null = localStorage.getItem("isComingToHosei");
      let station: string | null = localStorage.getItem("station");
      if ("string" === typeof isComingToHosei && "string" === typeof station) {
        setUserInput({ isComingToHosei: true, station: station, showModal: false });
      } else {
        alert("localStorageのエラー");
      }
    } else {
      // 初回アクセス時にはlocalStorageに必要な値を格納する
      localStorage.setItem("firstAccessed", "false");
      localStorage.setItem("isComingToHosei", "true");
      localStorage.setItem("station", "nishihachioji");
    }
  }

  // ページ読み込み時の処理
  // https://qiita.com/iwakeniwaken/items/3c3e212599e411da54e2
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(_ => new Date());
    }, 1000);
    initializeUserInput();
    return () => clearInterval(interval);
  }, [])

  let caption: Caption;
  let firstBus: BusTime | null;
  let secondBus: BusTime | null;
  
  if (!timeTableIsLoading && !!timeTable && !holidayIsLoading && !!holidayData) {
    // 駅と方向から絞る
    timeTable = timeTable
    .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station)
    const tmpArr = findNextBuses(timeTable, holidayData, currentDay, currentHour, currentMinutes, now);
    firstBus = tmpArr[0];
    secondBus = tmpArr[1];
    
    
  } else {
    firstBus=null
    secondBus=null
  }
  caption = useMemo(() =>initializeCaption({ userInput, minutesToTime, firstBus, isLoading: holidayIsLoading || timeTableIsLoading }),
  [firstBus,userInput,holidayIsLoading,timeTableIsLoading]);


  let style=useMemo(()=>{
    let style: Style = { nishihachioji: {}, mejirodai: {}, aihara: {} };
    if(!timeTableIsLoading&&!holidayIsLoading){
      style[userInput.station]={color:"blue"}
    }
    return style;
  },[userInput,holidayIsLoading,timeTableIsLoading])

  // API取得にエラーが生じた場合エラーをコンソールに吐く
  if (timeTableError) {
    console.log(timeTableError);
  }

  const handleDirectionChange = useCallback(() => {
    if (userInput.isComingToHosei) {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = false;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "false")
    } else {
      let nextUserInput = structuredClone(userInput);
      nextUserInput.isComingToHosei = true;
      setUserInput(nextUserInput);
      localStorage.setItem("isComingToHosei", "true")
    }
  },[userInput])

  const handleShowModalChange = useCallback(() => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.showModal = !nextUserInput.showModal;
    setUserInput(nextUserInput);
  },[userInput])

  const handleStationChange = useCallback((station: string) => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.station = station;
    nextUserInput.showModal = false;
    setUserInput(nextUserInput);
    localStorage.setItem("station", station);
  },[userInput])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-orange-300 dark:from-orange-400 dark:to-indigo-600 p-5">
      <div className="max-w-screen-sm">
        <Logo />
        <TimeCaption
          caption={caption}
          firstBus={firstBus}
          secondBus={secondBus}
          isLoading={timeTableIsLoading || holidayIsLoading}
          handleDirectionChange={handleDirectionChange}
          minutesToTime={minutesToTime}
        />
        <StationSwitch
          isLoading={holidayIsLoading || timeTableIsLoading}
          userInput={userInput}
          handleShowModalChange={handleShowModalChange}
          handleStationChange={handleStationChange}
          style={style}
        />
        <MapCaption
          caption={caption}
          isLoading={timeTableIsLoading || holidayIsLoading}
        />
        <DiscountInformation text="飲食店割引はこちらから" />

        <div className="flex flex-wrap justify-center w-full">
          <LinkBox text="ご意見" url={inquiryURL} />
          <LinkBox text="アプリを共有" url="" />
          <LinkBox text="CODE MATES︎とは" url="" />
          <LinkBox text="Instagram" url="" />
        </div>
        <p className="text-xs">時間は目安であり、交通状況等により変わることがあります。利用上の注意を読む→</p>
        <p className="flex justify-center items-center text-center text-lg">©CODE MATES︎</p>
      </div>
    </div>
  );
}
