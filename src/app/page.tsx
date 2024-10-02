"use client";
import { useCallback, useEffect, useMemo, useState as rerender, useState } from "react";
import useSWR from "swr";

import { Buildings, BusTime, Caption, Style } from "../app/components/Types"
import TimeCaption from "./components/TimeCaption";
import StationSwitch from "./components/StationSwitch";
import MapCaption from "./components/MapCaption";
import DiscountInformation from "./components/DiscountInformation";
import Logo from "./components/Logo";
import LinkBox from "./components/LinkBox";
import { dayIndices, findNextBuses, minutesToTime, } from "./features/timeHandlers";
import { buildings, holidaysAPI, GoogleForm, stationNames, timeTableAPI } from "@/constants/settings";
import { initializeCaption, holidaysFetcher, timeTableFetcher } from "./features/utilities";
import Card from "./components/Card";


// 現在の時刻と曜日を取得

const Home = () => {
  const currentDate = new Date();
  const now = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes(),
    currentDate.getSeconds()
  );
  console.log(now)
  const currentDayIndex = now.getDay();
  const currentDay = dayIndices[currentDayIndex];
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const [_, rerender] = useState([]);

  const { data: holidayData, error: holidayError, isLoading: isHolidayLoading } = useSWR(holidaysAPI, holidaysFetcher);
  let { data: timeTable, error: timeTableError, isLoading: isTimeTableLoading } = useSWR(timeTableAPI, timeTableFetcher);


  let [userInput, setUserInput] = useState({ isComingToHosei: true, station: "nishihachioji", showModal: false });
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
    rerender([]);
    const interval = setInterval(() => {
      rerender([]);
    }, 1000);
    initializeUserInput();
    return () => clearInterval(interval);
  }, [])

  let caption: Caption;
  let firstBus: BusTime | null;
  let secondBus: BusTime | null;

  if (!isTimeTableLoading && !!timeTable && !isHolidayLoading && !!holidayData) {
    // 駅と方向から絞る
    timeTable = timeTable
      .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station)
    const tmpArr = findNextBuses(timeTable, holidayData, currentDay, currentHour, currentMinutes, now);
    firstBus = tmpArr[0];
    secondBus = tmpArr[1];


  } else {
    firstBus = null
    secondBus = null
  }
  caption = useMemo(() => initializeCaption({ userInput, minutesToTime, firstBus, isLoading: isHolidayLoading || isTimeTableLoading }),
    [firstBus, userInput, isHolidayLoading, isTimeTableLoading]);


  let style = useMemo(() => {
    let style: Style = { nishihachioji: {}, mejirodai: {}, aihara: {} };
    if (!isTimeTableLoading && !isHolidayLoading) {
      style[userInput.station] = { backgroundColor: "rgb(0,255,255,0.8)" }
    }
    return style;
  }, [userInput, isHolidayLoading, isTimeTableLoading])

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
  }, [userInput])

  const handleShowModalChange = useCallback(() => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.showModal = !nextUserInput.showModal;
    setUserInput(nextUserInput);
  }, [userInput])

  const handleStationChange = useCallback((station: string) => {
    let nextUserInput = structuredClone(userInput);
    nextUserInput.station = station;
    nextUserInput.showModal = false;
    setUserInput(nextUserInput);
    localStorage.setItem("station", station);
  }, [userInput])

  // console.log(now);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-orange-300 dark:from-orange-400 dark:to-indigo-600 p-5">
      <div className="max-w-screen-sm">
        <Logo />
        <TimeCaption
          firstBus={firstBus}
          secondBus={secondBus}
          isLoading={isTimeTableLoading || isHolidayLoading}
          handleDirectionChange={handleDirectionChange}
        />
        <Card>
          <div className="my-3 text-center">
            <p className="text-xl font-semibold m-1"
              suppressHydrationWarning={true}>{[
                "現在時刻:",
                String(now.getHours()).padStart(2, "0"),
                ":",
                String(now.getMinutes()).padStart(2, "0"),
                ":",
                String(now.getSeconds()).padStart(2, "0")
              ]}</p>
          </div>
        </Card>

        <StationSwitch
          isLoading={isHolidayLoading || isTimeTableLoading}
          userInput={userInput}
          handleShowModalChange={handleShowModalChange}
          handleStationChange={handleStationChange}
          style={style}
        />
        <MapCaption
          caption={caption}
          isLoading={isTimeTableLoading || isHolidayLoading}
        />
        <DiscountInformation text="飲食店割引はこちらから" />

        <div className="flex flex-wrap justify-center w-full">
          <LinkBox text="ご意見" url={GoogleForm} />
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

export default Home;