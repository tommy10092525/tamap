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
import GradationContainer from "./components/GradationContainer";


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
  let futureBuses: BusTime[];
  let previousBuses: BusTime[];

  if (!isTimeTableLoading && !!timeTable && !isHolidayLoading && !!holidayData) {
    // 駅と方向から絞る
    timeTable = timeTable
      .filter(item => item.isComingToHosei == userInput.isComingToHosei && item.station == userInput.station)
    futureBuses = findNextBuses({ timeTable, holidayData, currentDay, currentHour, currentMinutes, currentDate: now, busesLength: 3 });
    previousBuses = findNextBuses({ timeTable, holidayData, currentDay, currentHour, currentMinutes, currentDate: now, busesLength: -2 });


  } else {
    futureBuses = []
    previousBuses = []
  }
  caption = useMemo(() => initializeCaption({ userInput, minutesToTime, futureBuses, previousBuses, isLoading: isHolidayLoading || isTimeTableLoading }),
    [futureBuses,previousBuses, userInput, isHolidayLoading, isTimeTableLoading]);


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


  return (
    <GradationContainer>
      <div className="max-w-screen-sm">
        <Logo />
        <TimeCaption
          caption={caption}
          isLoading={isTimeTableLoading || isHolidayLoading}
          handleDirectionChange={handleDirectionChange}
        />
        {/* <Card>
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
        </Card> */}

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
        <p className="text-xs">時刻ひゃめやうs出会いR、交通状況等によって変わる可能性があります。また臨時分党には対応しておりません。</p>
        <p className="flex justify-center items-center text-center text-lg">©CODE MATES︎</p>
      </div>
    </GradationContainer>
  );
}

export default Home;